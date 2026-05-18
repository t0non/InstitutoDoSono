export default function Insurance() {
  const logos = [
    'UNIMED', 'BRADESCO', 'SULAMÉRICA', 'AMIL', 'IPSEMG', 'CEMIG'
  ];

  return (
    <section className="py-10 bg-blue-50/30 border-b border-blue-100/50">
      <div className="container mx-auto px-5 text-center">
        <h3 className="text-lg opacity-85 mb-5 font-bold text-[#0b2447]">Atendemos Particular e Convênios</h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
          {logos.map(logo => (
            <div key={logo} className="text-2xl font-extrabold text-[#2563eb] select-none cursor-default">
              {logo}
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 text-[#0b2447]/50">*Consulte cobertura para o seu plano no WhatsApp.</p>
      </div>
    </section>
  );
}

    