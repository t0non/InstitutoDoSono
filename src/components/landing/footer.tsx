'use client';
import React from 'react';
import Image from 'next/image';
import { config } from '@/lib/config';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b2447] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          
          {/* Column 1: Brand & SEO Description */}
          <div className="flex flex-col gap-4">
            <div className="relative w-[150px] h-[40px]">
              <Image 
                src="/images/logo-instituto-do-sono.png" 
                alt="Instituto do Sono de Minas Gerais" 
                fill
                sizes="150px"
                unoptimized
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mt-2">
              Desde 1994, o Instituto do Sono de Minas Gerais é referência absoluta em medicina do sono e neurologia. Oferecemos exames especializados e diagnósticos de alta precisão em Belo Horizonte.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider mb-5 pb-2 border-b border-slate-800 inline-block">
              Links Rápidos
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  Início
                </a>
              </li>
              <li>
                <a href="#clinica" className="hover:text-white hover:underline transition-all">
                  A Clínica e Estrutura
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white hover:underline transition-all">
                  Exames e Serviços
                </a>
              </li>
              <li>
                <a href="#corpo-clinico" className="hover:text-white hover:underline transition-all">
                  Nosso Corpo Clínico
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white hover:underline transition-all">
                  Dúvidas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Exams & Specialties (SEO Keywords) */}
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider mb-5 pb-2 border-b border-slate-800 inline-block">
              Nossos Exames
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Polissonografia Laboratório (Tipo 1)
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Polissonografia Domiciliar (Tipo 2)
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Eletroencefalograma Clínico (EEG)
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Teste de Latências Múltiplas (TLMS)
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Ajuste e Titulação de CPAP / BiPAP
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Local SEO (NAP) */}
          <div>
            <h4 className="text-white text-base font-bold uppercase tracking-wider mb-5 pb-2 border-b border-slate-800 inline-block">
              Contato e Localização
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              
              {/* Address */}
              <li className="flex gap-2.5 items-start">
                <MapPin size={18} className="text-[#2563eb] flex-shrink-0 mt-0.5" />
                <a 
                  href="https://maps.app.goo.gl/u5aYm5Jd6eQ4gNq39" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  {config.address}
                </a>
              </li>

              {/* Phone */}
              <li className="flex gap-2.5 items-center">
                <Phone size={16} className="text-[#2563eb] flex-shrink-0" />
                <a href={`tel:${config.whatsappNumber}`} className="hover:text-white transition-colors">
                  {config.phoneNumber}
                </a>
              </li>

              {/* Email */}
              <li className="flex gap-2.5 items-center">
                <Mail size={16} className="text-[#2563eb] flex-shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">
                  {config.email}
                </a>
              </li>

              {/* Business Hours */}
              <li className="flex gap-2.5 items-start">
                <Clock size={16} className="text-[#2563eb] flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  Segunda a Sexta: 08h às 18h<br />
                  Sábado (Exames Noturnos): 20h às 07h
                </span>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Instituto do Sono de Minas Gerais. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400">CRM Clínico: MG 5623</span>
            <span>•</span>
            <span className="hover:text-slate-400">Diretor Técnico: Dr. Welser Machado</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
