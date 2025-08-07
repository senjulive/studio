import { NextResponse } from 'next/server';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/login`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/register`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/forgot-password`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/dashboard/about`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/dashboard/market`,
      lastmod: currentDate,
      changefreq: 'hourly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/dashboard/trading`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/dashboard/support`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7,
    },
  ];

  // Generate dynamic URLs (if you have dynamic content)
  // Example: Add blog posts, product pages, etc.
  const dynamicUrls: SitemapUrl[] = [];

  // Combine all URLs
  const allUrls = [...staticUrls, ...dynamicUrls];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
