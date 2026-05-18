'use client';
import React from 'react';
import { Users, Stethoscope, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

export default function TrustSection() {
  return (
    <section className="py-20 bg-[#07162c] text-white relative overflow-hidden border-t border-b border-white/5">
      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#3b82f6]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#2563eb]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-5 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#3b82f6]/10 text-[#3b82f6] uppercase tracking-wider mb-4 border border-[#3b82f6]/20">
            <ShieldCheck size={14} /> Segurança, Precisão e Agilidade Diagnóstica
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Referência Técnica em Diagnósticos Neurológicos de Alta Complexidade
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Unimos a mais alta tecnologia de neurofisiologia clínica ao atendimento humanizado para acolher desde recém-nascidos a idosos de Belo Horizonte e toda a região metropolitana.
          </p>
        </div>

        {/* 3-Column Structured Copy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Column 1: Patients & Families */}
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl hover:border-[#3b82f6]/30 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
            <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Acolhimento para Pacientes e Famílias
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Oferecemos suporte diagnóstico completo para <strong>adultos (25 a 70 anos)</strong>, crianças e adolescentes, com especialidade no cuidado de bebês desde o <strong>período neonatal</strong>.
            </p>
            <ul className="text-slate-400 text-xs sm:text-sm space-y-2 mb-4">
              <li className="flex items-center gap-2">✓ Exames 100% indolores e não invasivos</li>
              <li className="flex items-center gap-2">✓ Atendimento humanizado e acolhedor</li>
              <li className="flex items-center gap-2">✓ Infraestrutura de alto padrão e conforto</li>
              <li className="flex items-center gap-2">✓ Laudos aceitos para fins clínicos e judiciais</li>
            </ul>
            <p className="text-xs text-[#3b82f6] font-medium">
              *Atendimento Particular e por Convênios Médicos
            </p>
          </div>

          {/* Column 2: Referrals & Doctors */}
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl hover:border-[#3b82f6]/30 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
            <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] mb-6">
              <Stethoscope size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Origem dos Encaminhamentos de Confiança
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Somos o principal parceiro estratégico de <strong>neurologistas, neuropediatras, pediatras, neonatologistas, psiquiatras e clínicos gerais</strong> da região de MG.
            </p>
            <ul className="text-slate-400 text-xs sm:text-sm space-y-2">
              <li className="flex items-center gap-2">✓ Diagnósticos seguros e cientificamente robustos</li>
              <li className="flex items-center gap-2">✓ Laudos técnicos detalhados e integrados</li>
              <li className="flex items-center gap-2">✓ Suporte especializado para UTIs Neonatais</li>
              <li className="flex items-center gap-2">✓ Parceria com Hospitais e Maternidades</li>
            </ul>
          </div>

          {/* Column 3: Regional Coverage */}
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl hover:border-[#3b82f6]/30 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
            <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Cobertura Regional Ampliada
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Atendemos de forma integrada a pacientes de <strong>Belo Horizonte, região metropolitana e municípios vizinhos</strong> em Minas Gerais.
            </p>
            <ul className="text-slate-400 text-xs sm:text-sm space-y-2">
              <li className="flex items-center gap-2">✓ Agendamento ágil para quem viaja</li>
              <li className="flex items-center gap-2">✓ Localização nobre no bairro Barro Preto (BH)</li>
              <li className="flex items-center gap-2">✓ Facilidade de acesso por vias principais</li>
              <li className="flex items-center gap-2">✓ Flexibilidade de datas e horários</li>
            </ul>
          </div>

        </div>

        {/* High Complexity Exams Summary Box */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md" data-aos="fade-up">
          <h3 className="text-lg sm:text-xl font-extrabold text-white mb-6 text-center">
            Exames de Alta Complexidade e Rigor Clínico Realizados em Nossa Clínica
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'EEG de Rotina',
              'EEG Quantitativo',
              'Mapeamento Cerebral',
              'Vídeo-EEG (VEEG)',
              'Poligrafia Neonatal',
              'Polissonografia Tipo 1 e Tipo 2',
              'Potenciais Evocados P300',
              'Potencial Evocado Auditivo (BERA)',
              'Potencial Evocado Visual',
              'Eletroretinografia',
              'Gênito-Cortical',
              'Somato-Sensitivo MMII e MMSS',
              'Laudos Rápidos e Precisos',
              'Validade Hospitalar e Judicial'
            ].map((examName) => (
              <span 
                key={examName}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]/30 transition-all select-none cursor-default"
              >
                <CheckCircle size={14} className="text-[#3b82f6]" /> {examName}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-8 border-t border-white/5">
            <a 
              href={config.whatsappLink} 
              className="btn w-full sm:w-[280px] h-[56px] bg-[#3b82f6] hover:bg-[#2563eb] text-white border-none transition-all duration-300 flex items-center justify-center font-bold"
            >
              <WhatsAppIcon className="h-5 w-5 mr-2" /> Agende Conforme Encaminhamento
            </a>
            <p className="text-slate-400 text-xs sm:text-sm text-center">
              Tem uma solicitação médica ou encaminhamento de hospital? Nosso agendamento via WhatsApp é imediato!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
