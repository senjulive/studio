'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center bg-background">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
          <AlertTriangle className="relative h-20 w-20 text-red-500 drop-shadow-2xl" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Oops!</h1>
          <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-muted/30 p-4 rounded-lg mt-4">
              <summary className="cursor-pointer font-medium text-sm">
                Error Details (Development)
              </summary>
              <pre className="text-xs mt-2 overflow-auto text-red-400">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs mt-2 text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={reset} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
