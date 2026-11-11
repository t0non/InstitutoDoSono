import { NextResponse } from 'next/server';
import { sbRpc, isSupabaseConfigured, geoFromRequest, isBot, isTestTraffic } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Recebe os eventos que o site manda (navigator.sendBeacon) e grava no Supabase.
export async function POST(req: Request) {
  if (!isSupabaseConfigured() || isBot(req.headers.get('user-agent'))) {
    return new NextResponse(null, { status: 204 });
  }
  try {
    const raw = await req.text();
    if (raw.length > 64_000) return new NextResponse(null, { status: 413 });
    const body = JSON.parse(raw);
    if (!body?.session?.id) return new NextResponse(null, { status: 400 });

    body.session.is_test = await isTestTraffic(req, body.session.hostname);
    // Região só na primeira chamada da visita (economiza consultas)
    if (body.first && !body.session.is_test) {
      const geo = await geoFromRequest(req);
      body.session = { ...body.session, ...geo };
    }
    await sbRpc('track_batch', { p: body });
  } catch (err) {
    console.error('[track]', err);
  }
  return new NextResponse(null, { status: 204 });
}
