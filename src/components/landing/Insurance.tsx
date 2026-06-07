'use client';

import Image from 'next/image';

export default function Insurance() {
  const insurances = [
    { name: 'AAG', src: '/images/aag.png', className: 'scale-[1.6] sm:scale-[1.8]' },
    { name: 'Amagis', src: '/images/amagis.webp', className: 'scale-[0.9] sm:scale-[0.95]' },
    { name: 'Amil', src: '/images/amil.png', className: 'scale-[1.05]' },
    { name: 'CASSI', src: '/images/logo_cassi.jpg', className: 'mix-blend-multiply' },
    { name: 'CASU', src: '/images/casu.png', className: 'scale-[1.5] sm:scale-[1.65]' },
    { name: 'Libertas', src: '/images/libertas.jpg', className: 'mix-blend-multiply scale-[1.05]' },
    { name: 'Stellantis', src: '/images/stellantis.png', className: 'scale-[1.25] sm:scale-[1.35]' },
    { name: 'Unimed', src: '/images/unimed.png', className: 'scale-[0.95]' },
    { name: 'Usisaúde', src: '/images/usisaude-logo.png', className: 'scale-[0.95]' },
  ];

  return (
    <section className="py-10 bg-white border-b border-slate-100">
      <div className="container mx-auto px-5 text-center">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-8">
          Atendemos Particular e Convênios
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-14 gap-y-8 max-w-5xl mx-auto">
          {insurances.map((ins) => (
            <div 
              key={ins.name} 
              className="relative h-8 w-24 sm:h-10 sm:w-28 flex items-center justify-center transition-all duration-300 hover:scale-105 select-none"
            >
              <Image
                src={ins.src}
                alt={`Logo ${ins.name}`}
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className={`object-contain ${ins.className || ''}`}
                unoptimized
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] sm:text-xs mt-8 text-slate-400 font-medium">
          *Consulte cobertura para o seu plano no WhatsApp.
        </p>
      </div>
    </section>
  );
}