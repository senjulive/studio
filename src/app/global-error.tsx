'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-background text-foreground">
        <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center">
          <div className="flex flex-col items-center gap-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
              <AlertTriangle className="relative h-20 w-20 text-red-500 drop-shadow-2xl" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Critical Error</h1>
              <p className="text-muted-foreground">
                A critical error occurred. Please refresh the page or contact support if the problem persists.
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

            <Button onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
