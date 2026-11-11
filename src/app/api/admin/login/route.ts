import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCookieOptions, checkPassword, createAdminToken } from '@/lib/admin-auth';

export const runtime = 'edge';

export async function POST(req: Request) {
  const base = new URL(req.url).origin;
  try {
    const form = await req.formData();
    const password = String(form.get('password') || '');
    // pequena espera para dificultar tentativa e erro
    await new Promise((r) => setTimeout(r, 400));
    if (!(await checkPassword(password))) {
      return NextResponse.redirect(`${base}/admin/login?erro=1`, 303);
    }
    const res = NextResponse.redirect(`${base}/admin`, 303);
    res.cookies.set(ADMIN_COOKIE, await createAdminToken(), adminCookieOptions);
    return res;
  } catch (err) {
    console.error('[admin login]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
