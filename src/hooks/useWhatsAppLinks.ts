'use client';

import { useState, useEffect } from 'react';

const BASE_URL = 'https://wa.me/553191294704?text=';

interface WhatsAppLinks {
  whatsappLink: string;
  whatsappLinkInfo: string;
  whatsappLinkConsulta: string;
}

const DEFAULT_LINKS: WhatsAppLinks = {
  whatsappLink: `${BASE_URL}${encodeURIComponent('Olá! Vim do site e gostaria de agendar um exame ou consulta.')}`,
  whatsappLinkInfo: `${BASE_URL}${encodeURIComponent('Olá! Vim do site e gostaria de informações.')}`,
  whatsappLinkConsulta: `${BASE_URL}${encodeURIComponent('Olá! Vim do site e gostaria de agendar um horário.')}`,
};

const PAID_LINKS: WhatsAppLinks = {
  whatsappLink: `${BASE_URL}${encodeURIComponent('Olá! Vi o anúncio no Google e gostaria de agendar um exame ou consulta.')}`,
  whatsappLinkInfo: `${BASE_URL}${encodeURIComponent('Olá! Vi o anúncio no Google e gostaria de informações.')}`,
  whatsappLinkConsulta: `${BASE_URL}${encodeURIComponent('Olá! Vi o anúncio no Google e gostaria de agendar um horário.')}`,
};

export function useWhatsAppLinks() {
  const [links, setLinks] = useState<WhatsAppLinks>(DEFAULT_LINKS);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const gclid = urlParams.get('gclid');
      const utmSource = urlParams.get('utm_source')?.toLowerCase();

      // Condição de tráfego pago
      if (gclid || utmSource === 'google') {
        setLinks(PAID_LINKS);
      }
    } catch (e) {
      console.error('Erro ao ler a origem do tráfego para links do WhatsApp:', e);
    }
  }, []);

  return links;
}
