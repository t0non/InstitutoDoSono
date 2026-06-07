import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

export default function Hero() {
  return (
    <header className="hero" aria-labelledby="hero-heading">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hero-bg-video"
      >
        <source src="/images/sessao1.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-grid">
        <div className="hero-text" data-aos="fade-up">
          <span className="hero-badge">Atendimento Humanizado e Tecnológico</span>
          <h1 id="hero-heading">Especialistas em Medicina do Sono e Neurologia em Belo Horizonte</h1>
          <p>
            Clínica de referência em exames de <strong>Polissonografia (clínica e domiciliar)</strong>, <strong>Eletroencefalograma (EEG)</strong> e tratamento especializado de <strong>ronco e apneia obstrutiva do sono</strong> em BH.
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={config.whatsappLink} aria-label="Agendar Exame de Sono via WhatsApp" className="btn btn-primary w-full sm:w-[260px] h-[56px] flex items-center justify-center">
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
