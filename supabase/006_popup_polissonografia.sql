-- =====================================================================
-- Instituto do Sono — ajuste 006: pop-up da polissonografia (só particular)
-- Rodar depois do 005. Supabase → SQL Editor → New query → cole tudo → Run
-- =====================================================================

-- ---------- Recebe um lote de eventos do site (agora aceita polisso_open / polisso_close) ----------
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
         case when (e->>'value') ~ '^-?\d+(\.\d+)?$' then least((e->>'value')::numeric, case when e->>'type' = 'page_time' then 14400 else 1800 end) else null end
  from jsonb_array_elements(v_events) as e
  where e->>'type' in ('pageview','page_time','section_view','section_time','click','ebook_open','ebook_close','ebook_submit','polisso_open','polisso_close')
  limit 200;

  update site_sessions set
    pageviews        = pageviews + (select count(*) from jsonb_array_elements(v_events) e where e->>'type' = 'pageview'),
    clicked_whatsapp = clicked_whatsapp or exists (select 1 from jsonb_array_elements(v_events) e where e->>'type' = 'click' and e->>'target' = 'whatsapp'),
    converted_lead   = converted_lead   or exists (select 1 from jsonb_array_elements(v_events) e where e->>'type' = 'ebook_submit')
  where id = v_sid;
end;
$$;

-- ---------- Painel: funil do pop-up da polissonografia ----------
-- Visitas que COMEÇARAM no período (mesma regra do painel).
create or replace function public.admin_polisso(p_from timestamptz, p_to timestamptz, p_include_test boolean default false)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with s as (
  select id, device from site_sessions
  where started_at >= p_from and started_at < p_to
    and (p_include_test or not is_test)
),
e as (
  select ev.*, s.device from site_events ev join s on s.id = ev.session_id
  where ev.type in ('polisso_open', 'polisso_close')
     or (ev.type = 'click' and ev.section = 'Pop-up polissonografia' and ev.target = 'whatsapp')
),
per as (
  select session_id, max(device) device,
         bool_or(type = 'polisso_open') opened,
         bool_or(type = 'click') continued,
         bool_or(type = 'polisso_close') closed,
         count(*) filter (where type = 'polisso_open') opens
  from e group by session_id
)
select jsonb_build_object(
  'opens',      (select count(*) from e where type = 'polisso_open'),
  'sessions',   (select count(*) from per where opened),
  'continued',  (select count(*) from per where continued),
  'gave_up',    (select count(*) from per where opened and not continued),
  'by_origin',  coalesce((
    select jsonb_agg(jsonb_build_object('label', label, 'section', section, 'opens', c) order by c desc)
    from (select coalesce(label, '—') label, coalesce(section, '—') section, count(*) c
          from e where type = 'polisso_open' group by 1, 2 order by 3 desc limit 15) t), '[]'::jsonb),
  'by_device',  coalesce((
    select jsonb_agg(jsonb_build_object('device', d, 'sessions', o, 'continued', c) order by o desc)
    from (select coalesce(device, '?') d, count(*) filter (where opened) o, count(*) filter (where continued) c
          from per group by 1) t), '[]'::jsonb),
  'by_day',     coalesce((
    select jsonb_agg(jsonb_build_object('day', d, 'opens', o, 'continued', c) order by d)
    from (select to_char(created_at at time zone 'America/Sao_Paulo', 'YYYY-MM-DD') d,
                 count(*) filter (where type = 'polisso_open') o,
                 count(*) filter (where type = 'click') c
          from e group by 1) t), '[]'::jsonb)
);
$$;

revoke all on function public.track_batch(jsonb) from public, anon, authenticated;
grant execute on function public.track_batch(jsonb) to service_role;
revoke all on function public.admin_polisso(timestamptz, timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.admin_polisso(timestamptz, timestamptz, boolean) to service_role;
