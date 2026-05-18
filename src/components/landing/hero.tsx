import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

export default function Hero() {
  return (
    <section className="hero">
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
          <h1>Especialistas em Medicina do Sono e Neurologia em Belo Horizonte</h1>
          <p>
            Clínica de referência em exames de Polissonografia (clínica e domiciliar), Eletroencefalograma (EEG) e tratamento especializado de ronco e apneia obstrutiva do sono em BH.
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={config.whatsappLink} className="btn btn-primary w-full sm:w-[260px] h-[56px] flex items-center justify-center">
              <WhatsAppIcon className="h-5 w-5 mr-2" /> Agendar Exame
            </a>
            <a href="#servicos" className="btn btn-white w-full sm:w-[260px] h-[56px] flex items-center justify-center">
              Ver Exames
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
