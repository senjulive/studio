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

  // If this is the root path and no content, show welcome page
  if (urlPath === '/') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center bg-background animate-in fade-in-50 duration-1000">
        <div className="flex flex-col items-center gap-6">
          <AstralLogo className="h-40 w-40 animate-pulse" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Welcome to AstralCore
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Your intelligent crypto management platform. Our sophisticated trading bot employs Grid Trading to turn market volatility into consistent, automated profits for you.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
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
