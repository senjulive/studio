import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.app';
  
  const robots = `User-agent: *
Allow: /
Allow: /dashboard
Allow: /login
Allow: /register
Allow: /forgot-password

# Disallow sensitive areas
Disallow: /admin/
Disallow: /moderator/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/security
Disallow: /dashboard/withdraw
Disallow: /dashboard/deposit

# Disallow private user content
Disallow: /dashboard/profile/verify
Disallow: /dashboard/inbox
Disallow: /dashboard/support

# Allow public API endpoints
Allow: /api/public-settings
Allow: /api/market-summary

# Crawl delay for responsible crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Block AI crawlers for privacy
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
