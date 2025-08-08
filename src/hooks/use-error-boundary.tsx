'use client';

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface ErrorState {
  error: Error | null;
  hasError: boolean;
  errorId: string | null;
}

interface UseErrorBoundaryOptions {
  logErrors?: boolean;
  showToast?: boolean;
  onError?: (error: Error, errorId: string) => void;
}

export function useErrorBoundary(options: UseErrorBoundaryOptions = {}) {
  const { logErrors = true, showToast = true, onError } = options;
  const { toast } = useToast();
  
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    errorId: null,
  });

  const captureError = useCallback((error: Error, context?: string) => {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setErrorState({
      error,
      hasError: true,
      errorId,
    });

    // Log error to console in development
    if (logErrors) {
      console.error(`[ErrorBoundary] ${context || 'Captured error'}:`, {
        error,
        errorId,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }

    // Show user-friendly toast
    if (showToast) {
      toast({
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }

    // Call custom error handler
    onError?.(error, errorId);

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { errorId, context });
    }
  }, [logErrors, showToast, onError, toast]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      errorId: null,
    });
  }, []);

  const withErrorBoundary = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        captureError(error instanceof Error ? error : new Error(String(error)), context);
        return null;
      }
    };
  }, [captureError]);

  const withSyncErrorBoundary = useCallback(<T extends any[], R>(
    fn: (...args: T) => R,
    context?: string
  ) => {
    return (...args: T): R | null => {
      try {
        return fn(...args);
      } catch (error) {
        captureError(error instanceof Error ? error : new Error(String(error)), context);
        return null;
      }
    };
  }, [captureError]);

  return {
    ...errorState,
    captureError,
    clearError,
    withErrorBoundary,
    withSyncErrorBoundary,
  };
}
