import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Instituto do Sono MG | Polissonografia e Neurologia em Belo Horizonte',
  description: 'Clínica especializada em distúrbios do sono em Belo Horizonte - MG. Realizamos exames de Polissonografia clínica e domiciliar, Eletroencefalograma (EEG) e tratamentos para apneia e ronco.',
  keywords: ['polissonografia belo horizonte', 'clinica do sono bh', 'exame do sono belo horizonte', 'eletroencefalograma bh', 'neurologista especialista em sono bh', 'tratamento de apneia bh', 'polissonografia domiciliar bh', 'instituto do sono belo horizonte', 'medicina do sono mg'],
  openGraph: {
    title: 'Instituto do Sono MG | Polissonografia e Neurologia em Belo Horizonte',
    description: 'Clínica especializada em distúrbios do sono em Belo Horizonte - MG. Diagnósticos de alta precisão com Polissonografia e EEG.',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '8ngk8qE99iwcOEMSux4Tts0Ws6w9UYbmZLx6DSTPAPU',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clinicSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Instituto do Sono de Minas Gerais",
    "alternateName": "Instituto do Sono MG",
    "description": "Clínica de referência em medicina do sono e neurologia em Belo Horizonte. Realização de exames de Polissonografia (clínica e domiciliar), Eletroencefalograma (EEG) e tratamento de apneia.",
    "medicalSpecialty": ["Neurology", "SleepMedicine"],
    "knowsAbout": [
      "Consultas Neurológicas",
      "Distúrbios do Sono",
      "Ronco",
      "Enxaqueca",
      "Epilepsias",
      "Potenciais Evocados P300",
      "BERA",
      "Potencial Evocado Visual",
      "Eletroretinografia",
      "Potencial Evocado Gênito Cortical",
      "Somato Sensitivo MMII e MMSS",
      "Eletroencefalografia EEG",
      "EEG Quantitativo com Mapeamento Cerebral",
      "Poligrafia Neonatal",
      "Polissonografia",
      "Vídeo-Eletroencefalografia VEEG"
    ],
    "telephone": "+553191294704",
    "email": "sac@institutodosonobh.com.br",
    "url": "https://www.institutodosonobh.com.br",
    "logo": "https://www.institutodosonobh.com.br/images/logo-instituto-do-sono.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua dos Aimorés, 3018 - Sala 704 - Barro Preto",
      "addressLocality": "Belo Horizonte",
      "addressRegion": "MG",
      "postalCode": "30140-073",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-19.924304",
      "longitude": "-43.949363"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "20:00",
        "closes": "07:00"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quais convênios vocês aceitam?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Atendemos os principais planos como Unimed, Bradesco, SulAmérica, Amil, IPSM, Cassi, entre outros. Envie uma foto da sua carteirinha no WhatsApp e nossa equipe verifica a cobertura na hora para você."
        }
      },
      {
        "@type": "Question",
        "name": "O exame do sono pode ser feito em casa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Levamos o equipamento até sua residência, instalamos e buscamos no dia seguinte. É a opção ideal para idosos, pessoas com mobilidade reduzida ou para quem quer mais conforto no próprio colchão."
        }
      },
      {
        "@type": "Question",
        "name": "Preciso de pedido médico para agendar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Para exames via convênio o pedido médico é obrigatório. Para exames particulares, não necessariamente. Caso você não possua pedido, pode agendar uma consulta inicial com nossos especialistas (Neurologista ou Médico do Sono)."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês emitem nota para reembolso?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim. Se o seu convênio não for credenciado conosco, você pode realizar o atendimento particular e nós emitimos toda a documentação necessária para você solicitar o reembolso ao seu plano de saúde."
        }
      },
      {
        "@type": "Question",
        "name": "O exame em crianças dói ou incomoda?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fique tranquilo(a). Todos os nossos exames (Polissonografia, EEG) são totalmente indolores e não invasivos (sem agulhas). Nossa equipe é altamente treinada e acolhedora com o público infantil."
        }
      }
    ]
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YJVTYKS3TH" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YJVTYKS3TH');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Script
          id="clinic-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
