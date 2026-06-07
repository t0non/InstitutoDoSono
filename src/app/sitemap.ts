import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Substitua a URL base pela URL real de produção da clínica
  const baseUrl = 'https://www.institutodosonobh.com.br'; 

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Adicione outras rotas aqui se houver múltiplas páginas no futuro
  ];
}
