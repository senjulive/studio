import { NextResponse } from 'next/server';

export async function GET() {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.builder.io https://assets.coincap.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss: ws:",
      "media-src 'self'",
      "object-src 'none'",
      "frame-src 'self' https://cdn.builder.io",
    ].join('; '),
  };

  return NextResponse.json({
    status: 'Security headers configured',
    headers,
    recommendations: {
      'CSP': 'Content Security Policy configured for crypto platform',
      'HSTS': 'HTTP Strict Transport Security enabled',
      'XSS': 'Cross-site scripting protection enabled',
      'Clickjacking': 'X-Frame-Options prevents clickjacking',
      'MIME': 'MIME type sniffing prevented',
    },
  });
}
