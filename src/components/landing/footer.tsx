import Image from 'next/image';
import { HelpCircle, Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { config } from '@/lib/config';

// Crédito do desenvolvedor (troque DEV_URL pelo link do site da agência)
const DEV_URL = 'https://www.topmarketingbh.com.br';

function DevCredit() {
  const content = (
    <>
      <span>Desenvolvido por</span>
      <Image src="/images/top-marketing-bh.webp" alt="" width={22} height={22} className="dev-credit-logo" />
      <strong>Top Marketing BH</strong>
    </>
  );
  return DEV_URL
    ? <a className="dev-credit" href={DEV_URL} target="_blank" rel="noopener" aria-label="Desenvolvido por Top Marketing BH">{content}</a>
    : <span className="dev-credit">{content}</span>;
}

export default function Footer() {
  const whatsapp = `https://wa.me/${config.whatsappNumber}`;
  return (
    <footer className="clinic-footer">
      <div className="clinic-footer-inner">
        <a href="#" className="clinic-footer-brand" aria-label="Instituto do Sono, início"><Image src="/images/logo-instituto-do-sono.png" alt="Instituto do Sono de Minas Gerais" width={180} height={50} /></a>
        <div className="clinic-footer-grid">
          <nav aria-label="Institucional"><h3>Institucional</h3><a href="/#clinica">Nossa clínica</a><a href="/#corpo-clinico">Corpo clínico</a><a href="/#localizacao">Nossa unidade</a><a href="/contato/">Fale conosco</a><a href="/contato/#privacidade">Privacidade</a></nav>
          <nav aria-label="Para pacientes"><h3>Para pacientes</h3><a href="/#servicos">Nossos exames</a><a href="/#servicos">Polissonografia</a><a href="/#servicos">Eletroencefalograma (EEG)</a><a href={config.whatsappLinkUrgent} target="_blank" rel="noopener noreferrer">Exames em domicílio</a><a href="/#faq">Convênios</a></nav>
          <nav aria-label="Atendimento"><h3>Atendimento</h3><a href="/contato/">Fale conosco</a><a href="/blog/">Blog</a><a href="/onde-atendemos/">Onde atendemos</a><a href="/#faq">Perguntas frequentes</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">Agendar atendimento</a><a href={`mailto:${config.email}`}>Envie um e-mail</a><a href="/#localizacao">Como chegar</a></nav>
          <div className="clinic-footer-contact">
            <div><strong><HelpCircle size={22} />Você tem dúvidas?</strong><p>Acesse nossas <a href="/#faq">perguntas frequentes</a>.</p></div>
            <div><strong><MessageCircle size={22} />Quer entrar em contato?</strong><p>Fale no WhatsApp: <a href={whatsapp} target="_blank" rel="noopener noreferrer">{config.phoneNumber}</a></p></div>
            <div><strong><Phone size={22} />Prefere ligar?</strong><p>Belo Horizonte: <a href={`tel:+${config.whatsappNumber}`}>{config.phoneNumber}</a></p></div>
          </div>
        </div>
        <div className="clinic-footer-top"><a href="#">Voltar ao topo <ArrowUp size={15} /></a></div>
      </div>
      <div className="clinic-footer-bottom"><div><span>© {new Date().getFullYear()} Instituto do Sono de Minas Gerais.</span><DevCredit /></div></div>
    </footer>
  );
}
