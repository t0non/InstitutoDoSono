// Login do painel: senha única (ADMIN_PASSWORD) + cookie assinado (ADMIN_SESSION_SECRET).
// Funciona no middleware (edge) e no servidor, usando Web Crypto.
export const ADMIN_COOKIE = 'is_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

const enc = new TextEncoder();

async function hmac(data: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createAdminToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyAdminToken(token?: string | null) {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(exp);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export function adminConfigured() {
  return (process.env.ADMIN_PASSWORD || '').length >= 8 && (process.env.ADMIN_SESSION_SECRET || '').length >= 16;
}

export async function checkPassword(input: string) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!adminConfigured()) return false;
  // compara pelo hash para não vazar tamanho/tempo
  const [a, b] = await Promise.all([hmac(`pw:${input}`), hmac(`pw:${real}`)]);
  return a === b;
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
};
