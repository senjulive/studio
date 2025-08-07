import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.builder.io https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.builder.io https://cdn.builder.io https://assets.coincap.io",
    "frame-src 'self' https://builder.io",
    "media-src 'self' data: blob:",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // Performance optimizations
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // API routes caching
    response.headers.set('Cache-Control', 's-maxage=1, stale-while-revalidate');
  }

  // Static assets caching
  if (request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|css|js)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Authentication middleware for protected routes
  const protectedPaths = ['/dashboard', '/admin', '/moderator'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // In a real app, you would check for valid authentication token here
    // For this demo, we'll allow access but could redirect to login
    const isAuthenticated = request.cookies.get('authenticated')?.value === 'true' ||
                          request.headers.get('authorization');

    if (!isAuthenticated && request.nextUrl.pathname !== '/login') {
      // In production, redirect to login page
      // return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Rate limiting (basic implementation)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = request.headers.get('x-rate-limit');
  
  if (rateLimit && parseInt(rateLimit) > 100) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
