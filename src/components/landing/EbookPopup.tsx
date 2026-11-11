'use client';

import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle2, BookOpen, ArrowLeft, Lock } from 'lucide-react';
import { WhatsAppIcon } from '../icons';
import { config } from '@/lib/config';

// Configure aqui o texto e a capa. O PDF fica em EBOOK_PDF_URL (.env.local)
// ou em public/ebook/guia-do-sono.pdf.
const ebook = {
  enabled: true,
  delaySeconds: 10, // abre depois de 10s no site (somando as páginas da visita)
  headline: 'Acorda cansado mesmo dormindo a noite toda? Descubra o que está roubando seu sono.',
  subhead: 'Em 5 minutos, veja 7 hábitos que ajudam e os sinais de que o ronco merece atenção.',
  body: 'Receba o guia gratuito do Instituto do Sono e monte seu plano para as próximas 7 noites.',
  button: 'Receber meu e-book grátis',
  coverUrl: '/ebook/capa.webp', // troque a imagem em public/ebook/capa.webp (formato em pé, 3:4)
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

function store(k: string, v?: string) {
  try {
    if (v === undefined) return localStorage.getItem(k);
    localStorage.setItem(k, v);
  } catch { /* modo privado */ }
  return null;
}
function sstore(k: string, v?: string) {
  try {
    if (v === undefined) return sessionStorage.getItem(k);
    sessionStorage.setItem(k, v);
  } catch { /* modo privado */ }
  return null;
}

function Book({ small = false }: { small?: boolean }) {
  // A capa já vem como livro 3D com fundo transparente (public/ebook/capa.webp)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`ebk-cover${small ? ' sm' : ''}`} src={ebook.coverUrl} alt="E-book Como Dormir Melhor" loading="lazy" />
  );
}

export default function EbookPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<'offer' | 'form' | 'done'>('offer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', consent: false, website: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get('previewEbook') === '1';
    if (!preview) {
      if (!ebook.enabled) return;
      if (store('is_ebook_lead') === '1') return; // já baixou
      if (sstore('is_ebook_shown') === '1') return; // já viu nesta visita
    }
    let started = Number(sstore('is_ebook_t0'));
    if (!started) { started = Date.now(); sstore('is_ebook_t0', String(started)); }
    const wait = preview ? 0 : Math.max(0, ebook.delaySeconds * 1000 - (Date.now() - started));

    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog || document.querySelector('dialog[open]')) return;
      dialog.showModal();
      sstore('is_ebook_shown', '1');
      if (!preview) window.__track?.({ type: 'ebook_open', label: 'popup e-book' });
    }, wait);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    if (step !== 'done') window.__track?.({ type: 'ebook_close', label: step === 'form' ? 'fechou no formulário' : 'fechou na oferta' });
    dialogRef.current?.close();
  };

  const openForm = () => {
    setStep('form'); // o clique já é registrado pelo rastreador geral
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    setSending(true);
    const sess = window.__trackSession?.();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'ebook',
          hostname: location.hostname,
          page: location.pathname,
          session_id: sess?.id,
          visitor_id: sess?.visitor_id,
          utm_source: sess?.utm?.utm_source,
          utm_medium: sess?.utm?.utm_medium,
          utm_campaign: sess?.utm?.utm_campaign,
          device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Não foi possível enviar. Tente novamente.');
      setPdfUrl(data.pdfUrl || null);
      setStep('done');
      store('is_ebook_lead', '1');
      window.__track?.({ type: 'ebook_submit', label: 'lead e-book' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar.');
    } finally {
      setSending(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="ebk"
      aria-labelledby="ebk-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dialogRef.current) close(); }}
    >
      <div className="ebk-card">
        <button className="ebk-close" type="button" aria-label="Fechar" onClick={close}><X size={22} /></button>

        {step === 'offer' && (
          <div className="ebk-offer">
            <div className="ebk-text">
              <span className="ebk-badge">E-book gratuito</span>
              <h2 id="ebk-title">{ebook.headline}</h2>
              <p className="ebk-sub">{ebook.subhead}</p>
              <p className="ebk-body">{ebook.body}</p>
            </div>
            <div className="ebk-visual"><Book /></div>
            <button type="button" className="ebk-cta" onClick={openForm}>{ebook.button}</button>
          </div>
        )}

        {step === 'form' && (
          <div className="ebk-formwrap">
            <div className="ebk-formhead">
              <div className="ebk-mini"><Book small /></div>
              <div>
                <span className="ebk-badge">Falta pouco</span>
                <h2 id="ebk-title">Para onde enviamos o seu guia?</h2>
              </div>
            </div>
            <form className="ebk-form" onSubmit={submit} noValidate>
              <label><span>Nome</span>
                <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" autoFocus />
              </label>
              <label><span>E-mail</span>
                <input required type="email" autoComplete="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" />
              </label>
              <label><span>WhatsApp</span>
                <input required type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })} placeholder="(31) 99999-9999" />
              </label>
              <input className="ebk-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <label className="ebk-consent">
                <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                <span>Autorizo o Instituto do Sono a entrar em contato e enviar conteúdos sobre saúde do sono (LGPD).</span>
              </label>
              {error && <p className="ebk-error" role="alert">{error}</p>}
              <button className="ebk-cta" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Liberar meu e-book'}</button>
              <div className="ebk-formfoot">
                <button type="button" className="ebk-back" onClick={() => setStep('offer')}><ArrowLeft size={14} /> Voltar</button>
                <span><Lock size={12} /> Seus dados ficam só com o Instituto do Sono.</span>
              </div>
            </form>
          </div>
        )}

        {step === 'done' && (
          <div className="ebk-done">
            <div className="ebk-mini"><Book small /></div>
            <CheckCircle2 size={40} className="ebk-check" />
            <h2 id="ebk-title">Pronto, {form.name.split(' ')[0] || 'seu guia está liberado'}!</h2>
            <p className="ebk-body">Seu guia já está liberado. Ele abre numa nova aba — este site continua aberto aqui para quando você quiser voltar.</p>
            {pdfUrl && (
              <a className="ebk-cta" href={pdfUrl} target="_blank" rel="noopener" data-track="Abrir e-book">
                <BookOpen size={20} /> Abrir meu e-book
              </a>
            )}
            <a
              className="ebk-cta ebk-cta-wpp"
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Olá! Sou ${form.name.split(' ')[0]}, baixei o guia "Como dormir melhor" e gostaria de tirar uma dúvida sobre o meu sono.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track="WhatsApp após e-book"
            >
              <WhatsAppIcon className="h-5 w-5" /> Tirar dúvida no WhatsApp
            </a>
            <button type="button" className="ebk-back ebk-continue" onClick={() => dialogRef.current?.close()}>Continuar navegando no site</button>
          </div>
        )}
      </div>
    </dialog>
  );
}
