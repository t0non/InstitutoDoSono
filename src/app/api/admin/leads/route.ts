import { sbSelect } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Lead = Record<string, string | boolean | null>;

// Baixa todos os leads em CSV (abre no Excel)
export async function GET() {
  const q = 'select=created_at,name,email,phone,source,page,utm_source,utm_medium,utm_campaign,device,city,region,country&order=created_at.desc&limit=10000';
  let rows: Lead[];
  try {
    rows = await sbSelect<Lead>('leads', `${q}&is_test=eq.false`); // sem os cadastros de teste
  } catch {
    rows = await sbSelect<Lead>('leads', q); // ajuste 002 ainda não rodado
  }
  const cols = ['created_at', 'name', 'email', 'phone', 'source', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'device', 'city', 'region', 'country'];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const fmt = (r: Lead) => cols.map((c) => c === 'created_at' && r[c]
    ? esc(new Date(String(r[c])).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }))
    : esc(r[c])).join(';');
  const csv = '﻿' + cols.join(';') + '\n' + rows.map(fmt).join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-instituto-do-sono-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
