'use client';

// Temporarily disable Builder.io import
// import { BuilderComponent } from '@builder.io/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'demo-key';

interface RenderBuilderContentProps {
  content?: any;
  urlPath?: string;
}

export function RenderBuilderContent({ content, urlPath }: RenderBuilderContentProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Safe Builder.io preview detection
  useEffect(() => {
    try {
      // Check if we're in Builder.io preview mode
      const isPreview = typeof window !== 'undefined' && 
        (window.location.search.includes('builder.') || 
         window.location.search.includes('preview=true') ||
         window.parent !== window);
      setIsPreviewing(isPreview);
    } catch (error) {
      console.warn('Builder.io preview detection failed:', error);
      setIsPreviewing(false);
    }
  }, []);

  if (content || isPreviewing) {
    return <BuilderComponent model="page" content={content} apiKey={BUILDER_API_KEY} />;
  }

  // Modern mobile app welcome page
  if (urlPath === '/') {
    return (
      <div className="min-h-dvh bg-background relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <main className="relative z-10 flex flex-col min-h-dvh">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-12">

            {/* Logo section with existing logo */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
              <AstralLogo className="relative h-28 w-28 sm:h-36 sm:w-36 drop-shadow-2xl" />
            </div>

            {/* Title and subtitle */}
            <div className="space-y-6 mb-12 max-w-md">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AstralCore
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Advanced crypto trading platform with AI-powered automation and real-time analytics
              </p>
            </div>

            {/* Feature highlights */}
            <div className="w-full max-w-md space-y-4 mb-12">
              <div className="mobile-card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center electric-glow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base">Automated Trading</h3>
                    <p className="text-sm text-muted-foreground">24/7 AI-powered profit generation</p>
                  </div>
                </div>
              </div>

              <div className="mobile-card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center electric-glow-cyan">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base">Bank-Level Security</h3>
                    <p className="text-sm text-muted-foreground">Military-grade asset protection</p>
                  </div>
                </div>
              </div>

              <div className="mobile-card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center electric-glow-magenta">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base">Real-Time Analytics</h3>
                    <p className="text-sm text-muted-foreground">Advanced market insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full max-w-md space-y-4 mb-8">
              <Button asChild className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 electric-glow">
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-14 text-lg font-bold border-primary/50 hover:bg-primary/10 transition-all duration-300">
                <Link href="/dashboard">
                  Explore Dashboard
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mobile-card w-full max-w-md">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">$100M+</div>
                  <div className="text-xs text-muted-foreground font-medium">Total Volume</div>
                </div>
                <div>
                  <div className="text-xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">250K+</div>
                  <div className="text-xs text-muted-foreground font-medium">Active Users</div>
                </div>
                <div>
                  <div className="text-xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">99.9%</div>
                  <div className="text-xs text-muted-foreground font-medium">Uptime</div>
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
