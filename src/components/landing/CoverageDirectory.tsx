'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { neighborhoods, neighborhoodSource } from '@/lib/bh-neighborhoods';
import { clinicServices } from '@/lib/clinic-services';
import { config } from '@/lib/config';

const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Serviços que se alternam entre os bairros (deixa o texto mais variado para o Google)
const rotation = [
  'Polissonografia',
  'Polissonografia Domiciliar',
  'Eletroencefalograma (EEG)',
  'Consulta Neurológica',
  'Exame do Sono',
  'Potenciais Evocados',
];

// Variações de texto para cada cartão
const descriptions: ((s: string, b: string) => string)[] = [
  (s, b) => `Mora em ${b}? Agende ${s.toLowerCase()} no Instituto do Sono, no Barro Preto, e confirme preparo, convênio e horários com a nossa equipe.`,
  (s, b) => `Pacientes de ${b} realizam ${s.toLowerCase()} com médicos especialistas em sono e neurologia. Informe o pedido médico e consulte a disponibilidade.`,
  (s, b) => `Precisa de ${s.toLowerCase()} perto de ${b}? Fale com o Instituto do Sono pelo WhatsApp e tire dúvidas sobre agendamento, preparo e atendimento.`,
  (s, b) => `Atendemos moradores de ${b} para ${s.toLowerCase()}. Envie seu pedido e confirme o atendimento por convênio ou particular.`,
];

export default function CoverageDirectory() {
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');
  const term = normalize(search.trim());
  const list = neighborhoods
    .map((name, index) => ({ name, index }))
    .filter(({ name }) => normalize(name).includes(term));

  return (
    <>
      <div className="coverage-filters">
        <label className="coverage-field">
          <span>Buscar bairro</span>
          <div className="coverage-search">
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Digite seu bairro" type="search" />
          </div>
        </label>
        <label className="coverage-field">
          <span>Serviço</span>
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">Todos os serviços</option>
            {clinicServices.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <p className="coverage-count" role="status">
          {list.length} {list.length === 1 ? 'bairro encontrado' : 'bairros encontrados'}
        </p>
      </div>

      <div className="coverage-list">
        {list.map(({ name, index }) => {
          const s = service || rotation[index % rotation.length];
          const text = descriptions[index % descriptions.length](s, name);
          const message = `Olá! Moro no bairro ${name}, em Belo Horizonte, e gostaria de agendar ${s.toLowerCase()}. Podem me informar disponibilidade e preparo?`;
          return (
            <article className="coverage-card" key={name}>
              <h2>
                <a href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
                  {s} em {name} | Clínica do Sono em Belo Horizonte-MG
                </a>
              </h2>
              <p>{text}</p>
            </article>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="coverage-empty">
          <h3>Não encontrou seu bairro?</h3>
          <p>Confira a grafia ou envie o endereço à equipe para consultar o atendimento.</p>
          <a className="clinic-location-button coverage-btn-wpp" href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
        </div>
      )}

      <p className="coverage-source">
        Lista de bairros: <a href={neighborhoodSource} target="_blank" rel="noopener noreferrer">Prefeitura de Belo Horizonte / Prodabel</a>, base de setembro de 2024. A disponibilidade de atendimento domiciliar é confirmada para cada endereço.
      </p>
    </>
  );
}
