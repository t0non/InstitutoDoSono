'use client';
// Aviso antes do WhatsApp da polissonografia: o exame é só particular.
// Funciona em qualquer botão de WhatsApp do site cuja mensagem fale de polissonografia
// (cards de exames, bairros em "Onde atendemos" etc.). Não bloqueia: a pessoa segue
// para o WhatsApp com uma mensagem já preenchida.
//
// Dados no painel admin: polisso_open (abriu), clique no WhatsApp dentro do pop-up
// (seção "Pop-up polissonografia") e polisso_close (fechou sem seguir).

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from '../icons';
import { config } from '@/lib/config';
import { sectionNameOf } from '@/components/analytics/Tracker';

// ---- Textos (edite aqui) ----
const popup = {
  enabled: true,
  title: 'Nossa polissonografia é particular',
  note: 'E a gente facilita tudo para você.',
  // Destaque de reembolso (deixe refund: null para esconder)
  refund: {
    title: 'Seu plano pode te devolver o valor',
    text: 'Com a nota fiscal, você pode verificar junto ao seu plano a possibilidade de reembolso.',
  } as { title: string; text: string } | null,
  bullets: [
    { icon: '/images/popup/cartao.png', text: 'Parcelamos no cartão' },
    { icon: '/images/popup/relogio.png', text: 'Agenda rápida, sem esperar o plano' },
  ],
  button: 'Quero voltar a dormir bem',
  message: 'Olá! Vim do site e quero resolver meu sono. Gostaria de agendar a polissonografia particular. Pode me ajudar com valores, pagamento e reembolso pelo plano?',
};

const REFUND_ICON = '/images/popup/reembolso.png';

// Botão de WhatsApp que fala de polissonografia (no texto da mensagem, no data-track ou no rótulo)
function isPolissoWhatsApp(a: HTMLAnchorElement) {
  const href = a.getAttribute('href') || '';
  if (!/wa\.me|whatsapp/i.test(href) || a.closest('dialog.pso')) return false;
  let text = '';
  try { text = new URL(href, location.href).searchParams.get('text') || ''; } catch { /* */ }
  const hay = `${text} ${a.dataset.track || ''} ${a.getAttribute('aria-label') || ''}`;
  return /polissonografia/i.test(hay);
}

export default function PolissoPopup() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const continued = useRef(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (!popup.enabled) return;
    const open = (label: string, section?: string) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      continued.current = false;
      document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => d.close());
      setOrigin(label);
      dialog.showModal();
      window.__track?.({ type: 'polisso_open', label: label.slice(0, 80), section });
    };

    // Fase de captura na window: roda antes do rastreador (que escuta no document),
    // assim o clique original não conta como "clicou no WhatsApp" — só conta quando
    // a pessoa segue pelo botão do pop-up.
    const onClick = (ev: MouseEvent) => {
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const a = (ev.target as Element | null)?.closest('a') as HTMLAnchorElement | null;
      if (!a || !isPolissoWhatsApp(a)) return;
      ev.preventDefault();
      ev.stopPropagation();
      const label = (a.dataset.track || a.textContent || 'WhatsApp polissonografia').replace(/\s+/g, ' ').trim();
      open(label, sectionNameOf(a));
    };
    window.addEventListener('click', onClick, { capture: true });

    // Pré-visualização: /?previewPolisso=1
    if (new URLSearchParams(location.search).get('previewPolisso') === '1') {
      window.setTimeout(() => dialogRef.current?.showModal(), 300);
    }
    return () => window.removeEventListener('click', onClick, { capture: true });
  }, []);

  const close = () => {
    if (!continued.current) window.__track?.({ type: 'polisso_close', label: origin.slice(0, 80) || 'fechou' });
    dialogRef.current?.close();
  };

  const href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(popup.message)}`;

  return (
    <dialog
      ref={dialogRef}
      className="pso"
      aria-labelledby="pso-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dialogRef.current) close(); }}
    >
      <div className="pso-card">
        <button className="pso-close" type="button" aria-label="Fechar" onClick={close}><X size={20} /></button>
        <div className="pso-head">
          <h2 id="pso-title">{popup.title}</h2>
          <p className="pso-note">{popup.note}</p>
        </div>
        {popup.refund && (
          <div className="pso-refund">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pso-refund-ico" src={REFUND_ICON} alt="" aria-hidden="true" />
            <div><b>{popup.refund.title}</b><span>{popup.refund.text}</span></div>
          </div>
        )}
        <ul className="pso-list">
          {popup.bullets.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <li key={b.text}><img src={b.icon} alt="" aria-hidden="true" />{b.text}</li>
          ))}
        </ul>
        <a
          className="pso-cta"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-track="Pop-up polissonografia: continuar no WhatsApp"
          onClick={() => { continued.current = true; window.setTimeout(() => dialogRef.current?.close(), 150); }}
        >
          <WhatsAppIcon className="h-5 w-5" aria-hidden="true" /> {popup.button}
        </a>
        <button type="button" className="pso-back" onClick={close}>Voltar ao site</button>
      </div>
    </dialog>
  );
}
