import Link from 'next/link';
import { sbRpc, sbSelect, isSupabaseConfigured } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

type Row = Record<string, string | number | null>;
type Dash = {
  totals: Record<string, number>;
  online_now: number;
  by_day: { day: string; sessions: number; leads: number; whatsapp: number }[];
  by_hour: { hour: number; sessions: number; whatsapp: number }[];
  by_weekday: { dow: number; sessions: number }[];
  sections: { section: string; sessions: number; reach: number; total_seconds: number; avg_seconds: number }[];
  clicks: { label: string; target: string; section: string; clicks: number; sessions: number }[];
  click_targets: { target: string; clicks: number; sessions: number }[];
  whatsapp_by_section: { section: string; clicks: number }[];
  pages: { page: string; views: number; sessions: number; reach: number; entrances: number; avg_seconds: number; whatsapp: number; whatsapp_sessions: number }[];
  landing_pages: { page: string; sessions: number; whatsapp: number }[];
  sources: { source: string; sessions: number; leads: number; whatsapp: number; avg_seconds: number }[];
  campaigns: { campaign: string; source: string; medium: string; sessions: number; leads: number; whatsapp: number }[];
  devices: { device: string; sessions: number; avg_seconds: number; whatsapp: number }[];
  browsers: { name: string; sessions: number }[];
  os: { name: string; sessions: number }[];
  cities: { city: string; region: string | null; sessions: number; leads: number; whatsapp: number }[];
  scroll: { bucket: number; sessions: number }[];
  durations: { bucket: string; sessions: number }[];
  ebook: { opens: number; offer_clicks: number; closes: number; submits: number };
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const TARGETS: Record<string, string> = { whatsapp: 'WhatsApp', phone: 'Telefone', maps: 'Google Maps', email: 'E-mail', internal: 'Link interno', external: 'Link externo', button: 'Botão', download: 'Download' };
const DEVICES: Record<string, string> = { mobile: 'Celular', desktop: 'Computador', tablet: 'Tablet' };
const PRESETS: Record<string, string> = { hoje: 'Hoje', ontem: 'Ontem', '7d': '7 dias', '30d': '30 dias', mes: 'Este mês', '90d': '90 dias' };

const fmtTime = (s: number) => {
  s = Math.round(Number(s) || 0);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m < 60 ? `${m}min ${r.toString().padStart(2, '0')}s` : `${Math.floor(m / 60)}h ${m % 60}min`;
};
const n = (v: number) => Number(v || 0).toLocaleString('pt-BR');
const pad = (x: number) => String(x).padStart(2, '0');

// Brasília é UTC-3 o ano todo (sem horário de verão desde 2019)
const spDate = (y: number, m: number, d: number) => new Date(`${y}-${pad(m)}-${pad(d)}T00:00:00-03:00`);
function todaySP() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-').map(Number);
  return { y: parts[0], m: parts[1], d: parts[2] };
}
const addDays = (dt: Date, days: number) => new Date(dt.getTime() + days * 86400_000);

function resolvePeriod(p?: string, mParam?: string) {
  const t = todaySP();
  const today = spDate(t.y, t.m, t.d);
  const tomorrow = addDays(today, 1);
  if (mParam && /^\d{4}-\d{2}$/.test(mParam)) {
    const [y, m] = mParam.split('-').map(Number);
    const from = spDate(y, m, 1);
    const to = m === 12 ? spDate(y + 1, 1, 1) : spDate(y, m + 1, 1);
    return { key: `m:${mParam}`, label: `${MONTHS[m - 1]} de ${y}`, from, to: to > tomorrow ? tomorrow : to };
  }
  switch (p) {
    case 'hoje': return { key: 'hoje', label: 'Hoje', from: today, to: tomorrow };
    case 'ontem': return { key: 'ontem', label: 'Ontem', from: addDays(today, -1), to: today };
    case '30d': return { key: '30d', label: 'Últimos 30 dias', from: addDays(today, -29), to: tomorrow };
    case '90d': return { key: '90d', label: 'Últimos 90 dias', from: addDays(today, -89), to: tomorrow };
    case 'mes': return { key: 'mes', label: `${MONTHS[t.m - 1]} (até hoje)`, from: spDate(t.y, t.m, 1), to: tomorrow };
    default: return { key: '7d', label: 'Últimos 7 dias', from: addDays(today, -6), to: tomorrow };
  }
}

