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
    whatsappLink: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
    whatsappLinkInfo: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
    whatsappLinkConsulta: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
    whatsappLinkUrgent: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
    whatsappLinkInstagram: `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`,
    isGoogleAds: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isAds = urlParams.has('gclid') || urlParams.get('utm_source')?.toLowerCase() === 'google';

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
    return `https://tintim.link/whatsapp/5c1bae77-1340-481b-9d52-87c8681c5cda/a44c94e1-fcf9-4c8a-aaa1-600afb46af77`;
  }, []);

  return {
    ...state,
    generateCustomLink
  };
}
