import type { Metadata } from 'next';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import MobileStickyBar from '@/components/landing/MobileStickyBar';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title:'Contato | Instituto do Sono em Belo Horizonte',
  description:'Fale com o Instituto do Sono em BH. Consulte endereço no Barro Preto, horários e agendamento de polissonografia e exames neurológicos.',
  alternates:{canonical:'https://www.institutodosonobh.com.br/contato/'},
};
export default function ContactPage() {
 const whatsapp = `https://wa.me/${config.whatsappNumber}`;
 return <><Header /><main className="info-page" id="conteudo">
  <div className="info-page-intro"><div className="info-page-container"><h1>Entre em contato</h1><p>Fale com a equipe do Instituto do Sono em Belo Horizonte.</p></div></div>
  <div className="info-page-container contact-page-columns">
    <section aria-labelledby="contact-channels-title"><h2 id="contact-channels-title">Como podemos ajudar?</h2><p>Consulte a disponibilidade e o preparo dos exames, confirme a cobertura do seu convênio ou tire dúvidas sobre polissonografia clínica e domiciliar.</p>
      <dl className="contact-facts"><div><dt>Telefone</dt><dd><a href={`tel:+${config.whatsappNumber}`}>{config.phoneNumber}</a></dd></div><div><dt>WhatsApp</dt><dd><a href={whatsapp} target="_blank" rel="noopener noreferrer">{config.phoneNumber}</a></dd></div><div><dt>E-mail</dt><dd><a href={`mailto:${config.email}`}>{config.email}</a></dd></div><div><dt>Horário de atendimento</dt><dd>Segunda a sexta: 08h às 18h<br />Sábado (exames noturnos): 20h às 07h</dd></div></dl>
      <div className="info-page-actions"><a className="clinic-location-button" href={whatsapp} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a><a className="clinic-location-button clinic-location-outline" href={`tel:+${config.whatsappNumber}`}>Ligar para a clínica</a></div>
    </section>
    <section aria-labelledby="contact-address-title"><h2 id="contact-address-title">Como chegar</h2><address>{config.address}</address><div className="clinic-location-map"><iframe src={config.googleMapsEmbedUrl} title="Instituto do Sono no Google Maps" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div><a className="info-page-link" href={config.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">Traçar rota no Google Maps →</a></section>
  </div>
  <section className="info-page-container contact-page-privacy" id="privacidade"><h2>Privacidade</h2><p>Para dúvidas sobre seus dados no atendimento, fale com a recepção pelos canais acima. Esta página não possui formulário para envio de pedidos médicos, senhas ou resultados.</p><h3>Uso do site</h3><p>O site utiliza Google Analytics e Google Tag Manager para medição de uso. Para informações sobre o tratamento dos seus dados ou solicitações relacionadas à privacidade, entre em contato pelo e-mail {config.email}.</p><h3>Serviços externos</h3><p>Os links de atendimento e de rota podem abrir o WhatsApp ou o Google Maps. Os mapas incorporados se conectam ao Google ao serem carregados.</p></section>
 </main><Footer /><MobileStickyBar /></>;
}
