'use client';
import React from 'react';
import Image from 'next/image';
import { useWhatsAppLinks } from '@/hooks/useWhatsAppLinks';
import { WhatsAppIcon } from '../icons';

const doctors = [
  {
    name: 'Dr. Welser Machado',
    specialty: 'Neurologista e Médico do Sono',
    bio: 'Pioneiro e referência em medicina do sono em Minas Gerais. Mais de 30 anos de atuação especializada no diagnóstico e tratamento de distúrbios neurológicos e respiratórios do sono.',
    imageUrl: '/images/medico-welser.webp',
    imageClass: 'object-cover object-center',
    crm: 'CRM 5623',
    focus: ['Polissonografia', 'Apneia do Sono', 'Insônia', 'Ronco e Roncopatia'],
    customMessage: 'gostaria de agendar uma consulta com o Dr. Welser Machado.',
    alt: 'Dr. Welser Machado - Neurologista e Especialista em Medicina do Sono em MG',
  },
  {
    name: 'Dra. Andrea Julião',
    specialty: 'Epileptologista e Neurofisiologista',
    bio: 'Mestre em Neurofisiologia pela UFMG. Especialista com ampla trajetória em epilepsia refratária, eletroencefalograma de alta resolução e acompanhamento especializado adulto e pediátrico.',
    imageUrl: '/images/medico-andrea.webp',
    imageClass: 'object-cover object-top',
    crm: 'CRM 32374',
    focus: ['Epilepsia Geral e Infantil', 'Eletroencefalograma (EEG)', 'Mapeamento Cerebral', 'Neurofisiologia Clínica'],
    customMessage: 'gostaria de agendar uma consulta com a Dra. Andrea Julião.',
    alt: 'Dra. Andrea Julião - Especialista em Epilepsia e Neurofisiologia em MG',
  },
  {
    name: 'Dra. Aila Fonseca',
    specialty: 'Psicóloga e Neuropsicóloga',
    bio: 'Neuropsicóloga no NATE do Hospital Felício Rocho e Mestra pela UFMG. Especialista com treinamento internacional (França) em Mapeamento Funcional do Cérebro para Neurocirurgia Oncológica.',
    imageUrl: '/images/medico-aila.webp',
    imageClass: 'object-cover object-center',
    crm: 'Neuropsicologia',
    focus: ['Avaliação Neuropsicológica', 'Mapeamento Funcional do Cérebro', 'Psicologia Hospitalar', 'Epilepsias'],
    customMessage: 'gostaria de agendar uma consulta com a Dra. Aila Fonseca.',
    alt: 'Dra. Aila Fonseca - Psicóloga e Neuropsicóloga em MG',
  },
];

export default function Doctors() {
  const { generateCustomLink } = useWhatsAppLinks();

  return (
    <section id="corpo-clinico" aria-labelledby="doctors-title" className="doctors-section">
      <div className="container">
        <div className="doctors-heading" data-aos="fade-up">
          <span className="doctors-kicker">Corpo Clínico</span>
          <h2 id="doctors-title">Especialistas de Referência em Neurologia e Sono</h2>
          <p>Médicos renomados, titulados e com mais de 32 anos de história cuidando da saúde do seu sono em Minas Gerais.</p>
        </div>

        <div className="doctors-grid">
          {doctors.map((doctor, index) => (
            <article key={doctor.crm} className="doctor-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="doctor-photo">
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-center"
                />
                <span className="doctor-reg">{doctor.crm}</span>
              </div>

              <div className="doctor-body">
                <p className="doctor-meta">{doctor.specialty}</p>
                <h3>{doctor.name}</h3>
                <p className="doctor-bio">{doctor.bio}</p>

                <ul className="doctor-focus" aria-label={`Focos de atendimento de ${doctor.name}`}>
                  {doctor.focus.map((item) => <li key={item}>{item}</li>)}
                </ul>

                <a
                  href={generateCustomLink(doctor.customMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Agendar consulta com ${doctor.name} pelo WhatsApp`}
                  className="doctor-cta"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Agendar consulta</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
