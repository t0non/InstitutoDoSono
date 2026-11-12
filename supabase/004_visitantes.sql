-- =====================================================================
-- Instituto do Sono — ajuste 004: lista de visitantes (quantas vezes cada pessoa voltou)
-- Rodar depois do 003. Supabase → SQL Editor → New query → cole tudo → Run
-- =====================================================================
create index if not exists site_events_visitor_idx on public.site_events (visitor_id);
create index if not exists leads_visitor_idx on public.leads (visitor_id);

-- Cada aparelho/navegador recebe um código aleatório na primeira visita.
-- Se a pessoa se cadastrar no e-book, o nome e o telefone ficam ligados ao código.
create or replace function public.admin_visitors(p_from timestamptz, p_to timestamptz, p_include_test boolean default false)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with active as (
  select distinct visitor_id from site_sessions
  where started_at >= p_from and started_at < p_to and visitor_id is not null
    and (p_include_test or not is_test)
),
v as (
  select s.visitor_id,
         count(*) visits,
         count(*) filter (where s.started_at >= p_from and s.started_at < p_to) visits_period,
         min(s.started_at) first_seen,
         max(s.last_seen_at) last_seen,
         sum(s.active_seconds) total_seconds,
         sum(s.pageviews) pageviews,
         count(*) filter (where s.clicked_whatsapp) whatsapp_visits,
         (array_agg(s.city order by s.started_at desc) filter (where s.city is not null))[1] city,
         (array_agg(s.device order by s.started_at desc))[1] device,
         (array_agg(case
            when s.gclid is not null or s.utm_medium in ('cpc','ppc','paid','paid_social') then
              'Anúncio ' || initcap(coalesce(nullif(s.utm_source,''),'pago')) || coalesce(' · ' || nullif(s.utm_campaign,''), '')
            when nullif(s.utm_source,'') is not null then s.utm_source || coalesce(' / ' || nullif(s.utm_medium,''), '')
            when s.referrer_host ~ '(^|\.)google\.' then 'Google (busca orgânica)'
            when nullif(s.referrer_host,'') is not null then s.referrer_host
            else 'Direto' end order by s.started_at))[1] first_source
  from site_sessions s join active a on a.visitor_id = s.visitor_id
  where (p_include_test or not s.is_test)
  group by s.visitor_id
)
select coalesce(jsonb_agg(x order by (x->>'last_seen') desc), '[]'::jsonb) from (
  select jsonb_build_object(
    'code', upper(left(replace(v.visitor_id,'-',''), 6)),
    'visits', v.visits, 'visits_period', v.visits_period,
    'first_seen', v.first_seen, 'last_seen', v.last_seen,
    'total_seconds', v.total_seconds, 'pageviews', v.pageviews,
    'whatsapp_visits', v.whatsapp_visits,
    'phone_clicks', (select count(*) from site_events e where e.visitor_id = v.visitor_id and e.type = 'click' and e.target = 'phone'),
    'city', v.city, 'device', v.device, 'first_source', v.first_source,
    'name', l.name, 'phone', l.phone, 'email', l.email
  ) x
  from v
  left join lateral (select name, phone, email from leads where leads.visitor_id = v.visitor_id order by created_at desc limit 1) l on true
  order by v.last_seen desc
  limit 200
) t;
$$;

revoke all on function public.admin_visitors(timestamptz, timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.admin_visitors(timestamptz, timestamptz, boolean) to service_role;
