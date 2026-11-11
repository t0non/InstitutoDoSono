import { NextResponse } from 'next/server';
import { sbInsert, isSupabaseConfigured, geoFromRequest, isTestTraffic } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const clean = (v: unknown, max = 160) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Recebe nome, e-mail e telefone do pop-up do e-book e devolve o link do PDF.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  // Campo escondido anti-robô: pessoas não preenchem
  if (clean(body.website)) return NextResponse.json({ ok: true, pdfUrl: null });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160).toLowerCase();
  const phoneDigits = clean(body.phone, 30).replace(/\D/g, '');
  const consent = body.consent === true;

  if (name.length < 2) return NextResponse.json({ error: 'Digite seu nome.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: 'Digite um e-mail válido.' }, { status: 400 });
  if (phoneDigits.length < 10 || phoneDigits.length > 13) return NextResponse.json({ error: 'Digite um telefone com DDD.' }, { status: 400 });
  if (!consent) return NextResponse.json({ error: 'Marque a autorização para continuar.' }, { status: 400 });

  const pdfUrl = process.env.EBOOK_PDF_URL || '/ebook/guia-do-sono.pdf';

  if (!isSupabaseConfigured()) {
    console.warn('[leads] Supabase não configurado — lead não foi salvo.');
    return NextResponse.json({ ok: true, pdfUrl });
  }

  try {
    const isTest = await isTestTraffic(req, clean(body.hostname, 120));
    const geo = isTest ? {} : await geoFromRequest(req);
    const row: Record<string, unknown> = {
      is_test: isTest,
      name,
      email,
      phone: phoneDigits,
      consent,
      source: clean(body.source, 40) || 'ebook',
      page: clean(body.page, 300) || null,
      session_id: clean(body.session_id, 64) || null,
      visitor_id: clean(body.visitor_id, 64) || null,
      utm_source: clean(body.utm_source, 120) || null,
      utm_medium: clean(body.utm_medium, 120) || null,
      utm_campaign: clean(body.utm_campaign, 200) || null,
      device: clean(body.device, 20) || null,
      city: (geo as { city?: string }).city || null,
      region: (geo as { region?: string }).region || null,
      country: (geo as { country?: string }).country || null,
    };
    try {
      await sbInsert('leads', row);
    } catch (err) {
      // Se o ajuste 002 ainda não foi rodado no Supabase, salva sem a coluna nova (não perde o lead)
      if (String(err).includes('is_test')) { delete row.is_test; await sbInsert('leads', row); }
      else throw err;
    }
  } catch (err) {
    console.error('[leads]', err);
    return NextResponse.json({ error: 'Não conseguimos salvar agora. Tente de novo em instantes.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, pdfUrl });
}
