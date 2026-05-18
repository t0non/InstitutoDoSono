'use client';
import React, { useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay Effect (Exames passam sozinhos, pausa se passar o mouse)
  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // 4 segundos por slide

    return () => clearInterval(interval);
  }, [emblaApi, isHovered]);

  return (
    <section id="servicos" className="services-carousel-section">
      <div className="container">
        <h2 className="carousel-title">Nossos Exames de Sono e Neurologia</h2>
        <p className="text-slate-300 text-center max-w-2xl mx-auto mb-10 -mt-2 text-sm sm:text-base leading-relaxed">
          Diagnósticos precisos e laudos médicos ágeis realizados por neurologistas e neurofisiologistas renomados em Belo Horizonte.
        </p>
        
        <div 
          className="carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button className="carousel-btn prev-btn" onClick={scrollPrev}>
            <ChevronLeft size={30} />
          </button>

          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {exams.map((exam, index) => (
                <div className="embla__slide" key={index}>
                  <div className="exam-card">
                    <div className="exam-img-wrapper">
                      <Image 
                        src={exam.image} 
                        alt={exam.title}
                        fill
                        unoptimized
                        className="exam-img"
                      />
                    </div>
                    <div className="exam-content">
                      <h3>{exam.title}</h3>
                      <p>{exam.description}</p>
                      <a 
                        href={config.whatsappLink} 
                        className="mt-5 w-full h-[44px] bg-[#25D366] hover:bg-[#1ebc57] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-sm hover:shadow-md"
                      >
                        <WhatsAppIcon className="h-4 w-4" /> Agendar no WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn next-btn" onClick={scrollNext}>
            <ChevronRight size={30} />
          </button>
        </div>

        <div className="carousel-pagination">
          {selectedIndex + 1} / {exams.length}
        </div>

        <div className="carousel-actions mt-12">
          <a href={config.whatsappLink} className="btn btn-primary w-full sm:w-[260px] h-[56px] flex items-center justify-center">
            <WhatsAppIcon className="h-5 w-5 mr-2" /> Agendar Exame
          </a>
          <a href="#localizacao" className="btn w-full sm:w-[260px] h-[56px] border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center">
            Como chegar?
          </a>
        </div>
      </div>
    </section>
  );
}
