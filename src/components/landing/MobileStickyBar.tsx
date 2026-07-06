'use client';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from '../icons';
import { config } from '@/lib/config';
import { useWhatsAppLinks } from '@/hooks/useWhatsAppLinks';

export default function MobileStickyBar() {
  const { whatsappLink } = useWhatsAppLinks();
  // Remove non-numeric characters for the tel link
  const phoneNumber = config.phoneNumber.replace(/\D/g, '');

  return (
    <div className="mobile-sticky-bar">
      <a href={`tel:${phoneNumber}`} className="btn-mobile btn-call">
        <Phone size={18} /> Ligar
      </a>
      <a href={whatsappLink} className="btn-mobile btn-wpp" target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="h-5 w-5 fill-white" /> WhatsApp
      </a>
    </div>
  );
}

    