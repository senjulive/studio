import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/moderator',
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/public-settings',
  '/api/market-summary',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

// Define moderator routes
const moderatorRoutes = [
  '/moderator',
];

// Mobile detection helper
function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// Authentication check helper
function isAuthenticated(request: NextRequest): boolean {
  // Check for authentication token in cookies or headers
  const authToken = request.cookies.get('auth-token')?.value ||
                   request.headers.get('authorization');
  
  // Check session storage simulation (for demo purposes)
  const loggedInEmail = request.cookies.get('logged-in-email')?.value;
  
  return !!(authToken || loggedInEmail);
}

// Role check helper
function getUserRole(request: NextRequest): string {
  const loggedInEmail = request.cookies.get('logged-in-email')?.value;
  
  if (loggedInEmail === 'admin@astralcore.io') {
    return 'admin';
  } else if (loggedInEmail === 'moderator@astralcore.io') {
    return 'moderator';
  }
  
  return 'user';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = isMobileDevice(userAgent);
  
  // Add security headers
  const response = NextResponse.next();
  
  // Security headers for all requests
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add mobile optimization headers
  if (isMobile) {
    response.headers.set('Viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
    response.headers.set('X-Mobile-Optimized', 'true');
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Add rate limiting headers (placeholder)
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
    
    return response;
  }

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return response;
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Authentication check for protected routes
  if (isProtectedRoute && !isAuthenticated(request)) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (isAuthenticated(request)) {
    const userRole = getUserRole(request);
    
    // Check admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Check moderator routes
    if (moderatorRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin' && userRole !== 'moderator') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Mobile-specific redirects (if needed)
  if (isMobile) {
    // Add mobile-specific routing logic here if needed
    response.headers.set('X-Device-Type', 'mobile');
  } else {
    response.headers.set('X-Device-Type', 'desktop');
  }

  // Add performance headers
  response.headers.set('X-Response-Time', Date.now().toString());
  
  // Add cache control for static content
  if (pathname.startsWith('/icons/') || pathname.startsWith('/images/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/webhooks (webhook endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
