'use client';
import React from 'react';
import Image from 'next/image';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

const doctors = [
  {
    name: 'Dr. Welser Machado',
    specialty: 'Neurologista e Médico do Sono',
    bio: 'Pioneiro e referência em medicina do sono em Minas Gerais. Mais de 30 anos de atuação especializada no diagnóstico e tratamento de distúrbios neurológicos e respiratórios do sono.',
    imageUrl: 'https://files.catbox.moe/jws4gt.jpg',
    crm: 'CRM 5623',
    focus: ['Polissonografia', 'Apneia do Sono', 'Insônia', 'Ronco e Roncopatia'],
    wppLink: `${config.whatsappLink}&text=Olá,%20gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Welser%20Machado.`,
    alt: 'Dr. Welser Machado - Neurologista e Especialista em Medicina do Sono em MG',
  },
  {
    name: 'Dra. Andrea Julião',
    specialty: 'Epileptologista e Neurofisiologista',
    bio: 'Mestre em Neurofisiologia pela UFMG. Especialista com ampla trajetória em epilepsia refratária, eletroencefalograma de alta resolução e acompanhamento especializado adulto e pediátrico.',
    imageUrl: 'https://files.catbox.moe/h7slz7.jpg',
    crm: 'CRM 32374',
    focus: ['Epilepsia Geral e Infantil', 'Eletroencefalograma (EEG)', 'Mapeamento Cerebral', 'Neurofisiologia Clínica'],
    wppLink: `${config.whatsappLink}&text=Olá,%20gostaria%20de%20agendar%20uma%20consulta%20com%20a%20Dra.%20Andrea%20Julião.`,
    alt: 'Dra. Andrea Julião - Especialista em Epilepsia e Neurofisiologia em MG',
  },
];

export default function Doctors() {
  return (
    <section id="corpo-clinico" aria-labelledby="doctors-title" className="py-12 md:py-20 bg-white border-t border-b border-slate-100">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="px-4 py-1.5 text-xs font-bold text-[#2563eb] bg-blue-50 border border-blue-100 rounded-full uppercase tracking-wider">
            Corpo Clínico
          </span>
          <h2 id="doctors-title" className="text-3xl md:text-4xl font-extrabold text-[#0b2447] mt-4 mb-4">
            Especialistas de Referência em Neurologia e Sono
          </h2>
          <p className="text-slate-500 text-base">
            Médicos renomados, titulados e com mais de 32 anos de história cuidando da saúde do seu sono em Minas Gerais.
          </p>
        </div>
        
        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
          {doctors.map((doctor, index) => (
            <article 
              key={doctor.crm} 
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-100" 
              data-aos="fade-up" 
              data-aos-delay={index * 150}
            >
              {/* Doctor Photo Section */}
              <div className="relative w-full h-[290px] sm:h-[360px] overflow-hidden bg-slate-100">
                <Image 
                  src={doctor.imageUrl} 
                  alt={doctor.alt} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* CRM Badge */}
                <span className="absolute top-4 left-4 z-20 bg-slate-900/85 backdrop-blur-sm text-white px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                  {doctor.crm}
                </span>
              </div>
              
              {/* Doctor Details Section */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-extrabold text-[#0b2447] mb-1 tracking-tight">
                  {doctor.name}
                </h3>
                
                {/* Specialty Pill */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-extrabold text-[#2563eb] bg-blue-50/80 border border-blue-100 rounded-full">
                    {doctor.specialty}
                  </span>
                </div>
                
                {/* Biography */}
                <p className="text-sm text-slate-500 leading-relaxed mb-4 sm:mb-6 flex-grow">
                  {doctor.bio}
                </p>
                
                {/* Core Focus Pills */}
                <div className="border-t border-slate-100 pt-4 mb-4 sm:mb-6">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                    Focos de Atendimento
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.focus.map((item) => (
                      <span 
                        key={item} 
                        className="text-xs px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md font-medium border border-slate-100/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* CTA Booking Button */}
                <a 
                  href={doctor.wppLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Agendar consulta com ${doctor.name} pelo WhatsApp`}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebc57] text-white border border-transparent font-bold rounded-xl text-center text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md hover:scale-[1.01]"
                >
                  <WhatsAppIcon 
                    className="h-4 w-4" 
                  />
                  <span>Agendar Consulta</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
