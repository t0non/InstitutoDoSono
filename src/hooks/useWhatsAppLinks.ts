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
      // Forçado para falso para manter sempre o fluxo orgânico
      const isAds = false;

      if (isAds) {
        setState({
          whatsappLink: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
          whatsappLinkInfo: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
          whatsappLinkConsulta: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
          whatsappLinkUrgent: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
          whatsappLinkInstagram: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
          isGoogleAds: true,
        });
      }
    }
  }, []);

  const generateCustomLink = useCallback((customMessage: string) => {
    if (state.isGoogleAds) {
      return `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`;
    }
    const finalMessage = `Olá! Vim do site e ${customMessage}`;
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(finalMessage)}`;
  }, [state.isGoogleAds]);

  return {
    ...state,
    generateCustomLink
  };
}
