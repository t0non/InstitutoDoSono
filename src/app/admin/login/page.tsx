import { adminConfigured } from '@/lib/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const missing = [
    !process.env.SUPABASE_URL && 'SUPABASE_URL',
    !process.env.SUPABASE_SERVICE_ROLE_KEY && 'SUPABASE_SERVICE_ROLE_KEY',
    (process.env.ADMIN_PASSWORD || '').length < 8 && 'ADMIN_PASSWORD (mín. 8 caracteres)',
    (process.env.ADMIN_SESSION_SECRET || '').length < 16 && 'ADMIN_SESSION_SECRET (mín. 16 caracteres)',
  ].filter(Boolean) as string[];
  void adminConfigured; void isSupabaseConfigured();
  return (
    <main className="adm-login">
      <form method="post" action="/api/admin/login" className="adm-login-card">
        <p className="adm-kicker">Instituto do Sono</p>
        <h1>Painel administrativo</h1>
        <label>
          <span>Senha</span>
          <input type="password" name="password" required autoFocus autoComplete="current-password" />
        </label>
        {missing.length > 0 && (
          <div className="adm-error">
            Falta no <code>.env.local</code>: {missing.join(', ')}. Depois de salvar, pare e rode de novo o <code>npm run dev</code>.
          </div>
        )}
        {erro && missing.length === 0 && <p className="adm-error">Senha incorreta.</p>}
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
