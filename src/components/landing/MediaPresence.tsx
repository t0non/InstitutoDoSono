'use client';
import React from 'react';
import { Play, Instagram, Tv, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function MediaPresence() {
  return (
    <section id="na-midia" className="py-16 bg-[#f8fafc] text-slate-800 relative overflow-hidden border-t border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Title Block - Clean & Centered */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Tv size={13} /> Presença na Imprensa & Mídia
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2447] tracking-tight mb-3">
            O Instituto do Sono na Mídia
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Como referência técnica em neurofisiologia e medicina do sono em Minas Gerais, nossa equipe é frequentemente convidada para levar informações e dicas de saúde nos principais canais de comunicação.
          </p>
        </div>

        {/* Clean Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Globoplay / Rede Globo Video Report */}
          <a 
            href="https://globoplay.globo.com/v/4276901/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-white border border-slate-200/80 rounded-3xl p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] hover:border-blue-500/20"
          >
            {/* Real Video Preview Block */}
            <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-slate-100 flex items-center justify-center relative overflow-hidden mb-5">
              {/* Actual Video Preview Background */}
              <Image 
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&auto=format&fit=crop&q=80" 
                alt="Matéria Especial Rede Globo"
                fill
                unoptimized
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Play Button Overlay */}
              <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 z-10 border-4 border-white/20">
                <Play size={26} className="fill-current ml-1" />
              </div>
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
              
              {/* Logo / Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10 bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-lg border border-white/10">
                <span className="font-semibold flex items-center gap-1.5"><Tv size={12} className="text-blue-400" /> Rede Globo / Globoplay</span>
                <span className="opacity-80">Jornalismo MG</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold text-[#0b2447] mb-2 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                Matéria Especial sobre Higiene do Sono
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Assista à entrevista especial veiculada na Rede Globo destacando os principais distúrbios de sono, a importância do diagnóstico preciso e dicas fundamentais de higiene do sono gravadas nas instalações do Instituto do Sono.
              </p>
            </div>
          </a>

          {/* Card 2: Instagram Post */}
          <a 
            href="https://www.instagram.com/p/DL2XB1CMtyd/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-white border border-slate-200/80 rounded-3xl p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] hover:border-[#e1306c]/20"
          >
            {/* Real Instagram Preview Block */}
            <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-slate-100 flex items-center justify-center relative overflow-hidden mb-5">
              {/* Actual Instagram Infographic Preview Background */}
              <Image 
                src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&auto=format&fit=crop&q=80" 
                alt="Publicação Instagram Higiene do Sono"
                fill
                unoptimized
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Instagram Icon Overlay */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f91a53] to-[#b615d0] text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 z-10 border-4 border-white/20">
                <Instagram size={26} />
              </div>
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
              
              {/* Logo / Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10 bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-lg border border-white/10">
                <span className="font-semibold flex items-center gap-1.5"><Instagram size={12} className="text-[#e1306c]" /> @ClínicaDoSono</span>
                <span className="opacity-80">Dica Médica</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold text-[#0b2447] mb-2 group-hover:text-[#e1306c] transition-colors flex items-center justify-between">
                Orientação Médica & Saúde no Instagram
                <ExternalLink size={16} className="text-slate-400 group-hover:text-[#e1306c] transition-colors" />
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Confira nossa publicação oficial no Instagram com recomendações clínicas detalhadas, orientações de higiene do sono para o dia a dia e suporte rápido para agendamentos.
              </p>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
