-- =====================================================================
-- Depois de rodar este arquivo, rode também o 002_ajustes.sql.
-- Instituto do Sono — analytics + leads do e-book
-- Rode este arquivo inteiro no Supabase: SQL Editor → New query → Run
-- =====================================================================

-- ---------- Tabelas ----------

create table if not exists public.site_sessions (
  id               text primary key,               -- id aleatório da visita (gerado no navegador)
  visitor_id       text,                           -- id do aparelho (identifica quem volta)
  started_at       timestamptz not null default now(),
  last_seen_at     timestamptz not null default now(),
  active_seconds   integer not null default 0,     -- tempo com a aba aberta e visível
  pageviews        integer not null default 0,
  max_scroll       integer not null default 0,     -- % da página mais funda que a pessoa chegou
  landing_page     text,
  last_page        text,
  referrer         text,
  referrer_host    text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_term         text,
  utm_content      text,
  gclid            text,
  device           text,                           -- mobile | tablet | desktop
  os               text,
  browser          text,
  screen           text,
  language         text,
  timezone         text,
  country          text,
  region           text,
  city             text,
  is_returning     boolean not null default false,
  clicked_whatsapp boolean not null default false,
  converted_lead   boolean not null default false
);

create table if not exists public.site_events (
  id          bigserial primary key,
  session_id  text not null references public.site_sessions(id) on delete cascade,
  visitor_id  text,
  created_at  timestamptz not null default now(),
  type        text not null,   -- pageview | section_view | section_time | click | ebook_open | ebook_close | ebook_submit
  page        text,
  section     text,
  label       text,
  target      text,            -- whatsapp | phone | maps | email | internal | external | button
  href        text,
  value       numeric
);

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  email         text not null,
  phone         text not null,
  consent       boolean not null default false,
  source        text not null default 'ebook',
  page          text,
  session_id    text,
  visitor_id    text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  device        text,
  city          text,
  region        text,
  country       text
);

create index if not exists site_sessions_started_idx on public.site_sessions (started_at desc);
create index if not exists site_sessions_visitor_idx on public.site_sessions (visitor_id);
create index if not exists site_events_created_idx   on public.site_events (created_at desc);
create index if not exists site_events_type_idx      on public.site_events (type, created_at desc);
create index if not exists site_events_session_idx   on public.site_events (session_id);
create index if not exists leads_created_idx         on public.leads (created_at desc);
create index if not exists leads_email_idx           on public.leads (lower(email));

