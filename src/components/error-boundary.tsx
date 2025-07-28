'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: React.ErrorInfo;
}

function DefaultErrorFallback({ error, resetError, errorInfo }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  const handleReportError = () => {
    // In a real app, this would send error reports to a service like Sentry
    console.error('Error reported:', error, errorInfo);
    
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Mock error reporting
    alert('Error report sent to development team. Thank you for helping us improve!');
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We apologize for the inconvenience. An unexpected error has occurred.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <Bug className="h-4 w-4" />
            <AlertDescription>
              Error: {error.message}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="ghost" onClick={handleReportError} className="w-full">
              <Bug className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              variant="link"
              onClick={() => setShowDetails(!showDetails)}
              className="h-auto p-0 text-sm"
            >
              {showDetails ? 'Hide' : 'Show'} technical details
            </Button>
            
            {showDetails && (
              <div className="rounded-md bg-muted p-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <strong>Error:</strong> {error.name}
                  </div>
                  <div>
                    <strong>Message:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack trace:</strong>
                      <pre className="mt-1 overflow-auto text-xs whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div>
                      <strong>Component stack:</strong>
                      <pre className="mt-1 overflow-auto text-xs whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          errorInfo={this.state.errorInfo || undefined}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: any) => {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by useErrorHandler:', error, errorInfo);
    }

    // In production, send to error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    // For now, just throw the error to be caught by ErrorBoundary
    throw error;
  }, []);
}

// Wrapper for async operations with error handling
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  onError?: (error: Error) => void
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      if (onError) {
        onError(errorObj);
      } else {
        console.error('Async operation failed:', errorObj);
      }
      
      throw errorObj;
    }
  }) as T;
}
