import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('astralcore-session');

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
  
  // Admin/Moderator only routes
  const adminRoutes = ['/admin'];
  const moderatorRoutes = ['/moderator'];
  const protectedRoutes = ['/dashboard'];

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
    
    // Check if session is expired (7 days)
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds
    if (Date.now() - session.timestamp > maxAge) {
      // Session expired, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('astralcore-session');
      return response;
    }

    // Check role-based access
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (session.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    if (moderatorRoutes.some(route => pathname.startsWith(route))) {
      if (session.role !== 'moderator' && session.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
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
    // Temporarily disable middleware to debug compilation issues
    // '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons).*)',
  ],
};
