'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';

// Logos recortados (sem margem branca, fundo transparente) em /images/convenios.
// Largura/altura calculadas para que todos tenham o mesmo "peso" visual:
// mesma área aproximada, com leve ajuste para logos mais finos/vazados.
const insurances = [
  { name: 'AAG', src: '/images/convenios/aag.png', w: 130, h: 55 },
  { name: 'Amagis Saúde', src: '/images/convenios/amagis.png', w: 120, h: 40 },
  { name: 'Amil', src: '/images/convenios/amil.png', w: 121, h: 44 },
  { name: 'CASSI', src: '/images/convenios/cassi.png', w: 108, h: 54 },
  { name: 'CASU UFMG', src: '/images/convenios/casu.png', w: 130, h: 44 },
  { name: 'Fundação Libertas', src: '/images/convenios/libertas.png', w: 140, h: 35 },
  { name: 'Stellantis Saúde', src: '/images/convenios/stellantis.png', w: 164, h: 46 },
  { name: 'Unimed', src: '/images/convenios/unimed.png', w: 131, h: 43 },
  { name: 'Usisaúde', src: '/images/convenios/usisaude.png', w: 122, h: 54 },
];

export default function Insurance() {
  return (
    <section className="insurance-section">
      <div className="container mx-auto px-5 text-center">
        <h3 className="insurance-heading">Atendemos Particular e Convênios</h3>
        <div className="insurance-marquee">
          {[0, 1].map((copy) => (
            <div className="insurance-track-group" key={copy} aria-hidden={copy === 1}>
              {insurances.map((ins) => (
                <div
                  key={ins.name}
                  className="insurance-logo"
                  style={{ '--logo-w': ins.w, '--logo-h': ins.h } as CSSProperties}
                >
                  <Image
                    src={ins.src}
                    alt={`Logo ${ins.name}`}
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