-- Segurança: ninguém de fora lê ou escreve direto. Só o servidor do site (chave service_role).
alter table public.site_sessions enable row level security;
alter table public.site_events   enable row level security;
alter table public.leads         enable row level security;
revoke all on public.site_sessions, public.site_events, public.leads from anon, authenticated;

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
begin
  if v_sid is null or length(v_sid) > 64 then return; end if;

  insert into site_sessions as ss (
    id, visitor_id, started_at, last_seen_at, active_seconds, max_scroll,
    landing_page, last_page, referrer, referrer_host,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid,
    device, os, browser, screen, language, timezone,
    country, region, city, is_returning
  ) values (
    v_sid, s->>'visitor_id', now(), now(),
    least(coalesce((s->>'active_seconds')::int, 0), 86400),
    least(coalesce((s->>'max_scroll')::int, 0), 100),
    left(s->>'landing_page', 300), left(s->>'page', 300), left(s->>'referrer', 500), left(s->>'referrer_host', 200),
    left(s->>'utm_source', 120), left(s->>'utm_medium', 120), left(s->>'utm_campaign', 200),
    left(s->>'utm_term', 200), left(s->>'utm_content', 200), left(s->>'gclid', 200),
    left(s->>'device', 20), left(s->>'os', 40), left(s->>'browser', 40), left(s->>'screen', 20),
    left(s->>'language', 20), left(s->>'timezone', 60),
    left(s->>'country', 60), left(s->>'region', 80), left(s->>'city', 80),
    coalesce((s->>'is_returning')::boolean, false)
  )
  on conflict (id) do update set
    last_seen_at   = now(),
    active_seconds = greatest(ss.active_seconds, least(coalesce((s->>'active_seconds')::int, 0), 86400)),
    max_scroll     = greatest(ss.max_scroll, least(coalesce((s->>'max_scroll')::int, 0), 100)),
    last_page      = coalesce(left(s->>'page', 300), ss.last_page),
    country        = coalesce(ss.country, left(s->>'country', 60)),
    region         = coalesce(ss.region, left(s->>'region', 80)),
    city           = coalesce(ss.city, left(s->>'city', 80));

  insert into site_events (session_id, visitor_id, created_at, type, page, section, label, target, href, value)
  select v_sid,
         s->>'visitor_id',
         case when (e->>'ts') ~ '^\d{4}-' and (e->>'ts')::timestamptz between now() - interval '1 day' and now() + interval '5 minutes'
              then (e->>'ts')::timestamptz else now() end,
         left(e->>'type', 30),
         left(e->>'page', 300),
         left(e->>'section', 60),
         left(e->>'label', 120),
         left(e->>'target', 30),
         left(e->>'href', 300),
         nullif(e->>'value', '')::numeric
  from jsonb_array_elements(coalesce(p->'events', '[]'::jsonb)) as e
  where e->>'type' in ('pageview','section_view','section_time','click','ebook_open','ebook_close','ebook_submit')
  limit 200;

  update site_sessions set
    pageviews        = pageviews + (select count(*) from jsonb_array_elements(coalesce(p->'events','[]'::jsonb)) e where e->>'type' = 'pageview'),
    clicked_whatsapp = clicked_whatsapp or exists (select 1 from jsonb_array_elements(coalesce(p->'events','[]'::jsonb)) e where e->>'type' = 'click' and e->>'target' = 'whatsapp'),
    converted_lead   = converted_lead   or exists (select 1 from jsonb_array_elements(coalesce(p->'events','[]'::jsonb)) e where e->>'type' = 'ebook_submit')
  where id = v_sid;
end;
$$;

