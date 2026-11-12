-- =====================================================================
-- Instituto do Sono — ajuste 005: palavras-chave dos anúncios (utm_term)
-- Supabase → SQL Editor → New query → cole tudo → Run
-- =====================================================================
create or replace function public.admin_keywords(p_from timestamptz, p_to timestamptz, p_include_test boolean default false)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
select coalesce(jsonb_agg(x order by (x->>'sessions')::int desc), '[]'::jsonb) from (
  select jsonb_build_object(
    'keyword', lower(utm_term),
    'campaign', (array_agg(utm_campaign order by started_at desc))[1],
    'sessions', count(*),
    'avg_seconds', round(avg(active_seconds)),
    'whatsapp', count(*) filter (where clicked_whatsapp),
    'leads', count(*) filter (where converted_lead)
  ) x
  from site_sessions
  where started_at >= p_from and started_at < p_to
    and (p_include_test or not is_test)
    and nullif(utm_term, '') is not null
  group by lower(utm_term)
  order by count(*) desc
  limit 50
) t;
$$;
revoke all on function public.admin_keywords(timestamptz, timestamptz, boolean) from public, anon, authenticated;
grant execute on function public.admin_keywords(timestamptz, timestamptz, boolean) to service_role;
