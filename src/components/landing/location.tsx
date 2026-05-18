import { MapPin, Route } from 'lucide-react';
import { config } from '@/lib/config';

export default function Location() {
  return (
    <section id="localizacao" aria-labelledby="location-title" className="py-12 md:py-20 bg-gray-50 text-center">
      <div className="container">
        <h2 id="location-title" className="text-3xl font-extrabold text-[#0b2447] mb-2">Onde nos encontrar</h2>
        <div className="flex justify-center items-center gap-2 text-slate-500 mb-4">
            <MapPin size={16} />
            <a href="https://maps.app.goo.gl/u5aYm5Jd6eQ4gNq39" target="_blank" rel="noopener noreferrer" aria-label="Abrir endereço da clínica no Google Maps" className="hover:text-[#2563eb] transition-colors">{config.address}</a>
        </div>
        <a 
          href={config.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Calcular rota de carro ou a pé para a Clínica pelo Google Maps"
          className="btn btn-primary mb-8"
          style={{padding: '10px 24px', fontSize: '0.9rem'}}
        >
          <Route size={18} />
          Calcular Rota
        </a>
        <div className="rounded-2xl overflow-hidden shadow-2xl" data-aos="fade-up">
          <iframe
            src={config.googleMapsEmbedUrl}
            title="Mapa interativo de localização do Instituto do Sono MG"
            className="w-full h-[280px] sm:h-[450px]"
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
