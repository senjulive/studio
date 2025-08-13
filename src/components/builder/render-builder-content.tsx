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

  // Modern mobile-first welcome page with electric theme
  if (urlPath === '/') {
    return (
      <div className="min-h-dvh bg-background overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Main content */}
        <main className="relative z-10 mobile-container min-h-dvh flex flex-col">
          {/* Hero Section - Mobile Optimized */}
          <div className="flex-1 flex flex-col justify-center items-center text-center pt-8 pb-24">

            {/* Logo with electric glow */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
              <AstralLogo className="relative h-24 w-24 sm:h-32 sm:w-32 electric-glow" />
            </div>

            {/* Electric title */}
            <div className="space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                  AstralCore
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md leading-relaxed px-4">
                Next-gen crypto trading platform with AI-powered automation and electric performance
              </p>
            </div>

            {/* Modern feature cards - Mobile stack */}
            <div className="w-full max-w-sm space-y-4 mb-8">
              <div className="mobile-card group hover:electric-glow transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center electric-glow group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-foreground">AI Trading Bot</h3>
                    <p className="text-xs text-muted-foreground">24/7 automated profits</p>
                  </div>
                </div>
              </div>

              <div className="mobile-card group hover:electric-glow-cyan transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center electric-glow-cyan group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-foreground">Ultra Secure</h3>
                    <p className="text-xs text-muted-foreground">Military-grade encryption</p>
                  </div>
                </div>
              </div>

              <div className="mobile-card group hover:electric-glow-magenta transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center electric-glow-magenta group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-foreground">Live Analytics</h3>
                    <p className="text-xs text-muted-foreground">Real-time insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern CTA buttons */}
            <div className="w-full max-w-sm space-y-3">
              <Button asChild className="w-full h-12 text-base font-bold electric-glow hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary">
                <Link href="/login">
                  Launch App <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 text-base font-bold border-primary/50 hover:bg-primary/10 hover:electric-glow transition-all duration-300">
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>

            {/* Electric stats bar */}
            <div className="mt-12 w-full max-w-sm">
              <div className="mobile-card">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">$50M+</div>
                    <div className="text-xs text-muted-foreground">Volume</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">100K+</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">99.9%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                </div>
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
