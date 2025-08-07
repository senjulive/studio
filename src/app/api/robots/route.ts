import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://astralcore.io';
  
  const robots = `User-agent: *
Allow: /
Allow: /login
Allow: /register
Disallow: /dashboard/
Disallow: /admin/
Disallow: /moderator/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
