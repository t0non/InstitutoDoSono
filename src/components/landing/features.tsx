import Link from 'next/link';
import { Home, Award, Baby, Hospital } from 'lucide-react';
import { config } from '@/lib/config';

const featureItems = [
    {
        icon: <Home />,
        title: 'Atendimento Domiciliar',
        description: 'Levamos o equipamento até sua casa para pacientes acamados ou idosos.'
    },
    {
        icon: <Award />,
        title: 'Corpo Clínico Mestre',
        description: 'Médicos com mestrado e especialização nos maiores centros do país.'
    },
    {
        icon: <Baby />,
        title: 'Poligrafia Neonatal',
        description: 'Especialistas em exames sensíveis para recém-nascidos.'
    },
    {
        icon: <Hospital />,
        title: 'Suporte Hospitalar',
        description: 'Atuação direta em hospitais para casos de urgência neurológica.'
    }
]

export default function Features() {
  return (
    <section className="section-padding features">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="container features-grid">
        <div data-aos="fade-right">
          <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--highlight-val)' }}>
            Por que nos escolher
          </span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Tecnologia a favor da vida</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
            Não somos apenas uma clínica. Somos um centro de referência tecnológica em neurofisiologia. Entendemos que diagnósticos precisos exigem equipamentos de ponta e olhar humano.
          </p>
          <Link href={config.whatsappLink} className="btn" style={{ background: 'var(--white-val)', color: 'var(--primary-val)' }}>
            Falar com Atendente
          </Link>
        </div>
        
        <div className="feature-list" data-aos="fade-left">
            {featureItems.map(item => (
                <div key={item.title} className="feature-item">
                    {item.icon}
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