-- ---------- Tudo que o painel precisa, numa chamada só ----------
create or replace function public.admin_dashboard(p_from timestamptz, p_to timestamptz)
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
),
e as (
  select ev.* from site_events ev
  where ev.created_at >= p_from and ev.created_at < p_to
),
l as (
  select * from leads where created_at >= p_from and created_at < p_to
),
tot as (select count(*)::numeric n from s)
select jsonb_build_object(
  'totals', (
    select jsonb_build_object(
      'sessions',          count(*),
      'visitors',          count(distinct visitor_id),
      'returning',         count(*) filter (where is_returning),
      'avg_seconds',       coalesce(round(avg(active_seconds)), 0),
      'median_seconds',    coalesce(round(percentile_cont(0.5) within group (order by active_seconds)::numeric), 0),
      'bounce_rate',       coalesce(round(100.0 * count(*) filter (where active_seconds < 10 and pageviews <= 1) / nullif(count(*),0), 1), 0),
      'avg_scroll',        coalesce(round(avg(max_scroll)), 0),
      'pageviews',         coalesce(sum(pageviews), 0),
      'whatsapp_sessions', count(*) filter (where clicked_whatsapp),
      'whatsapp_rate',     coalesce(round(100.0 * count(*) filter (where clicked_whatsapp) / nullif(count(*),0), 1), 0),
      'leads',             (select count(*) from l),
      'lead_rate',         coalesce(round(100.0 * (select count(*) from l) / nullif(count(*),0), 1), 0)
    ) from s
  ),
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
    select jsonb_agg(jsonb_build_object('hour', h, 'sessions', c) order by h) from (
      select g.h, (select count(*) from s where extract(hour from started_at at time zone 'America/Sao_Paulo') = g.h) c
      from generate_series(0,23) g(h)
    ) t), '[]'::jsonb),
  'by_weekday', coalesce((
    select jsonb_agg(jsonb_build_object('dow', g.d, 'sessions', (select count(*) from s where extract(dow from started_at at time zone 'America/Sao_Paulo') = g.d)) order by g.d)
    from generate_series(0,6) g(d)), '[]'::jsonb),
  'sections', coalesce((
    select jsonb_agg(x order by (x->>'total_seconds')::numeric desc) from (
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
    select jsonb_agg(jsonb_build_object('target', target, 'clicks', c) order by c desc)
    from (select coalesce(target,'outro') target, count(*) c from e where type = 'click' group by 1) t), '[]'::jsonb),
  'pages', coalesce((
    select jsonb_agg(jsonb_build_object('page', page, 'views', c) order by c desc)
    from (select page, count(*) c from e where type = 'pageview' group by page order by c desc limit 20) t), '[]'::jsonb),
  'landing_pages', coalesce((
    select jsonb_agg(jsonb_build_object('page', landing_page, 'sessions', c) order by c desc)
    from (select landing_page, count(*) c from s group by 1 order by c desc limit 15) t), '[]'::jsonb),
  'sources', coalesce((
    select jsonb_agg(jsonb_build_object('source', src, 'sessions', c, 'leads', ld, 'whatsapp', wa) order by c desc)
    from (
      select coalesce(nullif(utm_source,''), nullif(referrer_host,''), 'Direto') src,
             count(*) c, count(*) filter (where converted_lead) ld, count(*) filter (where clicked_whatsapp) wa
      from s group by 1 order by c desc limit 20) t), '[]'::jsonb),
  'campaigns', coalesce((
    select jsonb_agg(jsonb_build_object('campaign', utm_campaign, 'source', utm_source, 'medium', utm_medium, 'sessions', c, 'leads', ld) order by c desc)
    from (select utm_campaign, utm_source, utm_medium, count(*) c, count(*) filter (where converted_lead) ld
          from s where utm_campaign is not null group by 1,2,3 order by c desc limit 20) t), '[]'::jsonb),
  'devices', coalesce((
    select jsonb_agg(jsonb_build_object('device', device, 'sessions', c, 'avg_seconds', a) order by c desc)
    from (select coalesce(device,'?') device, count(*) c, round(avg(active_seconds)) a from s group by 1) t), '[]'::jsonb),
  'browsers', coalesce((
    select jsonb_agg(jsonb_build_object('name', browser, 'sessions', c) order by c desc)
    from (select coalesce(browser,'?') browser, count(*) c from s group by 1 order by c desc limit 8) t), '[]'::jsonb),
  'os', coalesce((
    select jsonb_agg(jsonb_build_object('name', os, 'sessions', c) order by c desc)
    from (select coalesce(os,'?') os, count(*) c from s group by 1 order by c desc limit 8) t), '[]'::jsonb),
  'cities', coalesce((
    select jsonb_agg(jsonb_build_object('city', city, 'region', region, 'sessions', c, 'leads', ld) order by c desc)
    from (select coalesce(city, 'Não identificada') city, region, count(*) c, count(*) filter (where converted_lead) ld
          from s group by 1,2 order by c desc limit 25) t), '[]'::jsonb),
  'regions', coalesce((
    select jsonb_agg(jsonb_build_object('region', region, 'country', country, 'sessions', c) order by c desc)
    from (select coalesce(region,'Não identificada') region, country, count(*) c from s group by 1,2 order by c desc limit 15) t), '[]'::jsonb),
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
    'opens',   (select count(*) from e where type = 'ebook_open'),
    'closes',  (select count(*) from e where type = 'ebook_close'),
    'submits', (select count(*) from l)
  )
);
$$;

revoke all on function public.track_batch(jsonb) from public, anon, authenticated;
revoke all on function public.admin_dashboard(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.track_batch(jsonb) to service_role;
grant execute on function public.admin_dashboard(timestamptz, timestamptz) to service_role;
