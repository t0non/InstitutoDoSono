'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Building, ChevronLeft, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % clinicImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + clinicImages.length) % clinicImages.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % clinicImages.length);
  };

  return (
    <section id="clinica" className="history-section">
      <div className="container">
        <div className="history-grid items-start">
          <div className="history-text" data-aos="fade-right">
            <div className="category-header" style={{ border: 'none', paddingBottom: 0, justifyContent: 'flex-start' }}>
               <Building className="icon" />
               <h3>Clínica do Sono em Belo Horizonte: Tradição e Tecnologia</h3>
            </div>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px', lineHeight: '1.7' }}>
              Desde <strong>1994</strong>, o <strong>Instituto do Sono de Minas Gerais</strong> é a principal referência em <strong>medicina do sono e neurologia em Belo Horizonte</strong>. Com mais de 30 anos de atuação, unimos a tradição e a alta especialização de um corpo clínico renomado às mais modernas tecnologias diagnósticas para entregar laudos rápidos e tratamentos humanizados de excelência.
            </p>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px', lineHeight: '1.7' }}>
              Nossa sede própria, localizada estrategicamente no bairro <strong>Barro Preto (BH)</strong>, foi projetada sob rígidos padrões de acessibilidade. Oferecemos uma infraestrutura completa e acolhedora, totalmente equipada para cuidar do bem-estar e da saúde de toda a sua família com máxima segurança.
            </p>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.7' }}>
              Nossas suítes de exames contam com <strong>isolamento acústico completo</strong>, camas confortáveis de padrão hoteleiro e climatização sob medida, simulando perfeitamente a tranquilidade do seu lar. Assim, exames essenciais como a <strong>Polissonografia clínica</strong> e o <strong>Eletroencefalograma (EEG)</strong> ocorrem de forma 100% natural, segura e indolor, garantindo diagnósticos de alta precisão para ronco, apneia e insônia.
            </p>
          </div>
          
          <div 
            className="w-full flex flex-col gap-4" 
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
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}

              {/* Slider Controls */}
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>

              {/* Number indicator */}
              <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {activeIndex + 1} / {clinicImages.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-600/30">
              {clinicImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex 
                      ? 'border-[#3b82f6] scale-95 shadow-md shadow-blue-500/20' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`Miniatura ${index + 1}`}
                    fill
                    sizes="80px"
                    unoptimized
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
