'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { config } from '@/lib/config';


const clinicImages = [
  { src: '/images/escritorio (1).jpeg', alt: 'Sede Instituto do Sono - Fachada Externa' },
  { src: '/images/escritorio (2).jpeg', alt: 'Estrutura Instituto do Sono - Recepção Principal' },
  { src: '/images/escritorio (3).jpeg', alt: 'Estrutura Instituto do Sono - Consultório Médico' },
  { src: '/images/escritorio (4).jpeg', alt: 'Estrutura Instituto do Sono - Quarto de Exames Conforto' },
  { src: '/images/escritorio (5).jpeg', alt: 'Estrutura Instituto do Sono - Sala de Triagem e Tecnologia' },
  { src: '/images/escritorio (6).jpeg', alt: 'Estrutura Instituto do Sono - Sala de Espera Conforto' },
  { src: '/images/escritorio (7).jpeg', alt: 'Estrutura Instituto do Sono - Detalhes do Atendimento' }
];

export default function ClinicHistory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // só baixa a foto quando ela vai aparecer (atual + próxima)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  useEffect(() => {
    setLoaded((prev) => {
      const next = (activeIndex + 1) % clinicImages.length;
      if (prev.has(activeIndex) && prev.has(next)) return prev;
      return new Set([...prev, activeIndex, next]);
    });
  }, [activeIndex]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % clinicImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section id="clinica" aria-labelledby="clinica-title" className="history-section">
      <div className="container flex flex-col">
        <div className="clinic-section-heading">
          <h2 id="clinica-title">Nossa Clínica</h2>
        </div>

        <div className="history-grid items-start">
          {/* Text Content */}
          <div className="history-text min-w-0 order-last lg:order-first" data-aos="fade-right">
            <h3 className="clinic-content-title">Clínica do Sono em Belo Horizonte</h3>
            
            <p className="text-[#64748b] mb-4 leading-relaxed">
              Desde <strong>1994</strong>, o <strong>Instituto do Sono de Minas Gerais</strong> é a principal referência em <strong>medicina do sono e neurologia em Belo Horizonte</strong>. Nossa missão é entregar diagnósticos precisos e acolhimento humano através de:
            </p>
            
            <ul className="list-disc pl-5 mb-6 text-[#64748b] leading-relaxed space-y-2">
              <li><strong>Tradição e Especialização:</strong> Mais de 30 anos de atuação com corpo clínico renomado e titulado.</li>
              <li><strong>Infraestrutura Completa em BH:</strong> Sede própria no <strong>Barro Preto</strong> projetada sob rígidos padrões de acessibilidade e conforto.</li>
              <li><strong>Suítes de Exames Padrão Hotel:</strong> Isolamento acústico, camas confortáveis e climatização para simular o seu lar.</li>
              <li><strong>Diagnósticos Seguros e Indolores:</strong> Exames como a <strong>Polissonografia (clínica e domiciliar)</strong>, o <strong>Eletroencefalograma (EEG)</strong> e <strong>Potenciais Evocados</strong> ocorrem de forma 100% natural, essenciais para diagnósticos precisos.</li>
            </ul>

            <a
              href={config.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver como chegar ao Instituto do Sono no Google Maps"
              className="btn btn-primary w-full sm:w-[260px] h-[56px] flex items-center justify-center"
            >
              <MapPin className="h-5 w-5 mr-2" /> Como chegar
            </a>
          </div>
          
          {/* Images Slider */}
          <div 
            className="w-full flex flex-col gap-4 min-w-0 order-first lg:order-last" 
            data-aos="fade-left"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main Image Slider */}
            <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl group bg-slate-900">
              {clinicImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  {loaded.has(index) && <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />}
                </div>
              ))}

              {/* Number indicator */}
              <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {activeIndex + 1} / {clinicImages.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="clinic-thumbnails flex gap-2 overflow-x-auto pb-2">
              {clinicImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex 
                      ? 'border-[#07457D] scale-95 shadow-md shadow-blue-500/20' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
