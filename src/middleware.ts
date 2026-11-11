import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';

// Protege o painel /admin e as rotas /api/admin
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login' || pathname === '/api/admin/login') return NextResponse.next();

  const ok = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
  if (ok) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
