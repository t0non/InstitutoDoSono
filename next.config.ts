import type {NextConfig} from 'next';

const longCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    // Next converte e redimensiona as fotos automaticamente (AVIF/WebP no tamanho certo da tela)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600],
    imageSizes: [64, 96, 128, 180, 256, 360],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'files.catbox.moe', port: '', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      { source: '/fonts/:path*', headers: longCache },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }] },
    ];
  },
};

export default nextConfig;
