'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const reviews = [
  {
    name: 'Carlos Silva',
    text: 'Atendimento sensacional, desde o WhatsApp. O Dr. Welser é um gênio da neurofisiologia: gentil, simpático e com um conhecimento fora da curva. Equipe padrão ouro!',
    time: 'Há uma semana',
    initial: 'C',
    bgColor: 'bg-emerald-600'
  },
  {
    name: 'Mariana Costa',
    text: 'O exame domiciliar foi a salvação! Cuidar da minha mãe acamada ficou muito mais fácil com a equipe vindo até nós. Profissionalismo e carinho definem o serviço.',
    time: 'Há 2 semanas',
    initial: 'M',
    bgColor: 'bg-blue-600'
  },
  {
    name: 'Roberto Almeida',
    text: 'Finalmente uma noite de sono sem interrupções! A Dra. Andrea ajustou meu CPAP com uma paciência que eu nunca tinha visto. Recomendo de olhos fechados.',
    time: 'Há 3 semanas',
    initial: 'R',
    bgColor: 'bg-orange-600'
  },
  {
    name: 'Fernanda Lima',
    text: 'Meu filho fazia acompanhamento com a Dra. Andrea. A atenção e o cuidado dela com as crianças é algo que conforta qualquer coração de mãe. Só gratidão.',
    time: 'Há um mês',
    initial: 'F',
    bgColor: 'bg-purple-600'
  },
  {
    name: 'Lucas Pereira',
    text: 'Processo rápido e sem burocracia. Agendei pelo WhatsApp, enviei os documentos e no dia seguinte já estava com o exame marcado. Impressionado com a eficiência.',
    time: 'Há um mês',
    initial: 'L',
    bgColor: 'bg-cyan-600'
  },
  {
    name: 'Juliana Santos',
    text: 'Excelente atendimento. Dr. Welser foi muito atencioso com meu pai, tirou todas as dúvidas. A clínica é muito bem estruturada. Nos sentimos seguros.',
    time: 'Há 2 meses',
    initial: 'J',
    bgColor: 'bg-pink-600'
  },
];

export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  // Native Autoplay Effect (Pausa ao passar o mouse)
  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // 5 segundos

    return () => clearInterval(interval);
  }, [emblaApi, isHovered]);

  return (
    <section id="avaliacoes" className="bg-white py-12 md:py-16 border-b border-slate-100 overflow-hidden">
      <div className="container mx-auto px-5 max-w-6xl">
        
        {/* Header Block with Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] mb-3">
              O que nossos pacientes dizem
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              A confiança e o carinho de quem recuperou a qualidade de vida e a saúde do sono com nossa equipe.
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 mt-6 md:mt-0 select-none">
            <button 
              onClick={scrollPrev} 
              className="w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-500/20 hover:shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95"
              aria-label="Anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={scrollNext} 
              className="w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-500/20 hover:shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95"
              aria-label="Próximo"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Container wrapper */}
        <div 
          className="embla" 
          ref={emblaRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="embla__container" style={{ display: 'flex', marginLeft: '-20px' }}>
            {reviews.map((review, index) => (
              <div 
                key={review.name} 
                className="embla__slide" 
                style={{ 
                  flex: '0 0 100%', 
                  paddingLeft: '20px', 
                  minWidth: 0 
                }}
              >
                <div className="w-full h-full">
                  <ReviewCard review={review} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Custom CSS overrides to show multi-cards on tablet & desktop */}
        <style jsx global>{`
          @media (min-width: 768px) {
            .embla__slide {
              flex: 0 0 50% !important;
            }
          }
          @media (min-width: 1024px) {
            .embla__slide {
              flex: 0 0 33.333% !important;
            }
          }
        `}</style>

      </div>
    </section>
  );
}

// Single Card Component for cleaner structure
function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="group bg-white p-7 rounded-2xl border border-slate-200/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
      {/* Header (Name, Stars, Google Icon) */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {/* Google Colored Avatar Circle */}
          <div className={`w-11 h-11 rounded-full ${review.bgColor} text-white flex items-center justify-center font-extrabold text-lg mr-3.5 shadow-sm uppercase select-none`}>
            {review.initial}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 tracking-tight text-[0.95rem]">{review.name}</h4>
            <div className="text-slate-400 text-xs font-semibold mt-0.5">{review.time}</div>
          </div>
        </div>

        {/* Google Icon Badge (Top Right) */}
        <div className="h-5 w-5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>
      </div>

      {/* Google Stars */}
      <div className="flex gap-0.5 text-[#FABB05] mb-3.5">
        <Star fill="currentColor" strokeWidth={0} size={15} />
        <Star fill="currentColor" strokeWidth={0} size={15} />
        <Star fill="currentColor" strokeWidth={0} size={15} />
        <Star fill="currentColor" strokeWidth={0} size={15} />
        <Star fill="currentColor" strokeWidth={0} size={15} />
      </div>

      {/* Review Text */}
      <p className="text-slate-600 text-[0.88rem] leading-relaxed flex-grow italic mb-4">
        "{review.text}"
      </p>

      {/* Verification Seal */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400 font-semibold select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Recomendado
        </span>
        <span>Google Maps</span>
      </div>
    </div>
  );
}
