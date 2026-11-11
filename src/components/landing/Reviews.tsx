'use client';
import { ChevronLeft, ChevronRight, Star, CircleCheck } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
const reviews = [
  {
    name: 'Carlos Silva',
    text: 'Atendimento sensacional, desde o WhatsApp. O Dr. Welser é um gênio da neurofisiologia: gentil, simpático e com um conhecimento fora da curva. Equipe padrão ouro!',
    time: 'Há uma semana',
    initial: 'C',
    bgColor: 'bg-emerald-600'
  },
  {
    name: 'Mariana Costa',
    text: 'O exame domiciliar foi a salvação! Cuidar da minha mãe acamada ficou muito mais fácil com a equipe vindo até nós. Profissionalismo e carinho definem o serviço.',
    time: 'Há 2 semanas',
    initial: 'M',
    bgColor: 'bg-blue-600'
  },
  {
    name: 'Roberto Almeida',
    text: 'Finalmente uma noite de sono sem interrupções! A Dra. Andrea ajustou meu CPAP com uma paciência que eu nunca tinha visto. Recomendo de olhos fechados.',
    time: 'Há 3 semanas',
    initial: 'R',
    bgColor: 'bg-orange-600'
  },
  {
    name: 'Fernanda Lima',
    text: 'Meu filho fazia acompanhamento com a Dra. Andrea. A atenção e o cuidado dela com as crianças é algo que conforta qualquer coração de mãe. Só gratidão.',
    time: 'Há um mês',
    initial: 'F',
    bgColor: 'bg-purple-600'
  },
  {
    name: 'Lucas Pereira',
    text: 'Processo rápido e sem burocracia. Agendei pelo WhatsApp, enviei os documentos e no dia seguinte já estava com o exame marcado. Impressionado com a eficiência.',
    time: 'Há um mês',
    initial: 'L',
    bgColor: 'bg-cyan-600'
  },
  {
    name: 'Juliana Santos',
    text: 'Excelente atendimento. Dr. Welser foi muito atencioso com meu pai, tirou todas as dúvidas. A clínica é muito bem estruturada. Nos sentimos seguros.',
    time: 'Há 2 meses',
    initial: 'J',
    bgColor: 'bg-pink-600'
  },
];
export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop:true, align:'start' });
  return (
    <section id="avaliacoes" className="clinic-reviews" aria-labelledby="reviews-title">
      <div className="clinic-reviews-inner">
        <h2 id="reviews-title">O que <strong>nossos pacientes dizem</strong></h2>
        <div className="clinic-reviews-carousel">
          <button type="button" className="clinic-review-arrow clinic-review-prev" onClick={() => emblaApi?.scrollPrev()} aria-label="Depoimento anterior"><ChevronLeft size={20} /></button>
          <div className="clinic-reviews-viewport" ref={emblaRef}>
            <div className="clinic-reviews-track">
              {reviews.map(review => <div className="clinic-review-slide" key={review.name}>
                <article className="clinic-review-card">
                  <div className="clinic-review-person">
                    <span className={`clinic-review-avatar ${review.bgColor}`}>{review.initial}</span>
                    <h3>{review.name}</h3>
                    <span className="clinic-review-google" aria-label="Google"><svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg></span>
                  </div>
                  <div className="clinic-review-rating" aria-label="5 de 5 estrelas">
                    {[0,1,2,3,4].map(star => <Star key={star} size={15} fill="currentColor" strokeWidth={0} />)}
                    <CircleCheck className="clinic-review-verified" size={16} fill="#07457D" stroke="white" strokeWidth={2.5} aria-label="Verificado" role="img" />
                  </div>
                  <p>{review.text}</p>
                </article>
              </div>)}
            </div>
          </div>
          <button type="button" className="clinic-review-arrow clinic-review-next" onClick={() => emblaApi?.scrollNext()} aria-label="Próximo depoimento"><ChevronRight size={20} /></button>
        </div>
        <a className="clinic-reviews-link" href="https://maps.app.goo.gl/u5aYm5Jd6eQ4gNq39" target="_blank" rel="noopener noreferrer">Encontrar o Instituto do Sono no Google Maps <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}