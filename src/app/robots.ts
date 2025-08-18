import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.io';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/register',
          '/about',
          '/api/market-summary',
          '/api/public-settings',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/moderator/',
          '/api/admin/',
          '/api/moderator/',
          '/api/deposit/',
          '/api/withdraw/',
          '/api/support/',
          '/api/squad/',
          '/api/rewards/',
          '/api/profile/',
          '/api/notifications/',
          '/api/health/',
          '/api/healthcheck/',
          '/api/monitoring/',
          '/api/security/',
          '/_next/',
          '/static/',
          '/*.json$',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
