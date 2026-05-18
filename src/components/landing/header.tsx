import Link from 'next/link';
import { config } from '@/lib/config';
import { WhatsAppIcon } from '../icons';
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <div className="navbar">
        <Link href="#" className="logo">
          <Image 
            src="/images/logo-instituto-do-sono.png" 
            alt="Instituto do Sono MG Logo" 
            width={140}
            height={37}
            style={{ objectFit: 'contain' }}
          />
        </Link>
        
        {/* Navigation Links in Center */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-sm font-bold text-[#0b2447] hover:text-[#2563eb] transition-colors uppercase tracking-wider">
            Início
          </a>
          <a href="#clinica" className="text-sm font-bold text-[#0b2447] hover:text-[#2563eb] transition-colors uppercase tracking-wider">
            A Clínica
          </a>
          <a href="#servicos" className="text-sm font-bold text-[#0b2447] hover:text-[#2563eb] transition-colors uppercase tracking-wider">
            Exames
          </a>
          <a href="#corpo-clinico" className="text-sm font-bold text-[#0b2447] hover:text-[#2563eb] transition-colors uppercase tracking-wider">
            Corpo Clínico
          </a>
          <a href="#localizacao" className="text-sm font-bold text-[#0b2447] hover:text-[#2563eb] transition-colors uppercase tracking-wider">
            Localização
          </a>
        </nav>

        <a href={config.whatsappLink} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
          <WhatsAppIcon className="h-5 w-5 fill-white" /> Agendar Agora
        </a>
      </div>
    </header>
  );
}
