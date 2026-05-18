'use client';
import React from 'react';
import Image from 'next/image';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

const exams = [
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
  },
  {
    title: 'Potenciais Evocados Completos',
    description: 'Diagnósticos das vias sensoriais através de exames de Potenciais Evocados P300, BERA (auditivo), Visual, Eletroretinografia, Gênito-Cortical e Somato-Sensitivo MMII e MMSS.',
    image: '/images/Potenciais Evocados Completos.jpg',
  }
];

export default function Services() {
  return (
    <section id="servicos" aria-labelledby="services-title" className="services-carousel-section">
      <div className="container">
        <h2 id="services-title" className="carousel-title">Nossos Exames de Sono e Neurologia</h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-10 -mt-2 text-sm sm:text-base leading-relaxed">
          Diagnósticos precisos e laudos médicos ágeis realizados por neurologistas e neurofisiologistas renomados em Belo Horizonte.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {exams.map((exam, index) => (
            <article className="exam-card" key={index}>
              <div className="exam-img-wrapper">
                <Image 
                  src={exam.image} 
                  alt={`Imagem do exame: ${exam.title}`}
                  fill
                  unoptimized
                  className="exam-img"
                />
              </div>
              <div className="exam-content flex flex-col flex-grow text-left">
                <h3 className="mb-2">{exam.title}</h3>
                <p className="mb-4">{exam.description}</p>
                <a 
                  href={config.whatsappLink} 
                  aria-label={`Agendar ${exam.title} pelo WhatsApp`}
                  className="mt-auto w-full h-[44px] bg-[#25D366] hover:bg-[#1ebc57] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-sm hover:shadow-md"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" /> Agendar no WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="carousel-actions mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href={config.whatsappLink} aria-label="Agendar qualquer exame pelo WhatsApp" className="btn btn-primary w-full sm:w-[260px] h-[56px] flex items-center justify-center">
            <WhatsAppIcon className="h-5 w-5 mr-2" aria-hidden="true" /> Agendar Exame
          </a>
          <a href="#localizacao" aria-label="Ver como chegar à clínica" className="btn w-full sm:w-[260px] h-[56px] border-2 border-[#0b2447]/20 text-[#0b2447] bg-transparent hover:bg-[#0b2447]/5 hover:border-[#0b2447] transition-all duration-300 flex items-center justify-center">
            Como chegar?
          </a>
        </div>
      </div>
    </section>
  );
}
