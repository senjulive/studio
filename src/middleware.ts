import { NextRequest, NextResponse } from 'next/server';

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.builder.io https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.builder.io https://cdn.builder.io https://www.google-analytics.com wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
};

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/moderator',
  '/api/admin',
  '/api/moderator',
  '/api/dashboard',
];

// Public routes that don't require rate limiting
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/public-settings',
  '/api/ping',
];

// API routes that need stricter rate limiting
const apiRoutes = [
  '/api/auth',
  '/api/support-agent',
  '/api/market-summary',
];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route));
}

function isApiRoute(pathname: string): boolean {
  return apiRoutes.some(route => pathname.startsWith(route));
}

function shouldRateLimit(pathname: string): boolean {
  // Don't rate limit static assets
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return false;
  }
  
  // Rate limit API routes more strictly
  if (pathname.startsWith('/api/')) {
    return true;
  }
  
  // Rate limit auth-related pages
  if (pathname.includes('login') || pathname.includes('register') || pathname.includes('password')) {
    return true;
  }
  
  return false;
}

async function validateAuth(request: NextRequest): Promise<boolean> {
  // For demo purposes, we'll check for a simple session token
  // In production, implement proper JWT validation or session management
  
  const sessionToken = request.cookies.get('session-token')?.value;
  const authHeader = request.headers.get('authorization');
  
  if (sessionToken) {
    // Validate session token (implement your validation logic)
    return true; // Placeholder
  }
  
  if (authHeader?.startsWith('Bearer ')) {
    // Validate JWT token (implement your validation logic)
    return true; // Placeholder
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Skip middleware for static assets and internal Next.js routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('.well-known')
  ) {
    return response;
  }
  
  try {
    // Rate limiting
    if (shouldRateLimit(pathname)) {
      const clientIP = getClientIP(request);
      const rateLimitKey = `${clientIP}:${pathname}`;
      
      // Use stricter limits for API routes
      const maxRequests = isApiRoute(pathname) ? 30 : 100;
      const windowMs = 60000; // 1 minute
      
      const customRateLimiter = new (await import('@/lib/error-handler')).RateLimiter(maxRequests, windowMs);
      
      if (customRateLimiter.isRateLimited(rateLimitKey)) {
        const resetTime = customRateLimiter.getResetTime(rateLimitKey);
        
        return new NextResponse('Rate limit exceeded', {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toISOString(),
          },
        });
      }
      
      // Add rate limit headers to response
      const remaining = customRateLimiter.getRemainingRequests(rateLimitKey);
      response.headers.set('X-RateLimit-Limit', maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', customRateLimiter.getResetTime(rateLimitKey).toISOString());
    }
    
    // Authentication check for protected routes
    if (isProtectedRoute(pathname)) {
      const isAuthenticated = await validateAuth(request);
      
      if (!isAuthenticated) {
        // Redirect to login for protected pages
        if (!pathname.startsWith('/api/')) {
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
        }
        
        // Return 401 for API routes
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }
    
    // Maintenance mode check
    if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
      // Allow access to maintenance page and admin routes
      if (!pathname.startsWith('/maintenance') && !pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
    
    // Add security context to request headers
    response.headers.set('X-Pathname', pathname);
    response.headers.set('X-Timestamp', new Date().toISOString());
    
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Don't break the request if middleware fails
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public|icons|manifest.webmanifest).*)',
  ],
};
