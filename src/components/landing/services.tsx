'use client';
import React from 'react';
import Image from 'next/image';
import { config } from '@/lib/config';
import { useWhatsAppLinks } from '@/hooks/useWhatsAppLinks';
import { WhatsAppIcon } from '../icons';

const exams = [
  {
    title: 'Potenciais Evocados Completos',
    description: 'Diagnósticos das vias sensoriais através de exames de Potenciais Evocados P300, BERA (auditivo), Visual, Eletroretinografia, Gênito-Cortical e Somato-Sensitivo MMII e MMSS.',
    image: '/images/Potenciais Evocados Completos.jpg',
  },
  {
    title: 'Consultas Neurológicas Especializadas',
    description: 'Consultas neurológicas focadas no diagnóstico e tratamento clínico de Distúrbios do Sono, Ronco Crônico, Enxaqueca e Cefaleias, e Epilepsias.',
    image: '/images/escritorio (3).jpeg',
  },
  {
    title: 'Polissonografia (Clínica e Domiciliar)',
    description: 'Realização de exames completos de Polissonografia clínica (Tipo 1) e Polissonografia domiciliar (Tipo 2) para o diagnóstico preciso de ronco e apneia.',
    image: '/images/polissonografia.avif',
  },
  {
    title: 'Eletroencefalografia (EEG Clínica & Neonatal)',
    description: 'Realizamos Eletroencefalografia EEG convencional e Poligrafia Neonatal dedicada a recém-nascidos para mapeamento e diagnóstico cerebral.',
    image: '/images/encefalograma egg.webp',
  },
  {
    title: 'EEG Quantitativo & Mapeamento Cerebral',
    description: 'Análise digital quantitativa com mapeamento cerebral colorido de alta precisão da atividade elétrica cerebral.',
    image: '/images/EEG Quantitativo & Mapeamento Cerebral.webp',
  },
  {
    title: 'Vídeo-Eletroencefalografia (VEEG)',
    description: 'Monitoramento contínuo em vídeo associado ao EEG para avaliação de crises convulsivas de difícil controle em crianças e adultos.',
    image: '/images/Vídeo-Eletroencefalografia (VEEG).png',
  }
];

export default function Services() {
  const { generateCustomLink } = useWhatsAppLinks();

  return (
    <section id="servicos" aria-labelledby="services-title" className="services-carousel-section">
      <div className="container">
        <h2 id="services-title" className="carousel-title">Nossos Exames de Sono e Neurologia</h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-10 -mt-2 text-sm sm:text-base leading-relaxed">
          Diagnósticos precisos e laudos médicos ágeis realizados por neurologistas e neurofisiologistas renomados em Belo Horizonte.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {exams.map((exam, index) => (
            <article 
              className={`exam-card ${exam.badge ? 'border-2 border-[#07457D] shadow-[0_0_20px_rgba(7, 69, 125,0.15)] ring-4 ring-blue-50 relative z-10' : ''}`} 
              key={index}
            >
              <div className="exam-img-wrapper relative">
                {exam.badge && (
                  <span className="absolute top-3 right-3 z-10 bg-[#07457D] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {exam.badge}
                  </span>
                )}
                <Image 
                  src={exam.image} 
                  alt={`Imagem do exame: ${exam.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className="exam-img"
                />
              </div>
              <div className="exam-content flex flex-col flex-grow text-left">
                <h3 className="mb-2">{exam.title}</h3>
                <p className="mb-4">{exam.description}</p>
                <a 
                  href={generateCustomLink(`gostaria de agendar o exame: ${exam.title}`)} 
                  aria-label={`Agendar ${exam.title} pelo WhatsApp`}
                  data-track={`Agendar exame: ${exam.title}`}
                  className="mt-auto w-full h-[44px] bg-[#07457D] hover:bg-[#07457D] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-sm hover:shadow-md"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" /> Agendar no WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="exam-help-panel">
          <h3>Não encontrou seu exame?</h3>
          <p>Fale com a nossa equipe para confirmar se realizamos o exame do seu pedido.</p>
          <div className="exam-help-actions"><a href="/contato/" className="clinic-location-button clinic-location-outline">Falar com a equipe</a><a href={generateCustomLink('não encontrei meu exame. Vocês realizam o exame do meu pedido?')} className="clinic-location-button"><WhatsAppIcon className="h-4 w-4" aria-hidden="true" />Consultar no WhatsApp</a></div>
          <a href="/onde-atendemos/" className="info-page-link">Onde fazer exames em Belo Horizonte →</a>
        </div>
      </div>
    </section>
  );
}
