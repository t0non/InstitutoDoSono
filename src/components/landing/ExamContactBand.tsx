import { config } from '@/lib/config';

export default function ExamContactBand() {
  const href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Estou com um pedido de exames e gostaria de confirmar disponibilidade, preparo e formas de atendimento.')}`;
  return (
    <section className="exam-contact-band" aria-labelledby="exam-contact-title">
      <div className="site-content-width">
        <div>
          <h2 id="exam-contact-title">Está com um pedido de exames?</h2>
          <p>Fale com a equipe para confirmar a disponibilidade, o preparo e o atendimento por convênio ou particular.</p>
        </div>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <span className="wpp-icon-mask" aria-hidden="true" />
          Tirar dúvidas no WhatsApp
        </a>
      </div>
    </section>
  );
}
