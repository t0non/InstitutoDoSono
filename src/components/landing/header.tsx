'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { WhatsAppIcon } from '../icons';
import { config } from '@/lib/config';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Vim pelo site do Instituto do Sono e gostaria de informações sobre o atendimento.')}`;
  return (
    <header className="institute-header">
      <div className="institute-header-inner">
        <Link href="/" className="institute-brand" aria-label="Instituto do Sono, início" onClick={() => setMenuOpen(false)}>
          <Image src="/images/logo-instituto-do-sono.png" alt="Instituto do Sono MG" width={160} height={43} priority />
        </Link>
        <nav className="institute-desktop-nav" aria-label="Navegação principal">
          <a href="/#clinica">A Clínica</a>
          <details><summary>Exames</summary><div>
            <a href="/#servicos">Conheça nossos exames</a>
            <a href={config.whatsappLinkUrgent} target="_blank" rel="noopener noreferrer">Exame domiciliar</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Preparo para exames</a>
          </div></details>
          <a href="/#corpo-clinico">Corpo Clínico</a>
          <a href="/#localizacao">Unidade</a>
          <details><summary>Ajuda</summary><div>
            <a href="/#faq">Perguntas frequentes</a>
            <a href="/#localizacao">Como chegar</a>
            <a href="/contato/">Fale conosco</a><a href="/blog/">Blog</a><a href="/onde-atendemos/">Onde atendemos</a>
          </div></details>
        </nav>
        <div className="institute-header-actions">
          <a className="institute-header-contact" href={whatsappLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-4 w-4" aria-hidden="true" />Falar no WhatsApp</a>
          <button className="institute-menu-toggle" type="button" aria-controls="institute-mobile-nav" aria-expanded={menuOpen} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <nav id="institute-mobile-nav" className="institute-mobile-nav" aria-label="Menu móvel" hidden={!menuOpen} onClick={() => setMenuOpen(false)}>
        <a href="/#clinica">A Clínica</a><a href="/#servicos">Exames</a><a href="/#corpo-clinico">Corpo Clínico</a><a href="/#localizacao">Nossa unidade</a><a href="/#faq">Perguntas frequentes</a><a href="/contato/">Fale conosco</a><a href="/blog/">Blog</a><a href="/onde-atendemos/">Onde atendemos</a>
        <a className="institute-header-contact" href={whatsappLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-4 w-4" aria-hidden="true" />Falar no WhatsApp</a>
      </nav>
    </header>
  );
}
