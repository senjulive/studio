import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes: string[] = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/routes',
    '/qa/smoke',
    // Dashboard
    '/dashboard',
    '/dashboard/market',
    '/dashboard/deposit',
    '/dashboard/withdraw',
    '/dashboard/inbox',
    '/dashboard/invite',
    '/dashboard/promotions',
    '/dashboard/about',
    '/dashboard/chat',
    '/dashboard/trading',
    '/dashboard/trading-info',
    '/dashboard/profile',
    '/dashboard/profile/verify',
    '/dashboard/security',
    '/dashboard/squad',
  ];

  const now = new Date();

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));
}