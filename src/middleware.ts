import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for certain paths to prevent issues
  if (pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml') {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('astralcore-session');

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/about', '/contact', '/help', '/faq', '/terms', '/privacy'];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user has a session
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const session = JSON.parse(sessionCookie.value);

    // Basic session validation
    if (!session || !session.timestamp) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('astralcore-session');
      return response;
    }

    // Check if session is expired (7 days)
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds
    if (Date.now() - session.timestamp > maxAge) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('astralcore-session');
      return response;
    }

    // Simple role-based access
    if (pathname.startsWith('/admin') && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.startsWith('/moderator') && session.role !== 'moderator' && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid session, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('astralcore-session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     * - health check endpoints
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|health|robots.txt|sitemap.xml).*)',
  ],
};
