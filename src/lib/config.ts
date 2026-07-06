export const config = {
  whatsappNumber: '553191294704',

  // Função auxiliar para identificar a origem (UTM ou Referrer) e ajustar o texto
  getTrafficSourceText(defaultText: string) {
    // Evita erros no Server-Side Rendering (SSR) do Next.js
    if (typeof window === 'undefined') return defaultText;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source')?.toLowerCase() || urlParams.get('origem')?.toLowerCase();
      
      let sourceName = '';
      
      if (utmSource) {
        if (utmSource.includes('google')) sourceName = 'Google';
        else if (utmSource.includes('instagram') || utmSource.includes('ig')) sourceName = 'Instagram';
        else if (utmSource.includes('facebook') || utmSource.includes('fb')) sourceName = 'Facebook';
        else if (utmSource.includes('tiktok')) sourceName = 'TikTok';
        else sourceName = utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
      } else {
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes('google')) sourceName = 'Google';
        else if (referrer.includes('instagram')) sourceName = 'Instagram';
        else if (referrer.includes('facebook')) sourceName = 'Facebook';
      }

      if (sourceName) {
        // Ajusta a frase se já tiver "vim pelo site"
        if (defaultText.includes('vim pelo site')) {
          return defaultText.replace('vim pelo site', `vim pelo ${sourceName}`);
        }
        // Ajusta a frase padrão
        return `Olá, vim pelo ${sourceName} e ${defaultText.replace('Olá, ', '')}`;
      }
    } catch (e) {
      console.error('Erro ao ler a origem do tráfego', e);
    }

    return defaultText;
  },

  // Novo método para gerar qualquer link customizado mantendo a inteligência de UTM
  generateWhatsappLink(customMessage: string) {
    const text = this.getTrafficSourceText(customMessage);
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  get whatsappLink() {
    return this.generateWhatsappLink('Olá, gostaria de agendar um exame ou consulta.');
  },
  
  get whatsappLinkUrgent() {
    return this.generateWhatsappLink('Olá, preciso de atendimento domiciliar para exames.');
  },
  
  get whatsappLinkInfo() {
    return this.generateWhatsappLink('Olá, vim pelo site e gostaria de tirar algumas dúvidas.');
  },
  
  get whatsappLinkConsulta() {
    return this.generateWhatsappLink('Olá, gostaria de agendar um horário para consulta.');
  },
  
  get whatsappLinkInstagram() {
    return `https://wa.me/${this.whatsappNumber}?text=Olá,%20vim%20pelo%20Instagram%20e%20gostaria%20de%20agendar%20um%20horário.`;
  },
  
  phoneNumber: '(31) 9129-4704',
  email: 'sac@institutodosonobh.com.br',
  address: 'R. dos Aimorés, 3018 - Sala 704 - Barro Preto, Belo Horizonte - MG, 30140-073',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.803450953147!2d-43.94936382570535!3d-19.92430434836001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa699c155555555%3A0x86132891391f692!2sInstituto%20do%20Sono%20de%20Minas%20Gerais!5e0!3m2!1spt-BR!2sbr!4v1719505511226!5m2!1spt-BR!2sbr',
  
  get googleMapsDirectionsUrl() {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.address)}`;
  }
};