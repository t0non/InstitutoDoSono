export const config = {
  whatsappNumber: '553191294704',
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber}?text=Olá,%20gostaria%20de%20agendar%20um%20exame%20ou%20consulta.`;
  },
  get whatsappLinkUrgent() {
    return `https://wa.me/${this.whatsappNumber}?text=Preciso%20de%20atendimento%20domiciliar`;
  },
  get whatsappLinkInfo() {
      return `https://wa.me/${this.whatsappNumber}?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20informações.`;
  },
  get whatsappLinkConsulta() {
    return `https://wa.me/${this.whatsappNumber}?text=Olá,%20gostaria%20de%20agendar%20um%20horário.`;
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