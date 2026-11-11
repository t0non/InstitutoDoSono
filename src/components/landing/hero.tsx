'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { WhatsAppIcon } from '../icons';
import { useWhatsAppLinks } from '@/hooks/useWhatsAppLinks';

// O vídeo só carrega em telas grandes com internet boa.
// Celular, internet lenta ou "economia de dados" ficam só com a imagem (carrega na hora).
function useCanPlayVideo() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const conn = nav.connection;
    const slow = !!conn && (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || ''));
    const big = window.matchMedia('(min-width: 768px)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!big || slow || calm) return;
    // espera a página terminar de carregar antes de baixar o vídeo
    const start = () => setOk(true);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);
  return ok;
}

export default function Hero() {
  const { whatsappLink } = useWhatsAppLinks();
  const canPlay = useCanPlayVideo();
  return (
    <header className="hero" aria-labelledby="hero-heading">
      <Image
        src="/images/hero-sono-poster.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={60}
        className="hero-bg-video"
      />
      {canPlay && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="hero-bg-video"
        >
          <source src="/images/hero-sono.mp4" type="video/mp4" />
        </video>
      )}
      <div className="hero-overlay" />
      <div className="hero-grid">
        <div className="hero-text" data-aos="fade-up">
          <span className="hero-badge">Referência em sono em BH</span>
          <h1 id="hero-heading">Especialistas em Medicina do Sono e Neurologia em Belo Horizonte</h1>
          <p>
            Clínica de referência em exames de <strong>Polissonografia (clínica e domiciliar)</strong>, <strong>Eletroencefalograma (EEG)</strong>, <strong>Potenciais Evocados</strong> e tratamento especializado de <strong>ronco e apneia obstrutiva do sono</strong> em BH.
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={whatsappLink} aria-label="Agendar Exame de Sono via WhatsApp" className="btn btn-primary btn-wpp-green w-full sm:w-[260px] h-[56px] flex items-center justify-center">
              <WhatsAppIcon className="h-5 w-5 mr-2" /> Agendar Exame
            </a>
            <a href="#servicos" aria-label="Ver todos os exames disponíveis" className="btn btn-white w-full sm:w-[260px] h-[56px] flex items-center justify-center">
              Ver Exames
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
