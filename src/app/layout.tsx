import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Clínica do Sono em BH | Polissonografia e EEG',
  description: 'Polissonografia clínica e domiciliar, EEG e atendimento especializado em medicina do sono no Barro Preto, BH. Mais de 30 anos de experiência. Agende seu exame.',
  keywords: ['polissonografia belo horizonte', 'clinica do sono bh', 'exame do sono belo horizonte', 'eletroencefalograma bh', 'neurologista especialista em sono bh', 'tratamento de apneia bh', 'polissonografia domiciliar bh', 'instituto do sono belo horizonte', 'medicina do sono mg'],
  openGraph: {
    title: 'Clínica do Sono em BH | Polissonografia e EEG',
    description: 'Polissonografia clínica e domiciliar, EEG e atendimento especializado em medicina do sono no Barro Preto, BH. Mais de 30 anos de experiência. Agende seu exame.',
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
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M2CC78HT');
          `}
        </Script>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SCMS4QGP25" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SCMS4QGP25');
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
    (function(window, document, script) {
        if (!window.tt) {
            window.tt = window.tt || {};

            var c = document.getElementsByTagName('head')[0];
            var k = document.createElement('script');
            k.async = 1;
            k.src = script;
            c.appendChild(k);
        }

        window.tt.accountCode = '5c1bae77-1340-481b-9d52-87c8681c5cda';

    })(window, document, '//s.tintim.app/static/core/tintim-1.0.js');
`
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-M2CC78HT"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <Toaster />
        <a href="https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', zIndex: 9999, right: '20px', bottom: '20px', width: '64px', height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#00AD57', borderRadius: '100%' }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" width="32" height="32"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg></a>
      </body>
    </html>
  );
}
