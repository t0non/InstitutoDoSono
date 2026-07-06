'use client';
import { useEffect, useState, useCallback } from 'react';
import { config } from '@/lib/config';

interface WhatsAppLinksState {
  whatsappLink: string;
  whatsappLinkInfo: string;
  whatsappLinkConsulta: string;
  whatsappLinkUrgent: string;
  whatsappLinkInstagram: string;
  isGoogleAds: boolean;
}

export function useWhatsAppLinks() {
  const [state, setState] = useState<WhatsAppLinksState>({
    whatsappLink: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vim do site e gostaria de agendar um exame ou consulta.')}`,
    whatsappLinkInfo: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vim do site e gostaria de informações.')}`,
    whatsappLinkConsulta: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vim do site e gostaria de agendar um horário.')}`,
    whatsappLinkUrgent: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Preciso de atendimento domiciliar')}`,
    whatsappLinkInstagram: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá, vim pelo Instagram e gostaria de agendar um horário.')}`,
    isGoogleAds: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isAds = urlParams.has('gclid') || urlParams.get('utm_source')?.toLowerCase() === 'google';

      if (isAds) {
        setState({
          whatsappLink: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vi o anúncio no Google e gostaria de agendar um exame ou consulta.')}`,
          whatsappLinkInfo: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vi o anúncio no Google e gostaria de informações.')}`,
          whatsappLinkConsulta: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vi o anúncio no Google e gostaria de agendar um horário.')}`,
          whatsappLinkUrgent: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Preciso de atendimento domiciliar')}`,
          whatsappLinkInstagram: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá, vim pelo Instagram e gostaria de agendar um horário.')}`,
          isGoogleAds: true,
        });
      }
    }
  }, []);

  const generateCustomLink = useCallback((customMessage: string) => {
    const prefix = state.isGoogleAds 
      ? 'Olá! Vi o anúncio no Google e ' 
      : 'Olá! Vim do site e ';
      
    const finalMessage = `${prefix}${customMessage}`;
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
  }, [state.isGoogleAds]);

  return {
    ...state,
    generateCustomLink
  };
}
