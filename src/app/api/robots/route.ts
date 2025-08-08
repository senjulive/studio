import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /
Allow: /dashboard
Allow: /login
Allow: /register
Allow: /about

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /moderator/
Disallow: /_next/
Disallow: /dashboard/

# Disallow sensitive files
Disallow: /*.json$
Disallow: /*.env$
Disallow: /*.log$

# Allow public assets
Allow: /favicon.ico
Allow: /manifest.webmanifest
Allow: /icons/
Allow: /images/
Allow: /static/

# Sitemap location
Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app'}/sitemap.xml

# Crawl delay
Crawl-delay: 1
`.trim();

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
