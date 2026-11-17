'use client';
import { usePathname } from 'next/navigation';
import Tracker from './Tracker';
import EbookPopup from '@/components/landing/EbookPopup';
import PolissoPopup from '@/components/landing/PolissoPopup';

// Rastreamento + pop-up do e-book em todas as páginas do site (menos no painel admin)
export default function SiteExtras() {
  const pathname = usePathname() || '';
  if (pathname.startsWith('/admin')) return null;
  return (
    <>
      <Tracker />
      <EbookPopup />
      <PolissoPopup />
    </>
  );
}
