'use client';

import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, Home } from 'lucide-react';

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'demo-key';

interface RenderBuilderContentProps {
  content?: any;
  urlPath?: string;
}

export function RenderBuilderContent({ content, urlPath }: RenderBuilderContentProps) {
  const isPreviewing = useIsPreviewing();

  if (content || isPreviewing) {
    return <BuilderComponent model="page" content={content} apiKey={BUILDER_API_KEY} />;
  }

  // If this is the root path and no content, show enhanced welcome page
  if (urlPath === '/') {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
        <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-1000">
          <div className="flex flex-col items-center gap-8 max-w-4xl">
            <AstralLogo className="h-32 w-32 sm:h-40 sm:w-40 animate-pulse" />

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome to AstralCore
              </h1>
              <p className="max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Your intelligent crypto management platform. Our sophisticated trading bot employs Grid Trading to turn market volatility into consistent, automated profits for you.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
              <div className="p-6 rounded-lg border bg-card/50 backdrop-blur">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Automated Trading</h3>
                <p className="text-sm text-muted-foreground">Advanced algorithms execute trades 24/7 to maximize your profits</p>
              </div>

              <div className="p-6 rounded-lg border bg-card/50 backdrop-blur">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Platform</h3>
                <p className="text-sm text-muted-foreground">Bank-level security with multi-layer protection for your assets</p>
              </div>

              <div className="p-6 rounded-lg border bg-card/50 backdrop-blur">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
                <p className="text-sm text-muted-foreground">Monitor your portfolio performance with detailed insights</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">$10M+</div>
                <div className="text-sm text-muted-foreground">Assets Managed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // For other paths, show a 404-style page
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-foreground">Page not found</h1>
        <p className="text-lg text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
