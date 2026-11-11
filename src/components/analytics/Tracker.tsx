'use client';
// Rastreador próprio e leve (sem bibliotecas): visitas, tempo ativo, seções vistas,
// cliques, rolagem, origem (UTM/referência), aparelho e horário.
// Os dados vão em lotes para /api/track e são gravados no Supabase.
//
// Regras de precisão:
// - 1 visita = 1 aba aberta no site; nova visita após 30 min sem atividade.
// - Tempo ativo = segundos com a aba visível E alguém interagiu nos últimos 2 min.
// - A visita é registrada em ~1,5s (quem sai rápido também conta).
// - Tempo e rolagem são atualizados a cada 15s e na saída da página.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type TrackEvent = {
  type: string;
  page?: string;
  section?: string;
  label?: string;
  target?: string;
  href?: string;
  value?: number;
  ts?: string;
};

type TrackSession = {
  id: string;
  visitor_id: string;
  started: number;
  last: number;
  is_returning: boolean;
  utm: Record<string, string>;
  landing_page: string;
  referrer: string;
  referrer_host: string;
};

declare global {
  interface Window {
    __track?: (e: TrackEvent) => void;
    __trackSession?: () => TrackSession;
    __trackStarted?: boolean;
  }
}

const SESSION_TIMEOUT = 30 * 60 * 1000;
const FLUSH_MS = 15_000;
const IDLE_MS = 120_000;

// Nome amigável de cada parte do site (para o painel)
const SECTION_NAMES: Record<string, string> = {
  'institute-header': 'Menu do topo',
  'institute-mobile-nav': 'Menu do celular',
  hero: 'Topo (vídeo)',
  'highlights-bar': 'Faixa de destaques',
  clinica: 'Nossa Clínica',
  'insurance-section': 'Convênios',
  servicos: 'Exames',
  'corpo-clinico': 'Corpo Clínico',
  'exam-contact-band': 'Faixa pedido de exames',
  avaliacoes: 'Avaliações',
  faq: 'Dúvidas Frequentes',
  localizacao: 'Como chegar',
  'clinic-footer': 'Rodapé',
  'mobile-sticky-bar': 'Barra fixa (celular)',
  'smart-chat-widget': 'Chat da Beth',
  ebk: 'Pop-up do e-book',
  'coverage-hero': 'Onde atendemos — topo',
  'coverage-info': 'Onde atendemos — informações',
  'coverage-services': 'Onde atendemos — serviços',
  'coverage-directory': 'Onde atendemos — bairros',
  'coverage-cta': 'Onde atendemos — chamada final',
};
const GENERIC = /^(site-content-width|container|info-page|py-|px-|bg-|border|flex|grid|relative|w-|mx-|is-)/;
const AREA_SELECTOR = [
  '[data-track-section]', 'dialog.ebk', '#smart-chat-widget', '.mobile-sticky-bar', '.institute-mobile-nav', 'header.institute-header',
  'main > section', 'main > header', 'main > div', 'header.hero', 'footer', '.coverage-page section',
].join(', ');

