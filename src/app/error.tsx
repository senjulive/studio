'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AstralLogo } from '@/components/icons/astral-logo';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
    
    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, etc.
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-pink-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <AstralLogo className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-red-400" />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Something went wrong!</h1>
          <p className="text-white/70 text-lg">
            An unexpected error occurred. Our team has been notified.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="text-left bg-black/30 p-4 rounded-lg">
              <p className="text-red-300 font-mono text-sm">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-gray-400 text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <a href="/">
              Return Home
            </a>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-white/50 text-sm">
          If the problem persists, please contact our{' '}
          <a href="/dashboard/support" className="text-pink-400 hover:text-pink-300 underline">
            support team
          </a>
        </p>
      </div>
    </div>
  );
}
