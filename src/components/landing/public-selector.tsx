'use client';
import { UserRound, Baby } from 'lucide-react';

export default function PublicSelector() {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  return (
    <div className="public-selector" data-aos="fade-up">
      <div className="selector-grid">
        <div className="selector-card" onClick={() => scrollTo('adultos')}>
            <UserRound className="icon" />
            <h3>Para Adultos e Idosos</h3>
            <p>Ronco, esquecimento, dores e insônia.</p>
        </div>
        <div className="selector-card" onClick={() => scrollTo('criancas')}>
            <Baby className="icon" />
            <h3>Para Crianças e Bebês</h3>
            <p>Desenvolvimento, autismo e convulsões.</p>
        </div>
      </div>
    </div>
  );
}
