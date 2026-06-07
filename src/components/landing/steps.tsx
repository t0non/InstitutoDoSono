'use client';
import React from 'react';
import { Brain, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../icons';

export default function Steps() {
  return (
    <section className="steps-section" style={{ padding: '40px 0' }}>
      <div className="container">
        <h2 style={{ color: 'white', marginBottom: '4px', fontSize: '1.75rem' }}>Como funciona?</h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '24px' }}>Sem burocracia. Cuidamos de tudo para você.</p>
        
        <div className="steps-grid" style={{ marginTop: '24px', gap: '20px' }}>
          {/* Passo 1: WhatsApp */}
          <div className="step-item">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <WhatsAppIcon className="h-6 w-6" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Chame no WhatsApp</h4>
          </div>

          {/* Passo 2: Cérebro (Exame) */}
          <div className="step-item">
            <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(56,189,248,0.15)] text-sky-400">
              <Brain className="h-6 w-6" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Realize o Exame</h4>
          </div>

          {/* Passo 3: Certinho em Verde (Laudo/Resolvido) */}
          <div className="step-item">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Receba o Laudo</h4>
          </div>
        </div>
      </div>
    </section>
  );
}