function lastMonths(count = 12) {
  const t = todaySP();
  const out: { value: string; label: string }[] = [];
  let y = t.y, m = t.m;
  for (let i = 0; i < count; i++) {
    out.push({ value: `${y}-${pad(m)}`, label: `${MONTHS[m - 1]} ${y}` });
    m -= 1; if (m === 0) { m = 12; y -= 1; }
  }
  return out;
}

function Delta({ now, prev, invert = false, suffix = '%' }: { now: number; prev: number | undefined; invert?: boolean; suffix?: string }) {
  if (prev == null) return null;
  if (!prev && !now) return <em className="adm-delta">—</em>;
  if (!prev) return <em className="adm-delta up">novo</em>;
  const diff = suffix === 'pp' ? now - prev : ((now - prev) / prev) * 100;
  const good = invert ? diff < 0 : diff > 0;
  const cls = Math.abs(diff) < 0.5 ? '' : good ? 'up' : 'down';
  return <em className={`adm-delta ${cls}`}>{diff > 0 ? '▲' : diff < 0 ? '▼' : ''} {Math.abs(diff).toFixed(suffix === 'pp' ? 1 : 0)}{suffix === 'pp' ? ' p.p.' : '%'}</em>;
}

function Bars({ rows, label, value, format = n }: { rows: Row[]; label: (r: Row) => React.ReactNode; value: (r: Row) => number; format?: (v: number) => string }) {
  const top = Math.max(1, ...rows.map(value));
  if (!rows.length) return <p className="adm-empty">Sem dados no período.</p>;
  return (
    <ul className="adm-bars">
      {rows.map((r, i) => (
        <li key={i}>
          <div className="adm-bar-label" title={String(label(r))}>{label(r)}</div>
          <div className="adm-bar-track"><div className="adm-bar-fill" style={{ width: `${(value(r) / top) * 100}%` }} /></div>
          <div className="adm-bar-value">{format(value(r))}</div>
        </li>
      ))}
    </ul>
  );
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);

