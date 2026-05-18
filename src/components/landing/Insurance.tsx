'use client';

import Image from 'next/image';

export default function Insurance() {
  const insurances = [
    { name: 'Unimed', src: '/images/unimed.png' },
    { name: 'Bradesco', src: '/images/bradesco.png' },
    { name: 'SulAmérica', src: '/images/sulameric.png' },
    { name: 'Amil', src: '/images/amil.png' },
    { name: 'IPSEMG', src: '/images/ipsemg.png' },
    { name: 'CEMIG', src: '/images/cemig.png' },
  ];

  return (
    <section className="py-8 bg-slate-50/50 border-b border-slate-100">
      <div className="container mx-auto px-5 text-center">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-6">
          Atendemos Particular e Convênios
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-12 gap-y-6">
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
                className="object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] sm:text-xs mt-6 text-slate-400 font-medium">
          *Consulte cobertura para o seu plano no WhatsApp.
        </p>
      </div>
    </section>
  );
}