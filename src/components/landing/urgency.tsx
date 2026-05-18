import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';

export default function Urgency() {
  return (
    <div className="container">
      <div className="urgency-banner" data-aos="zoom-in">
        <h2>Não pode ir até a clínica?</h2>
        <p>Sabemos que deslocar pacientes acamados ou idosos é difícil. Nós levamos os equipamentos até sua casa ou hospital.</p>
        <a href={config.whatsappLinkUrgent} className="btn btn-white">
          <WhatsAppIcon className="h-5 w-5 mr-2" style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(80%) saturate(2466%) hue-rotate(216deg) brightness(97%) contrast(94%)' }} /> Solicitar Exame em Domicílio
        </a>
      </div>
    </div>
  );
}
