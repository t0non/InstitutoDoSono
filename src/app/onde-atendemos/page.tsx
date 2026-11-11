import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Home, Clock } from 'lucide-react';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import MobileStickyBar from '@/components/landing/MobileStickyBar';
import CoverageDirectory from '@/components/landing/CoverageDirectory';
import { WhatsAppIcon } from '@/components/icons';
import { clinicServices } from '@/lib/clinic-services';
import { neighborhoods } from '@/lib/bh-neighborhoods';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Onde atendemos em Belo Horizonte | Instituto do Sono',
  description: 'Encontre seu bairro em BH e consulte polissonografia, EEG, consultas neurológicas e potenciais evocados. Clínica no Barro Preto e atendimento domiciliar sob consulta.',
  alternates: { canonical: 'https://www.institutodosonobh.com.br/onde-atendemos/' },
};

export default function CoveragePage() {
  const phoneDigits = config.phoneNumber.replace(/\D/g, '');
  const site = 'https://www.institutodosonobh.com.br';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalClinic',
        '@id': `${site}/#clinic`,
        name: 'Instituto do Sono de Minas Gerais',
        url: `${site}/`,
        telephone: `+55${phoneDigits}`,
        medicalSpecialty: ['Neurologic', 'SleepMedicine'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'R. dos Aimorés, 3018 - Sala 704',
          addressLocality: 'Belo Horizonte',
          addressRegion: 'MG',
          postalCode: '30140-073',
          addressCountry: 'BR',
        },
        areaServed: [
          { '@type': 'City', name: 'Belo Horizonte' },
          ...neighborhoods.map((name) => ({ '@type': 'Place', name: `${name}, Belo Horizonte - MG` })),
        ],
        availableService: clinicServices.map((name) => ({ '@type': 'MedicalProcedure', name })),
      },
      {
        '@type': 'WebPage',
        '@id': `${site}/onde-atendemos/#webpage`,
        url: `${site}/onde-atendemos/`,
        name: 'Onde atendemos em Belo Horizonte | Instituto do Sono',
        about: { '@id': `${site}/#clinic` },
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="coverage-page">
        {/* Intro */}
        <section className="coverage-hero">
          <div className="site-content-width">
            <span className="coverage-kicker">Atendimento em toda BH</span>
            <h1>Onde atendemos em Belo Horizonte-MG</h1>
            <p className="coverage-lead">
              Procurando <strong>clínica do sono perto de você em BH</strong>? O Instituto do Sono recebe pacientes de todos os bairros de Belo Horizonte
              para <strong>polissonografia</strong>, <strong>eletroencefalograma (EEG)</strong>, <strong>potenciais evocados</strong> e <strong>consultas neurológicas</strong>,
              na clínica do <strong>Barro Preto</strong>. A <strong>polissonografia domiciliar</strong> é feita na sua casa, com disponibilidade confirmada por endereço.
            </p>
            <div className="coverage-hero-actions">
              <a className="clinic-location-button coverage-btn-wpp" href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-4 w-4" aria-hidden="true" /> Falar no WhatsApp
              </a>
              <a className="clinic-location-button clinic-location-outline" href={`tel:+55${phoneDigits}`}>
                <Phone size={16} aria-hidden="true" /> {config.phoneNumber}
              </a>
            </div>
          </div>
        </section>

        {/* Info cards */}
        <section className="site-content-width coverage-info">
          <div className="coverage-info-card">
            <MapPin size={22} aria-hidden="true" />
            <div>
              <h2>Clínica no Barro Preto</h2>
              <p>{config.address}</p>
              <a className="info-page-link" href={config.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">Como chegar →</a>
            </div>
          </div>
          <div className="coverage-info-card">
            <Home size={22} aria-hidden="true" />
            <div>
              <h2>Polissonografia domiciliar</h2>
              <p>Realizada na sua casa, com disponibilidade confirmada para cada endereço.</p>
            </div>
          </div>
          <div className="coverage-info-card">
            <Clock size={22} aria-hidden="true" />
            <div>
              <h2>Horário</h2>
              <p>Segunda a sexta: 08h às 18h<br />Exames noturnos com agendamento.</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="site-content-width coverage-services">
          <h2>Serviços do Instituto do Sono</h2>
          <p>Exames e atendimentos disponíveis para moradores de Belo Horizonte.</p>
          <ul>
            {clinicServices.map((service) => <li key={service}>{service}</li>)}
          </ul>
        </section>

        {/* Directory */}
        <section className="site-content-width coverage-directory" aria-labelledby="coverage-directory-title">
          <h2 id="coverage-directory-title">Bairros atendidos em Belo Horizonte</h2>
          <p>Busque seu bairro, escolha o serviço e fale direto com a nossa equipe.</p>
          <CoverageDirectory />
        </section>

        {/* CTA */}
        <section className="coverage-cta">
          <div className="site-content-width">
            <div>
              <h2>Vamos organizar seu atendimento?</h2>
              <p>Confirme o exame, o preparo e a modalidade com nossa equipe.</p>
            </div>
            <Link className="clinic-location-button" href="/contato/">Fale conosco</Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