// Nome amigável das páginas
function pageName(path: string) {
  const p = (path || '/').replace(/\/+$/, '') || '/';
  const fixed: Record<string, string> = { '/': 'Início (página principal)', '/onde-atendemos': 'Onde atendemos', '/contato': 'Contato', '/blog': 'Blog (lista de posts)', '/agendar': 'Agendar' };
  if (fixed[p]) return fixed[p];
  if (p.startsWith('/blog/')) return `Blog: ${decodeURIComponent(p.slice(6)).replace(/-/g, ' ')}`;
  return p;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ p?: string; m?: string; t?: string }> }) {
  const sp = await searchParams;
  const period = resolvePeriod(sp.p, sp.m);
  const includeTest = sp.t === '1';
  const qs = (extra: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    Object.entries({ t: includeTest ? '1' : undefined, ...extra }).forEach(([k, v]) => v && q.set(k, v));
    const s = q.toString();
    return `/admin${s ? `?${s}` : ''}`;
  };

  if (!isSupabaseConfigured()) {
    return (
      <main className="adm-wrap">
        <div className="adm-card">
          <h1>Falta conectar o Supabase</h1>
          <p>Preencha <code>SUPABASE_URL</code> e <code>SUPABASE_SERVICE_ROLE_KEY</code> no arquivo <code>.env.local</code> e rode o <code>supabase/schema.sql</code> e o <code>supabase/002_ajustes.sql</code> no SQL Editor do Supabase.</p>
        </div>
      </main>
    );
  }

  // Período anterior do mesmo tamanho, para comparar
  const len = period.to.getTime() - period.from.getTime();
  const prevFrom = new Date(period.from.getTime() - len);

  let dash: Dash | null = null;
  let prev: Dash | null = null;
  let leads: Row[] = [];
  let error = '';
  try {
    [dash, prev, leads] = await Promise.all([
      sbRpc<Dash>('admin_dashboard', { p_from: period.from.toISOString(), p_to: period.to.toISOString(), p_include_test: includeTest }),
      sbRpc<Dash>('admin_dashboard', { p_from: prevFrom.toISOString(), p_to: period.from.toISOString(), p_include_test: includeTest }),
      sbSelect<Row>('leads', `select=created_at,name,email,phone,page,utm_source,utm_campaign,city,region,device${includeTest ? '' : '&is_test=eq.false'}&created_at=gte.${encodeURIComponent(period.from.toISOString())}&created_at=lt.${encodeURIComponent(period.to.toISOString())}&order=created_at.desc&limit=200`),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (!dash) {
    const needsMigration = /admin_dashboard|is_test|function|page_time/i.test(error);
    return (
      <main className="adm-wrap">
        <div className="adm-card">
          <h1>Erro ao carregar</h1>
          <p>{error}</p>
          {needsMigration && <p>Rode os arquivos <code>supabase/002_ajustes.sql</code> e <code>supabase/003_paginas.sql</code> no SQL Editor do Supabase (cole cada um e clique em Run).</p>}
        </div>
      </main>
    );
  }

  const t = dash.totals;
  const pt = prev?.totals;
  const maxDay = Math.max(1, ...dash.by_day.map((d) => d.sessions));
  const maxHour = Math.max(1, ...dash.by_hour.map((h) => h.sessions));
  const bestHour = dash.by_hour.reduce((a, b) => (b.sessions > a.sessions ? b : a), { hour: 0, sessions: 0, whatsapp: 0 });
  const bestWaHour = dash.by_hour.reduce((a, b) => (b.whatsapp > a.whatsapp ? b : a), { hour: 0, sessions: 0, whatsapp: 0 });
  const bestDow = dash.by_weekday.reduce((a, b) => (b.sessions > a.sessions ? b : a), { dow: 0, sessions: 0 });
  const stickiest = [...dash.sections].filter((s) => s.sessions >= 3).sort((a, b) => b.avg_seconds - a.avg_seconds)[0];
  const topClick = dash.clicks[0];
  const topWaSection = dash.whatsapp_by_section[0];
  const months = lastMonths();
  const hasData = t.sessions > 0;

  return (
    <main className="adm-wrap">
      <header className="adm-top">
        <div>
          <p className="adm-kicker">Instituto do Sono · <span className="adm-live"><i />{n(dash.online_now)} no site agora</span></p>
          <h1>Painel do site</h1>
          <p className="adm-period">{period.label} · comparado com o período anterior</p>
        </div>
        <div className="adm-filters">
          <nav className="adm-range">
            {Object.entries(PRESETS).map(([k, v]) => (
              <Link key={k} href={qs({ p: k })} className={period.key === k ? 'on' : ''}>{v}</Link>
            ))}
          </nav>
          <form className="adm-month" method="get" action="/admin">
            {includeTest && <input type="hidden" name="t" value="1" />}
            <select name="m" defaultValue={period.key.startsWith('m:') ? period.key.slice(2) : ''} aria-label="Escolher mês">
              <option value="" disabled>Escolher mês…</option>
              {months.map((mo) => <option key={mo.value} value={mo.value}>{mo.label}</option>)}
            </select>
            <button type="submit">Ver mês</button>
          </form>
          <Link
            className={`adm-test ${includeTest ? 'on' : ''}`}
            href={(() => {
              const q = new URLSearchParams();
              if (sp.p) q.set('p', sp.p);
              if (sp.m) q.set('m', sp.m);
              if (!includeTest) q.set('t', '1');
              const s = q.toString();
              return `/admin${s ? `?${s}` : ''}`;
            })()}
          >
            {includeTest ? '✓ Incluindo testes' : 'Incluir testes'}
          </Link>
          <form method="post" action="/api/admin/logout"><button className="adm-ghost">Sair</button></form>
        </div>
      </header>

      {!hasData && (
        <div className="adm-card adm-note-card">
          Nenhuma visita real no período. Visitas feitas no seu computador (localhost) e enquanto você está logado no painel são marcadas como <b>teste</b> e ficam fora dos números — clique em <b>Incluir testes</b> para vê-las.
        </div>
      )}

      <section className="adm-kpis">
        <div className="adm-kpi"><span>Visitas</span><strong>{n(t.sessions)}</strong><small>{n(t.visitors)} pessoas · {n(t.returning)} voltaram</small><Delta now={t.sessions} prev={pt?.sessions} /></div>
        <div className="adm-kpi"><span>Tempo médio ativo</span><strong>{fmtTime(t.avg_seconds)}</strong><small>metade fica mais que {fmtTime(t.median_seconds)}</small><Delta now={t.avg_seconds} prev={pt?.avg_seconds} /></div>
        <div className="adm-kpi"><span>Saíram em menos de 10s</span><strong>{t.bounce_rate}%</strong><small>rolagem média {t.avg_scroll}% da página</small><Delta now={t.bounce_rate} prev={pt?.bounce_rate} invert suffix="pp" /></div>
        <div className="adm-kpi hl"><span>Visitas que clicaram no WhatsApp</span><strong>{n(t.whatsapp_sessions)}</strong><small>{t.whatsapp_rate}% das visitas · {n(t.whatsapp_clicks)} cliques</small><Delta now={t.whatsapp_sessions} prev={pt?.whatsapp_sessions} /></div>
        <div className="adm-kpi hl"><span>Leads do e-book</span><strong>{n(t.leads)}</strong><small>{t.lead_rate}% das visitas</small><Delta now={t.leads} prev={pt?.leads} /></div>
        <div className="adm-kpi"><span>Ligações (cliques)</span><strong>{n(t.phone_clicks)}</strong><small>{n(t.pageviews)} páginas vistas</small><Delta now={t.phone_clicks} prev={pt?.phone_clicks} /></div>
      </section>

      {hasData && (
        <section className="adm-card adm-insights">
          <h2>Resumo rápido</h2>
          <ul>
            <li>Mais visitas entre <b>{bestHour.hour}h e {bestHour.hour + 1}h</b>, e mais em <b>{WEEKDAYS[bestDow.dow]}</b>.{bestWaHour.whatsapp > 0 && <> Horário com mais cliques no WhatsApp: <b>{bestWaHour.hour}h</b>.</>}</li>
            {stickiest && <li>Seção onde as pessoas mais param: <b>{stickiest.section}</b> ({fmtTime(stickiest.avg_seconds)} em média).</li>}
            {topClick && <li>Botão mais clicado: <b>{topClick.label}</b> ({n(topClick.clicks)} cliques{topClick.section ? `, em ${topClick.section}` : ''}).</li>}
            {topWaSection && <li>De onde mais saem cliques no WhatsApp: <b>{topWaSection.section}</b> ({n(topWaSection.clicks)}).</li>}
            {dash.sources[0] && <li>Principal origem: <b>{dash.sources[0].source}</b> ({n(dash.sources[0].sessions)} visitas, {pct(dash.sources[0].whatsapp, dash.sources[0].sessions)}% clicaram no WhatsApp).</li>}
            {dash.cities[0] && dash.cities[0].city !== 'Não identificada' && <li>Cidade que mais acessa: <b>{dash.cities[0].city}</b>.</li>}
          </ul>
        </section>
      )}

      <section className="adm-card">
        <h2>Visitas por dia</h2>
        <div className="adm-cols" style={{ gridTemplateColumns: `repeat(${Math.max(dash.by_day.length, 1)}, minmax(0,1fr))` }}>
          {dash.by_day.map((d) => (
            <div key={d.day} className="adm-col" title={`${d.day.slice(8, 10)}/${d.day.slice(5, 7)}: ${d.sessions} visitas · ${d.whatsapp} WhatsApp · ${d.leads} leads`}>
              <b className="adm-col-n">{d.sessions || ''}</b>
              <div className="adm-col-bar" style={{ height: `${(d.sessions / maxDay) * 100}%` }}>
                {d.whatsapp > 0 && <div className="adm-col-wa" style={{ height: `${(d.whatsapp / Math.max(d.sessions, 1)) * 100}%` }} />}
              </div>
              <span>{d.day.slice(8, 10)}/{d.day.slice(5, 7)}</span>
            </div>
          ))}
        </div>
        <p className="adm-legend"><i className="lg-a" /> visitas <i className="lg-b" /> clicaram no WhatsApp</p>
      </section>

      <section className="adm-card">
        <h2>Funil do e-book</h2>
        <div className="adm-funnel">
          {[
            ['Pop-up apareceu', dash.ebook.opens],
            ['Clicou em "Receber"', dash.ebook.offer_clicks],
            ['Cadastrou (lead)', dash.ebook.submits],
          ].map(([label, v], i, arr) => (
            <div key={String(label)} className="adm-funnel-step">
              <strong>{n(Number(v))}</strong>
              <span>{label}</span>
              {i > 0 && <small>{pct(Number(v), Number(arr[i - 1][1]))}% da etapa anterior</small>}
            </div>
          ))}
          <div className="adm-funnel-step muted"><strong>{n(dash.ebook.closes)}</strong><span>Fecharam sem cadastrar</span></div>
        </div>
      </section>

      <section className="adm-card">
        <h2>Páginas mais acessadas</h2>
        <div className="adm-scroll">
          <table className="adm-table">
            <thead><tr><th>Página</th><th>Visualizações</th><th>Visitas</th><th>Entraram por ela</th><th>Tempo médio</th><th>WhatsApp</th></tr></thead>
            <tbody>
              {dash.pages.length === 0 && <tr><td colSpan={6} className="adm-empty">Sem dados no período.</td></tr>}
              {dash.pages.map((pg) => (
                <tr key={pg.page}>
                  <td><b>{pageName(pg.page)}</b><br /><small className="adm-muted">{pg.page}</small></td>
                  <td>{n(pg.views)}</td>
                  <td><div className="adm-mini"><div style={{ width: `${Math.min(pg.reach, 100)}%` }} /></div>{n(pg.sessions)} <small className="adm-muted">({pg.reach}%)</small></td>
                  <td>{n(pg.entrances)}</td>
                  <td>{fmtTime(pg.avg_seconds)}</td>
                  <td>{n(pg.whatsapp_sessions)} <small className="adm-muted">({pct(pg.whatsapp_sessions, pg.sessions)}%)</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="adm-note">Visualizações = vezes que a página abriu. Visitas = pessoas diferentes que abriram (e % do total). “Entraram por ela” = primeira página da visita. Tempo médio = tempo ativo na página por visita.</p>
      </section>

      <div className="adm-grid2">
        <section className="adm-card">
          <h2>Horário das visitas</h2>
          <div className="adm-hours">
            {dash.by_hour.map((h) => (
              <div key={h.hour} title={`${h.hour}h: ${h.sessions} visitas · ${h.whatsapp} WhatsApp`} style={{ opacity: 0.15 + (h.sessions / maxHour) * 0.85 }}>
                <b>{h.hour}h</b><span>{h.sessions}</span>
              </div>
            ))}
          </div>
          <h3>Dia da semana</h3>
          <Bars rows={dash.by_weekday as unknown as Row[]} label={(r) => WEEKDAYS[Number(r.dow)]} value={(r) => Number(r.sessions)} />
        </section>

        <section className="adm-card">
          <h2>Quanto tempo ficam</h2>
          <Bars rows={dash.durations as unknown as Row[]} label={(r) => String(r.bucket)} value={(r) => Number(r.sessions)} />
          <h3>Até onde rolam a página</h3>
          <Bars rows={dash.scroll as unknown as Row[]} label={(r) => (Number(r.bucket) >= 100 ? 'até o fim' : `${r.bucket}–${Number(r.bucket) + 24}%`)} value={(r) => Number(r.sessions)} />
        </section>
      </div>

      <section className="adm-card">
        <h2>Seções: até onde chegam e onde param</h2>
        <table className="adm-table">
          <thead><tr><th>Seção</th><th>Chegaram até ela</th><th>Tempo médio na tela</th><th>Tempo total</th></tr></thead>
          <tbody>
            {dash.sections.length === 0 && <tr><td colSpan={4} className="adm-empty">Sem dados no período.</td></tr>}
            {dash.sections.map((s) => (
              <tr key={s.section}>
                <td>{s.section}</td>
                <td><div className="adm-mini"><div style={{ width: `${Math.min(s.reach, 100)}%` }} /></div>{s.reach}% <small className="adm-muted">({n(s.sessions)})</small></td>
                <td>{fmtTime(s.avg_seconds)}</td>
                <td>{fmtTime(s.total_seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="adm-note">“Chegaram até ela” = % das visitas em que a seção ocupou boa parte da tela. Tempo conta só com a aba aberta.</p>
      </section>

      <div className="adm-grid2">
        <section className="adm-card">
          <h2>Botões mais clicados</h2>
          <table className="adm-table">
            <thead><tr><th>Botão</th><th>Tipo</th><th>Onde</th><th>Cliques</th></tr></thead>
            <tbody>
              {dash.clicks.length === 0 && <tr><td colSpan={4} className="adm-empty">Sem cliques no período.</td></tr>}
              {dash.clicks.slice(0, 25).map((c, i) => (
                <tr key={i}><td>{c.label}</td><td><span className={`adm-tag t-${c.target}`}>{TARGETS[c.target] || c.target}</span></td><td>{c.section || '—'}</td><td>{n(c.clicks)}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="adm-card">
          <h2>Cliques no WhatsApp por seção</h2>
          <Bars rows={dash.whatsapp_by_section as unknown as Row[]} label={(r) => String(r.section)} value={(r) => Number(r.clicks)} />
          <h3>Cliques por tipo</h3>
          <Bars rows={dash.click_targets as unknown as Row[]} label={(r) => TARGETS[String(r.target)] || String(r.target)} value={(r) => Number(r.clicks)} />
        </section>
      </div>

      <div className="adm-grid2">
        <section className="adm-card">
          <h2>De onde vêm</h2>
          <table className="adm-table">
            <thead><tr><th>Origem</th><th>Visitas</th><th>Tempo</th><th>WhatsApp</th><th>Leads</th></tr></thead>
            <tbody>
              {dash.sources.length === 0 && <tr><td colSpan={5} className="adm-empty">Sem dados no período.</td></tr>}
              {dash.sources.map((s, i) => <tr key={i}><td>{s.source}</td><td>{n(s.sessions)}</td><td>{fmtTime(s.avg_seconds)}</td><td>{n(s.whatsapp)} <small className="adm-muted">({pct(s.whatsapp, s.sessions)}%)</small></td><td>{n(s.leads)}</td></tr>)}
            </tbody>
          </table>
          {dash.campaigns.length > 0 && (
            <>
              <h3>Campanhas (UTM)</h3>
              <table className="adm-table">
                <thead><tr><th>Campanha</th><th>Fonte / meio</th><th>Visitas</th><th>WhatsApp</th><th>Leads</th></tr></thead>
                <tbody>{dash.campaigns.map((c, i) => <tr key={i}><td>{c.campaign}</td><td>{c.source} / {c.medium}</td><td>{n(c.sessions)}</td><td>{n(c.whatsapp)}</td><td>{n(c.leads)}</td></tr>)}</tbody>
              </table>
            </>
          )}
        </section>
        <section className="adm-card">
          <h2>Região</h2>
          <table className="adm-table">
            <thead><tr><th>Cidade</th><th>Estado</th><th>Visitas</th><th>WhatsApp</th><th>Leads</th></tr></thead>
            <tbody>
              {dash.cities.length === 0 && <tr><td colSpan={5} className="adm-empty">Sem dados no período.</td></tr>}
              {dash.cities.map((c, i) => <tr key={i}><td>{c.city}</td><td>{c.region || '—'}</td><td>{n(c.sessions)}</td><td>{n(c.whatsapp)}</td><td>{n(c.leads)}</td></tr>)}
            </tbody>
          </table>
        </section>
      </div>

      <div className="adm-grid2">
        <section className="adm-card">
          <h2>Aparelho</h2>
          <table className="adm-table">
            <thead><tr><th>Aparelho</th><th>Visitas</th><th>Tempo médio</th><th>WhatsApp</th></tr></thead>
            <tbody>{dash.devices.map((d, i) => <tr key={i}><td>{DEVICES[d.device] || d.device}</td><td>{n(d.sessions)} <small className="adm-muted">({pct(d.sessions, t.sessions)}%)</small></td><td>{fmtTime(d.avg_seconds)}</td><td>{n(d.whatsapp)}</td></tr>)}</tbody>
          </table>
          <h3>Navegador</h3>
          <Bars rows={dash.browsers as unknown as Row[]} label={(r) => String(r.name)} value={(r) => Number(r.sessions)} />
        </section>
        <section className="adm-card">
          <h2>Página de entrada</h2>
          <Bars rows={dash.landing_pages as unknown as Row[]} label={(r) => pageName(String(r.page))} value={(r) => Number(r.sessions)} />
          <h3>Sistema</h3>
          <Bars rows={dash.os as unknown as Row[]} label={(r) => String(r.name)} value={(r) => Number(r.sessions)} />
        </section>
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <h2>Leads do e-book ({n(leads.length)})</h2>
          <a className="adm-btn" href="/api/admin/leads">Baixar todos (Excel/CSV)</a>
        </div>
        {leads.length === 0 ? <p className="adm-empty">Nenhum lead no período.</p> : (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead><tr><th>Data</th><th>Nome</th><th>E-mail</th><th>WhatsApp</th><th>Cidade</th><th>Origem</th><th></th></tr></thead>
              <tbody>
                {leads.map((l, i) => {
                  const phone = String(l.phone || '');
                  const wa = `https://wa.me/${phone.startsWith('55') ? phone : `55${phone}`}`;
                  return (
                    <tr key={i}>
                      <td>{new Date(String(l.created_at)).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td>{l.name}</td>
                      <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
                      <td>{phone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')}</td>
                      <td>{l.city || '—'}</td>
                      <td>{[l.utm_source, l.utm_campaign].filter(Boolean).join(' / ') || '—'}</td>
                      <td><a className="adm-wa" href={wa} target="_blank" rel="noopener noreferrer">Chamar</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="adm-foot">Horário de Brasília. Visitas de teste (localhost e admin logado) ficam fora dos números. Robôs são filtrados. Quem bloqueia JavaScript não é contado.</p>
    </main>
  );
}
