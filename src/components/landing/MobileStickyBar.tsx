'use client';
import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from '../icons';
import { config } from '@/lib/config';
import { useWhatsAppLinks } from '@/hooks/useWhatsAppLinks';

// Barra fixa do celular: só aparece depois que a pessoa passa da primeira seção (topo).
export default function MobileStickyBar() {
  const { whatsappLink } = useWhatsAppLinks();
  const phoneNumber = config.phoneNumber.replace(/\D/g, '');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero, .coverage-hero, .info-page-intro');
    const set = (v: boolean) => {
      setVisible(v);
      document.body.classList.toggle('after-hero', v);
    };
    if (!hero) {
      const onScroll = () => set(window.scrollY > 300);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
    const io = new IntersectionObserver(([e]) => set(!e.isIntersecting), { threshold: 0, rootMargin: '-64px 0px 0px 0px' });
    io.observe(hero);
    return () => { io.disconnect(); document.body.classList.remove('after-hero'); };
  }, []);

  return (
    <div className={`mobile-sticky-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <a href={`tel:+55${phoneNumber}`} className="btn-mobile btn-call" tabIndex={visible ? 0 : -1}>
        <Phone size={18} /> Ligar
      </a>
      <a href={whatsappLink} className="btn-mobile btn-wpp" target="_blank" rel="noopener noreferrer" tabIndex={visible ? 0 : -1}>
        <WhatsAppIcon className="h-5 w-5 fill-white" /> WhatsApp
      </a>
    </div>
  );
}