const rid = () =>
  (crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`).slice(0, 40);

function safeGet(store: Storage, k: string) {
  try { return store.getItem(k); } catch { return null; }
}
function safeSet(store: Storage, k: string, v: string) {
  try { store.setItem(k, v); } catch { /* modo privado */ }
}

function saveSession(s: TrackSession) {
  safeSet(sessionStorage, 'is_sess', JSON.stringify(s));
}

function getSession(): TrackSession {
  const now = Date.now();
  let vid = safeGet(localStorage, 'is_vid');
  const returning = Boolean(vid);
  if (!vid) { vid = rid(); safeSet(localStorage, 'is_vid', vid); }

  const raw = safeGet(sessionStorage, 'is_sess');
  if (raw) {
    try {
      const s = JSON.parse(raw) as TrackSession;
      if (now - s.last < SESSION_TIMEOUT) {
        s.last = now;
        saveSession(s);
        return s;
      }
    } catch { /* ignora */ }
  }
  const params = new URLSearchParams(location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v.slice(0, 200);
  });
  // fbclid/gclid sem UTM = anúncio Meta/Google
  if (!utm.utm_source && utm.gclid) { utm.utm_source = 'google'; utm.utm_medium = 'cpc'; }
  if (!utm.utm_source && utm.fbclid) { utm.utm_source = 'facebook'; utm.utm_medium = 'paid_social'; }
  delete utm.fbclid;

  let refHost = '';
  try { refHost = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch { /* */ }
  if (refHost === location.hostname.replace(/^www\./, '')) refHost = '';
  const s: TrackSession = {
    id: rid(),
    visitor_id: vid,
    started: now,
    last: now,
    is_returning: returning,
    utm,
    landing_page: location.pathname,
    referrer: refHost ? document.referrer.slice(0, 300) : '',
    referrer_host: refHost,
  };
  saveSession(s);
  safeSet(sessionStorage, 'is_first', '1');
  safeSet(sessionStorage, 'is_active', '0');
  return s;
}

function deviceInfo() {
  const ua = navigator.userAgent;
  const w = Math.min(screen.width, screen.height);
  const device = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) ? 'tablet' : /Mobi|iPhone|Android/i.test(ua) || w < 600 ? 'mobile' : 'desktop';
  const os = /Windows/i.test(ua) ? 'Windows' : /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : /Mac OS/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'Outro';
  const browser = /Instagram/i.test(ua) ? 'Instagram (app)' : /FBAN|FBAV/i.test(ua) ? 'Facebook (app)' : /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Outro';
  return {
    device, os, browser,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function sectionNameOf(el: Element | null): string | undefined {
  const sec = el?.closest(AREA_SELECTOR);
  if (!sec) return undefined;
  const h = sec as HTMLElement;
  const key = h.dataset.trackSection || (SECTION_NAMES[h.id] ? h.id : '') || [...h.classList].find((c) => SECTION_NAMES[c]) || h.id || [...h.classList].find((c) => !GENERIC.test(c));
  return key ? SECTION_NAMES[key] || key : undefined;
}

function classifyLink(a: HTMLAnchorElement | null): { target: string; href?: string } {
  if (!a) return { target: 'button' };
  const href = a.getAttribute('href') || '';
  if (/wa\.me|whatsapp/i.test(href)) return { target: 'whatsapp', href: href.split('?')[0] };
  if (href.startsWith('tel:')) return { target: 'phone', href };
  if (href.startsWith('mailto:')) return { target: 'email', href: 'mailto' };
  if (/\.pdf($|\?)/i.test(href)) return { target: 'download', href: href.split('?')[0] };
  if (/google\.[^/]+\/maps|maps\.app|goo\.gl\/maps/i.test(href)) return { target: 'maps', href: 'google maps' };
  if (href.startsWith('#') || href.startsWith('/') || href.includes(location.hostname)) return { target: 'internal', href: href.slice(0, 200) };
  return { target: 'external', href: href.split('?')[0].slice(0, 200) };
}

export default function Tracker() {
  const pathname = usePathname();

  // Inicia uma vez por carregamento (protege contra montagem dupla)
  useEffect(() => {
    if (location.pathname.startsWith('/admin') || navigator.webdriver || window.__trackStarted) return;
    window.__trackStarted = true;

    const sess = getSession();
    const info = deviceInfo();
    const queue: TrackEvent[] = [];
    let activeSeconds = Number(safeGet(sessionStorage, 'is_active') || 0);
    let sentActive = -1;
    let maxScroll = 0;
    let sentScroll = -1;
    let lastInteraction = Date.now();

    const push = (e: TrackEvent) => {
      queue.push({ page: location.pathname, ts: new Date().toISOString(), ...e });
      if (queue.length >= 40) flush();
    };

    const flush = (useBeacon = false) => {
      const first = safeGet(sessionStorage, 'is_first') === '1';
      const changed = activeSeconds !== sentActive || maxScroll !== sentScroll;
      if (!queue.length && !first && !changed) return;
      sess.last = Date.now();
      saveSession(sess);
      safeSet(sessionStorage, 'is_active', String(activeSeconds));
      const payload = JSON.stringify({
        first,
        session: {
          id: sess.id,
          visitor_id: sess.visitor_id,
          is_returning: sess.is_returning,
          landing_page: sess.landing_page,
          page: location.pathname,
          referrer: sess.referrer,
          referrer_host: sess.referrer_host,
          active_seconds: activeSeconds,
          max_scroll: maxScroll,
          hostname: location.hostname,
          ...sess.utm,
          ...info,
        },
        events: queue.splice(0, queue.length),
      });
      sentActive = activeSeconds;
      sentScroll = maxScroll;
      if (first) safeSet(sessionStorage, 'is_first', '0');
      try {
        if (useBeacon && navigator.sendBeacon) {
          navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch('/api/track', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
        }
      } catch { /* sem rede */ }
    };

    window.__track = push;
    window.__trackSession = () => sess;

    // Tempo ativo
    const tick = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInteraction < IDLE_MS) activeSeconds += 1;
    }, 1000);
    const onAct = () => { lastInteraction = Date.now(); };
    const actEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove', 'wheel'];
    actEvents.forEach((ev) => window.addEventListener(ev, onAct, { passive: true }));

    // Rolagem máxima da página atual
    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.round(((h.scrollTop + innerHeight) / Math.max(h.scrollHeight, 1)) * 100);
      if (pct > maxScroll) maxScroll = Math.min(pct, 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Cliques em links e botões (1 registro por clique)
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest('a, button, summary, [data-track]') as HTMLElement | null;
      if (!el) return;
      const a = el.tagName === 'A' ? (el as HTMLAnchorElement) : null;
      const text = (el.dataset.track || el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      const label = text.slice(0, 80) || el.getAttribute('aria-label') || '(ícone)';
      const { target, href } = classifyLink(a);
      const section = sectionNameOf(el);
      push({ type: 'click', label, target, href, section });
      // Evento extra para o Google Tag Manager (pode virar conversão no Google Ads)
      if (target === 'whatsapp' || target === 'phone') {
        const w = window as Window & { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: target === 'whatsapp' ? 'whatsapp_click' : 'phone_click', click_label: label, click_section: section || '' });
      }
      if (target !== 'internal' && target !== 'button') flush(true);
    };
    document.addEventListener('click', onClick, { capture: true });

    // Envio: primeiro registro rápido, depois a cada 15s e na saída
    const firstTimer = window.setTimeout(() => flush(), 1500);
    const timer = window.setInterval(() => flush(), FLUSH_MS);
    // Tempo ativo em cada página (enviado em pedaços: ao sair da página ou esconder a aba)
    let pageStart = activeSeconds;
    let pagePath = location.pathname;
    const pushPageTime = () => {
      const secs = activeSeconds - pageStart;
      if (secs > 0) queue.push({ type: 'page_time', page: pagePath, value: secs, ts: new Date().toISOString() });
      pageStart = activeSeconds;
    };
    (window as Window & { __trackPageChange?: (path: string) => void }).__trackPageChange = (path: string) => {
      if (path === pagePath) return;
      pushPageTime();
      pagePath = path;
    };
    const onHide = () => { if (document.visibilityState === 'hidden') { pushPageTime(); flush(true); } };
    const onPageHide = () => { pushPageTime(); flush(true); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);

    // Ao trocar de página dentro do site, a rolagem recomeça do zero
    (window as Window & { __trackResetScroll?: () => void }).__trackResetScroll = () => { maxScroll = 0; onScroll(); };

    return () => {
      window.clearTimeout(firstTimer);
      window.clearInterval(tick);
      window.clearInterval(timer);
      actEvents.forEach((ev) => window.removeEventListener(ev, onAct));
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('scroll', onScroll);
      flush(true);
      window.__trackStarted = false;
    };
  }, []);

  // A cada página: pageview + tempo de cada seção na tela
  useEffect(() => {
    if (pathname.startsWith('/admin') || !window.__track) return;
    const track = window.__track;
    (window as Window & { __trackResetScroll?: () => void }).__trackResetScroll?.();
    (window as Window & { __trackPageChange?: (path: string) => void }).__trackPageChange?.(location.pathname);
    track({ type: 'pageview' });

    const seen = new Set<string>();
    const intersecting = new Set<string>();
    const visibleSince = new Map<string, number>();
    const start = (name: string) => {
      if (!visibleSince.has(name) && document.visibilityState === 'visible') visibleSince.set(name, Date.now());
    };
    const stop = (name: string) => {
      const t0 = visibleSince.get(name);
      if (t0 == null) return;
      visibleSince.delete(name);
      const secs = Math.round((Date.now() - t0) / 100) / 10;
      if (secs >= 1) track({ type: 'section_time', section: name, value: Math.min(secs, 1800) });
    };

    const els = Array.from(document.querySelectorAll('main > section, main > header, main > div, header.hero, footer, [data-track-section], .coverage-page section'))
      .filter((el, i, arr) => arr.indexOf(el) === i && sectionNameOf(el));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const name = sectionNameOf(en.target);
        if (!name) return;
        // "Viu" quando a seção ocupa boa parte da tela
        const visible = en.isIntersecting && (en.intersectionRatio >= 0.4 || en.intersectionRect.height >= innerHeight * 0.5);
        if (visible) {
          intersecting.add(name);
          if (!seen.has(name)) { seen.add(name); track({ type: 'section_view', section: name }); }
          start(name);
        } else {
          intersecting.delete(name);
          stop(name);
        }
      });
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    els.forEach((el) => io.observe(el));

    // Aba escondida pausa o cronômetro; ao voltar, retoma nas seções que estão na tela
    const onVis = () => {
      if (document.visibilityState === 'hidden') [...visibleSince.keys()].forEach(stop);
      else intersecting.forEach(start);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      [...visibleSince.keys()].forEach(stop);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [pathname]);

  return null;
}
