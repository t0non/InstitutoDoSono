


import { config } from '@/lib/config';

export default function Location() {

  return (
    <section id="localizacao" aria-labelledby="location-title" className="clinic-location">
      <h2 id="location-title" className="clinic-location-title">Como chegar</h2>
      <div className="clinic-location-inner">
        <div className="clinic-location-copy">

          <p className="clinic-location-intro">Encontre o Instituto do Sono e consulte as informações para sua visita.</p>
          <dl>
            <div><dt>Localização</dt><dd>Belo Horizonte / MG<br />{config.address}</dd></div>
            <div><dt>Horário de atendimento</dt><dd>Segunda a sexta: 08h às 18h<br />Sábado (exames noturnos): 20h às 07h</dd></div>
          </dl>
          <div className="clinic-location-actions">
            <a className="clinic-location-button" href={config.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">Como chegar</a>
            <a className="clinic-location-button clinic-location-outline" href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer"><span className="wpp-icon-mask" aria-hidden="true" />Falar com a equipe</a>
          </div>
        </div>
        <div className="clinic-location-map">
          <iframe src={config.googleMapsEmbedUrl} title="Mapa de localização do Instituto do Sono em Belo Horizonte" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  );
}
