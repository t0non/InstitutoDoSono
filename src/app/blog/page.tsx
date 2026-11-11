import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import MobileStickyBar from '@/components/landing/MobileStickyBar';
import { posts } from '@/lib/blog-posts';
export const metadata: Metadata = {title:'Blog | Instituto do Sono em Belo Horizonte',description:'Dúvidas sobre polissonografia, ronco, apneia do sono, preparo, valores e atendimento em Belo Horizonte.',alternates:{canonical:'https://www.institutodosonobh.com.br/blog/'}};
export default function BlogPage() {
 return <><Header /><main className="info-page"><div className="info-page-intro"><div className="info-page-container"><p className="info-page-kicker">Instituto do Sono · Belo Horizonte, MG</p><h1>Blog do Instituto do Sono</h1><p>Informações para cuidar do sono e organizar seus exames, da preparação ao atendimento.</p></div></div><section className="info-page-container blog-page-section" aria-labelledby="blog-title"><h2 id="blog-title">Artigos do blog</h2><div className="blog-page-grid">{posts.map(post => <article className="blog-page-card" key={post.slug}><p className="info-page-kicker">{post.category}</p><h3><Link href={`/blog/${post.slug}/`}>{post.title}</Link></h3><p>{post.description}</p><Link className="info-page-link" href={`/blog/${post.slug}/`} aria-label={`Ler artigo: ${post.title}`}>Ler artigo →</Link></article>)}</div></section><section className="blog-page-contact"><div className="info-page-container"><div><h2>Precisa confirmar uma informação sobre seu exame?</h2><p>Fale com a equipe do Instituto do Sono em Belo Horizonte.</p></div><Link href="/contato/" className="clinic-location-button">Fale conosco</Link></div></section></main><Footer /><MobileStickyBar /></>;
}
