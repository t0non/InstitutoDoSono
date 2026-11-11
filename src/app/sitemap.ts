import { MetadataRoute } from 'next';
import { posts } from '@/lib/blog-posts';
export default function sitemap(): MetadataRoute.Sitemap {
 const baseUrl='https://www.institutodosonobh.com.br';
 return [
  {url:baseUrl,changeFrequency:'weekly',priority:1},
  {url:`${baseUrl}/contato/`,changeFrequency:'monthly',priority:0.8},
  {url:`${baseUrl}/blog/`,changeFrequency:'weekly',priority:0.8},
  {url:"https://www.institutodosonobh.com.br/onde-atendemos/",changeFrequency:'monthly',priority:0.8},
  ...posts.map(post=>({url:`${baseUrl}/blog/${post.slug}/`,changeFrequency:'monthly' as const,priority:0.7})),
 ];
}
