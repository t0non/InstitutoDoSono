import { MapPin, Route } from 'lucide-react';
import { config } from '@/lib/config';

export default function Location() {
  return (
    <section id="localizacao" className="py-20 bg-gray-50 text-center">
      <div className="container">
        <h2 className="text-3xl font-bold mb-2">Onde nos encontrar</h2>
        <div className="flex justify-center items-center gap-2 text-slate-600 mb-4">
            <MapPin size={16} />
            <a href="https://maps.app.goo.gl/u5aYm5Jd6eQ4gNq39" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{config.address}</a>
        </div>
        <a 
          href={config.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mb-8"
          style={{padding: '10px 24px', fontSize: '0.9rem'}}
        >
          <Route size={18} />
          Calcular Rota
        </a>
        <div className="rounded-2xl overflow-hidden shadow-2xl" data-aos="fade-up">
          <iframe
            src={config.googleMapsEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
