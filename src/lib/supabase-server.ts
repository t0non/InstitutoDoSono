// Acesso ao Supabase só pelo servidor (a chave secreta nunca vai para o navegador).
// Usa a API REST do Supabase direto com fetch — não precisa instalar nenhum pacote.

import dns from 'node:dns';
import net from 'node:net';

// Alguns PCs com Windows/internet doméstica travam na conexão IPv6 do Node.
// Priorizar IPv4 e dar mais tempo resolve o "fetch failed".
try {
  dns.setDefaultResultOrder('ipv4first');
  (net as unknown as { setDefaultAutoSelectFamilyAttemptTimeout?: (ms: number) => void }).setDefaultAutoSelectFamilyAttemptTimeout?.(2000);
} catch { /* versões antigas do Node */ }

// Lido a cada chamada (assim o site pega mudanças no .env.local sem reiniciar)
const sbUrl = () => (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
const sbKey = () => (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

export const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
export const isSupabaseConfigured = () => Boolean(sbUrl() && sbKey());

async function sbFetch(path: string, init?: RequestInit) {
  const url = `${sbUrl()}${path}`;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fetch(url, { ...init, cache: 'no-store' });
    } catch (err) {
      lastErr = err;
    }
  }
  {
    const err = lastErr as Error & { cause?: { code?: string; errors?: { code?: string; address?: string }[] } };
    const detail = err?.cause?.errors?.map((e) => `${e.code} ${e.address ?? ''}`).join(', ') || err?.cause?.code || String(err?.cause ?? err);
    let host = sbUrl();
    try { host = new URL(sbUrl()).host; } catch { /* */ }
    throw new Error(`Não consegui acessar o Supabase em "${host}". Confira o SUPABASE_URL no .env.local (deve ser algo como https://xxxx.supabase.co). Detalhe: ${detail}`);
  }
}

function headers(extra?: Record<string, string>) {
  const KEY = sbKey();
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export async function sbRpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!isSupabaseConfigured()) throw new Error('Supabase não configurado (.env.local)');
  const res = await sbFetch(`/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Supabase rpc ${fn}: ${res.status} ${await res.text()}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function sbInsert(table: string, row: Record<string, unknown>) {
  if (!isSupabaseConfigured()) throw new Error('Supabase não configurado (.env.local)');
  const res = await sbFetch(`/rest/v1/${table}`, {
    method: 'POST',
    headers: headers({ Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insert ${table}: ${res.status} ${await res.text()}`);
}

export async function sbSelect<T = unknown>(table: string, query: string): Promise<T[]> {
  if (!isSupabaseConfigured()) throw new Error('Supabase não configurado (.env.local)');
  const res = await sbFetch(`/rest/v1/${table}?${query}`, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase select ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

// ---------- Região do visitante (sem guardar o IP) ----------
export type Geo = { country?: string; region?: string; city?: string };

export async function geoFromRequest(req: Request): Promise<Geo> {
  const h = req.headers;
  const decode = (v: string | null) => (v ? decodeURIComponent(v) : undefined);
  // Cabeçalhos que algumas hospedagens já mandam prontos (Vercel, Cloudflare, Google)
  const fromHeaders: Geo = {
    country: decode(h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || h.get('x-appengine-country')),
    region: decode(h.get('x-vercel-ip-country-region') || h.get('cf-region') || h.get('x-appengine-region')),
    city: decode(h.get('x-vercel-ip-city') || h.get('cf-ipcity') || h.get('x-appengine-city')),
  };
  if (fromHeaders.city || fromHeaders.region) return fromHeaders;

  if (process.env.GEOIP_PROVIDER !== 'ipapi') return fromHeaders;
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || '';
  if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.')) return fromHeaders;
  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return fromHeaders;
    const j = await res.json();
    if (j.error) return fromHeaders;
    return { country: j.country_name, region: j.region, city: j.city };
  } catch {
    return fromHeaders;
  }
}

export function isBot(ua: string | null) {
  return !ua || /bot|crawl|spider|slurp|preview|lighthouse|headless|facebookexternalhit|whatsapp|bingpreview|pingdom|uptime/i.test(ua);
}

// Visita de teste: site rodando no computador (localhost) ou o próprio admin logado navegando
export async function isTestTraffic(req: Request, hostname?: string) {
  const host = (hostname || new URL(req.url).hostname || '').toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return true;
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)is_admin=([^;]+)/);
  if (!m) return false;
  const { verifyAdminToken } = await import('./admin-auth');
  return verifyAdminToken(decodeURIComponent(m[1]));
}
