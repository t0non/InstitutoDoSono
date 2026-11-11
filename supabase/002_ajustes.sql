-- =====================================================================
-- Instituto do Sono — ajustes de precisão do painel (rodar UMA vez, depois do schema.sql)
-- Supabase → SQL Editor → New query → cole tudo → Run
-- =====================================================================

-- Marca visitas de teste (localhost e o próprio admin logado) para não misturar com dados reais
alter table public.site_sessions add column if not exists is_test  boolean not null default false;
alter table public.site_sessions add column if not exists hostname text;
alter table public.leads         add column if not exists is_test  boolean not null default false;
create index if not exists site_sessions_real_idx on public.site_sessions (is_test, started_at desc);
create index if not exists site_sessions_seen_idx on public.site_sessions (last_seen_at desc);

-- Dados antigos vindos do computador local viram "teste"
update public.site_sessions set is_test = true where hostname is null;  -- tudo que existia antes deste ajuste veio dos testes no computador
update public.leads l set is_test = true from public.site_sessions s where s.id = l.session_id and s.is_test;

-- ---------- Recebe um lote de eventos do site ----------
create or replace function public.track_batch(p jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s jsonb := p->'session';
  v_sid text := s->>'id';
  v_events jsonb := coalesce(p->'events', '[]'::jsonb);
begin
  if v_sid is null or length(v_sid) > 64 then return; end if;
  if jsonb_typeof(v_events) <> 'array' then v_events := '[]'::jsonb; end if;

  insert into site_sessions as ss (
    id, visitor_id, started_at, last_seen_at, active_seconds, max_scroll,
    landing_page, last_page, referrer, referrer_host,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid,
    device, os, browser, screen, language, timezone,
    country, region, city, is_returning, is_test, hostname
  ) values (
    v_sid, s->>'visitor_id', now(), now(),
    least(greatest(coalesce((s->>'active_seconds')::int, 0), 0), 14400),
    least(greatest(coalesce((s->>'max_scroll')::int, 0), 0), 100),
    left(s->>'landing_page', 300), left(s->>'page', 300), left(s->>'referrer', 500), left(s->>'referrer_host', 200),
    left(s->>'utm_source', 120), left(s->>'utm_medium', 120), left(s->>'utm_campaign', 200),
    left(s->>'utm_term', 200), left(s->>'utm_content', 200), left(s->>'gclid', 200),
    left(s->>'device', 20), left(s->>'os', 40), left(s->>'browser', 40), left(s->>'screen', 20),
    left(s->>'language', 20), left(s->>'timezone', 60),
    left(s->>'country', 60), left(s->>'region', 80), left(s->>'city', 80),
    coalesce((s->>'is_returning')::boolean, false),
    coalesce((s->>'is_test')::boolean, false),
    left(s->>'hostname', 120)
  )
  on conflict (id) do update set
    last_seen_at   = now(),
    active_seconds = greatest(ss.active_seconds, least(greatest(coalesce((s->>'active_seconds')::int, 0), 0), 14400)),
    max_scroll     = greatest(ss.max_scroll, least(greatest(coalesce((s->>'max_scroll')::int, 0), 0), 100)),
    last_page      = coalesce(left(s->>'page', 300), ss.last_page),
    country        = coalesce(ss.country, left(s->>'country', 60)),
    region         = coalesce(ss.region, left(s->>'region', 80)),
    city           = coalesce(ss.city, left(s->>'city', 80)),
    is_test        = ss.is_test or coalesce((s->>'is_test')::boolean, false);

  insert into site_events (session_id, visitor_id, created_at, type, page, section, label, target, href, value)
  select v_sid,
         s->>'visitor_id',
         case when (e->>'ts') ~ '^\d{4}-\d{2}-\d{2}T' and (e->>'ts')::timestamptz between now() - interval '1 day' and now() + interval '5 minutes'
              then (e->>'ts')::timestamptz else now() end,
         left(e->>'type', 30),
         left(e->>'page', 300),
         left(e->>'section', 60),
         left(e->>'label', 120),
         left(e->>'target', 30),
         left(e->>'href', 300),
         case when (e->>'value') ~ '^-?\d+(\.\d+)?$' then least((e->>'value')::numeric, 1800) else null end
  from jsonb_array_elements(v_events) as e
  where e->>'type' in ('pageview','section_view','section_time','click','ebook_open','ebook_close','ebook_submit')
  limit 200;

  update site_sessions set
    pageviews        = pageviews + (select count(*) from jsonb_array_elements(v_events) e where e->>'type' = 'pageview'),
    clicked_whatsapp = clicked_whatsapp or exists (select 1 from jsonb_array_elements(v_events) e where e->>'type' = 'click' and e->>'target' = 'whatsapp'),
    converted_lead   = converted_lead   or exists (select 1 from jsonb_array_elements(v_events) e where e->>'type' = 'ebook_submit')
  where id = v_sid;
end;
$$;

-- ---------- Painel ----------
-- Regras:
--  * Visitas = sessões que COMEÇARAM no período (horário de Brasília).
--  * Eventos (seções, cliques) = os dessas mesmas visitas, para os números baterem entre si.
--  * Leads = cadastros feitos no período.
--  * Testes (localhost / admin logado) ficam fora, a não ser que p_include_test = true.
drop function if exists public.admin_dashboard(timestamptz, timestamptz);
create or replace function public.admin_dashboard(p_from timestamptz, p_to timestamptz, p_include_test boolean default false)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with
s as (
  select * from site_sessions
  where started_at >= p_from and started_at < p_to
    and (p_include_test or not is_test)
),
e as (
  select ev.* from site_events ev join s on s.id = ev.session_id
),
l as (
  select * from leads where created_at >= p_from and created_at < p_to and (p_include_test or not is_test)
),
tot as (select count(*)::numeric n from s)
select jsonb_build_object(
  'totals', (
    select jsonb_build_object(
      'sessions',          count(*),
      'visitors',          count(distinct visitor_id),
      'new_visitors',      count(*) filter (where not is_returning),
      'returning',         count(*) filter (where is_returning),
      'avg_seconds',       coalesce(round(avg(active_seconds)), 0),
      'median_seconds',    coalesce(round(percentile_cont(0.5) within group (order by active_seconds)::numeric), 0),
      'engaged',           count(*) filter (where active_seconds >= 10 or pageviews > 1),
      'bounce_rate',       coalesce(round(100.0 * count(*) filter (where active_seconds < 10 and pageviews <= 1) / nullif(count(*),0), 1), 0),
      'avg_scroll',        coalesce(round(avg(max_scroll)), 0),
      'pageviews',         coalesce(sum(pageviews), 0),
      'whatsapp_sessions', count(*) filter (where clicked_whatsapp),
      'whatsapp_rate',     coalesce(round(100.0 * count(*) filter (where clicked_whatsapp) / nullif(count(*),0), 1), 0),
      'whatsapp_clicks',   (select count(*) from e where type = 'click' and target = 'whatsapp'),
      'phone_clicks',      (select count(*) from e where type = 'click' and target = 'phone'),
      'leads',             (select count(*) from l),
      'lead_rate',         coalesce(round(100.0 * (select count(*) from l) / nullif(count(*),0), 1), 0)
    ) from s
  ),
  'online_now', (select count(*) from site_sessions where last_seen_at > now() - interval '5 minutes' and (p_include_test or not is_test)),
  'by_day', coalesce((
    select jsonb_agg(x order by x->>'day') from (
      select jsonb_build_object(
        'day', d::date,
        'sessions', (select count(*) from s where (started_at at time zone 'America/Sao_Paulo')::date = d::date),
        'leads',    (select count(*) from l where (created_at at time zone 'America/Sao_Paulo')::date = d::date),
        'whatsapp', (select count(*) from s where clicked_whatsapp and (started_at at time zone 'America/Sao_Paulo')::date = d::date)
      ) x
      from generate_series((p_from at time zone 'America/Sao_Paulo')::date, ((p_to - interval '1 second') at time zone 'America/Sao_Paulo')::date, interval '1 day') d
    ) t), '[]'::jsonb),
  'by_hour', coalesce((
    select jsonb_agg(jsonb_build_object('hour', g.h,
      'sessions', (select count(*) from s where extract(hour from started_at at time zone 'America/Sao_Paulo') = g.h),
      'whatsapp', (select count(*) from s where clicked_whatsapp and extract(hour from started_at at time zone 'America/Sao_Paulo') = g.h)) order by g.h)
    from generate_series(0,23) g(h)), '[]'::jsonb),
  'by_weekday', coalesce((
    select jsonb_agg(jsonb_build_object('dow', g.d, 'sessions', (select count(*) from s where extract(dow from started_at at time zone 'America/Sao_Paulo') = g.d)) order by g.d)
    from generate_series(0,6) g(d)), '[]'::jsonb),
  'sections', coalesce((
    select jsonb_agg(x order by (x->>'reach')::numeric desc) from (
      select jsonb_build_object(
        'section', section,
        'sessions', count(distinct session_id) filter (where type = 'section_view'),
        'reach', round(100.0 * count(distinct session_id) filter (where type = 'section_view') / nullif((select n from tot),0), 1),
        'total_seconds', coalesce(round(sum(value) filter (where type = 'section_time')), 0),
        'avg_seconds', coalesce(round(sum(value) filter (where type = 'section_time') / nullif(count(distinct session_id) filter (where type = 'section_view'),0), 1), 0)
      ) x
      from e where section is not null and type in ('section_view','section_time')
      group by section
    ) t), '[]'::jsonb),
  'clicks', coalesce((
    select jsonb_agg(x order by (x->>'clicks')::int desc) from (
      select jsonb_build_object('label', label, 'target', target, 'section', section, 'clicks', count(*), 'sessions', count(distinct session_id)) x
      from e where type = 'click'
      group by label, target, section
      order by count(*) desc limit 40
    ) t), '[]'::jsonb),
  'click_targets', coalesce((
    select jsonb_agg(jsonb_build_object('target', target, 'clicks', c, 'sessions', ss) order by c desc)
    from (select coalesce(target,'outro') target, count(*) c, count(distinct session_id) ss from e where type = 'click' group by 1) t), '[]'::jsonb),
  'whatsapp_by_section', coalesce((
    select jsonb_agg(jsonb_build_object('section', section, 'clicks', c) order by c desc)
    from (select coalesce(section,'Outro') section, count(*) c from e where type = 'click' and target = 'whatsapp' group by 1) t), '[]'::jsonb),
  'pages', coalesce((
    select jsonb_agg(jsonb_build_object('page', page, 'views', c, 'sessions', ss) order by c desc)
    from (select page, count(*) c, count(distinct session_id) ss from e where type = 'pageview' group by page order by c desc limit 20) t), '[]'::jsonb),
  'landing_pages', coalesce((
    select jsonb_agg(jsonb_build_object('page', landing_page, 'sessions', c, 'whatsapp', wa) order by c desc)
    from (select landing_page, count(*) c, count(*) filter (where clicked_whatsapp) wa from s group by 1 order by c desc limit 15) t), '[]'::jsonb),
  'sources', coalesce((
    select jsonb_agg(jsonb_build_object('source', src, 'sessions', c, 'leads', ld, 'whatsapp', wa, 'avg_seconds', a) order by c desc)
    from (
      select case
               when utm_source is not null and utm_source <> '' then utm_source || coalesce(' / ' || nullif(utm_medium,''), '')
               when referrer_host ~ '(^|\.)google\.' then 'google / orgânico'
               when referrer_host ~ '(instagram|facebook|fb)\.' then referrer_host || ' / social'
               when referrer_host is not null and referrer_host <> '' then referrer_host
               else 'Direto (digitou ou link salvo)'
             end src,
             count(*) c, count(*) filter (where converted_lead) ld, count(*) filter (where clicked_whatsapp) wa, round(avg(active_seconds)) a
      from s group by 1 order by c desc limit 20) t), '[]'::jsonb),
  'campaigns', coalesce((
    select jsonb_agg(jsonb_build_object('campaign', utm_campaign, 'source', utm_source, 'medium', utm_medium, 'sessions', c, 'leads', ld, 'whatsapp', wa) order by c desc)
    from (select utm_campaign, utm_source, utm_medium, count(*) c, count(*) filter (where converted_lead) ld, count(*) filter (where clicked_whatsapp) wa
          from s where utm_campaign is not null group by 1,2,3 order by c desc limit 20) t), '[]'::jsonb),
  'devices', coalesce((
    select jsonb_agg(jsonb_build_object('device', device, 'sessions', c, 'avg_seconds', a, 'whatsapp', wa) order by c desc)
    from (select coalesce(device,'?') device, count(*) c, round(avg(active_seconds)) a, count(*) filter (where clicked_whatsapp) wa from s group by 1) t), '[]'::jsonb),
  'browsers', coalesce((
    select jsonb_agg(jsonb_build_object('name', browser, 'sessions', c) order by c desc)
    from (select coalesce(browser,'?') browser, count(*) c from s group by 1 order by c desc limit 8) t), '[]'::jsonb),
  'os', coalesce((
    select jsonb_agg(jsonb_build_object('name', os, 'sessions', c) order by c desc)
    from (select coalesce(os,'?') os, count(*) c from s group by 1 order by c desc limit 8) t), '[]'::jsonb),
  'cities', coalesce((
    select jsonb_agg(jsonb_build_object('city', city, 'region', region, 'sessions', c, 'leads', ld, 'whatsapp', wa) order by c desc)
    from (select coalesce(city, 'Não identificada') city, region, count(*) c, count(*) filter (where converted_lead) ld, count(*) filter (where clicked_whatsapp) wa
          from s group by 1,2 order by c desc limit 25) t), '[]'::jsonb),
  'scroll', coalesce((
    select jsonb_agg(jsonb_build_object('bucket', b, 'sessions', c) order by b)
    from (select least(max_scroll / 25 * 25, 100) b, count(*) c from s group by 1) t), '[]'::jsonb),
  'durations', coalesce((
    select jsonb_agg(jsonb_build_object('bucket', b, 'sessions', c) order by o)
    from (
      select case when active_seconds < 10 then '0–10s' when active_seconds < 30 then '10–30s'
                  when active_seconds < 60 then '30s–1min' when active_seconds < 180 then '1–3min'
                  when active_seconds < 600 then '3–10min' else '10min+' end b,
             min(active_seconds) o, count(*) c
      from s group by 1) t), '[]'::jsonb),
  'ebook', jsonb_build_object(
    'opens',   (select count(distinct session_id) from e where type = 'ebook_open'),
    'offer_clicks', (select count(distinct session_id) from e where type = 'click' and section = 'Pop-up do e-book' and label ilike 'receber%'),
    'closes',  (select count(distinct session_id) from e where type = 'ebook_close'),
    'submits', (select count(*) from l)
  )
);
$$;

revoke all on function public.track_batch(jsonb) from public, anon, authenticated;
revoke all on function public.admin_dashboard(timestamptz, timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.track_batch(jsonb) to service_role;
grant execute on function public.admin_dashboard(timestamptz, timestamptz, boolean) to service_role;
