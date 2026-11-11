import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Substitua a URL base pela URL real de produção da clínica
  const baseUrl = 'https://www.institutodosonobh.com.br';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
