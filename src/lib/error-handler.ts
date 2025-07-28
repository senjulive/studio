'use client';

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
}

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private isOnline = true;
  private retryAttempts = 0;
  private maxRetryAttempts = 3;

  private constructor() {
    this.setupGlobalHandlers();
    this.setupOnlineDetection();
  }

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          type: 'unhandled_promise_rejection',
          reason: event.reason,
        },
        'high'
      );
    });

    // Handle global JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(
        new Error(event.message),
        {
          type: 'javascript_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        'high'
      );
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        this.captureError(
          new Error(`Resource loading error: ${(event.target as any).src || (event.target as any).href}`),
          {
            type: 'resource_error',
            element: (event.target as any).tagName,
            src: (event.target as any).src || (event.target as any).href,
          },
          'medium'
        );
      }
    }, true);
  }

  private setupOnlineDetection() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  public captureError(
    error: Error,
    context: Record<string, any> = {},
    severity: ErrorReport['severity'] = 'medium',
    tags: string[] = []
  ): string {
    const errorId = this.generateErrorId();
    
    const errorReport: ErrorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      context,
      severity,
      tags,
    };

    // Add to queue
    this.errorQueue.push(errorReport);

    // Try to send immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorReport);
    }

    return errorId;
  }

  public captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context: Record<string, any> = {}
  ): string {
    return this.captureError(
      new Error(message),
      { ...context, level },
      level === 'error' ? 'high' : level === 'warning' ? 'medium' : 'low',
      [level]
    );
  }

  private async flushErrorQueue() {
    if (this.errorQueue.length === 0) return;

    try {
      // In a real app, you would send to your error reporting service
      // Example: await this.sendToErrorService(this.errorQueue);
      
      // For demo, we'll just log
      console.log('Sending error reports:', this.errorQueue);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear queue on success
      this.errorQueue = [];
      this.retryAttempts = 0;
      
    } catch (error) {
      this.retryAttempts++;
      
      if (this.retryAttempts < this.maxRetryAttempts) {
        // Retry with exponential backoff
        setTimeout(() => {
          this.flushErrorQueue();
        }, Math.pow(2, this.retryAttempts) * 1000);
      } else {
        // Store in localStorage as fallback
        this.storeErrorsLocally();
      }
    }
  }

  private storeErrorsLocally() {
    try {
      const stored = localStorage.getItem('astral-error-queue') || '[]';
      const existingErrors = JSON.parse(stored);
      const allErrors = [...existingErrors, ...this.errorQueue];
      
      // Keep only last 50 errors to prevent localStorage bloat
      const recentErrors = allErrors.slice(-50);
      
      localStorage.setItem('astral-error-queue', JSON.stringify(recentErrors));
      this.errorQueue = [];
    } catch (error) {
      console.warn('Failed to store errors locally:', error);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getStoredErrors(): ErrorReport[] {
    try {
      const stored = localStorage.getItem('astral-error-queue') || '[]';
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public clearStoredErrors(): void {
    localStorage.removeItem('astral-error-queue');
  }

  public setUser(userId: string): void {
    // Store user context for future error reports
    if (typeof window !== 'undefined') {
      (window as any).__astral_user_id = userId;
    }
  }

  public addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    // In a real app, you would add breadcrumbs to help debug issues
    if (process.env.NODE_ENV === 'development') {
      console.log('Breadcrumb:', { message, category, data, timestamp: new Date().toISOString() });
    }
  }
}

// Convenience functions
export const errorHandler = GlobalErrorHandler.getInstance();

export function captureError(error: Error, context?: Record<string, any>, severity?: ErrorReport['severity']): string {
  return errorHandler.captureError(error, context, severity);
}

export function captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: Record<string, any>): string {
  return errorHandler.captureMessage(message, level, context);
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
  return errorHandler.addBreadcrumb(message, category, data);
}

// React hook for error handling
import * as React from 'react';

export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: Record<string, any>) => {
    return captureError(error, context);
  }, []);

  const handleAsyncError = React.useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)), context);
      throw error;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
}

// Wrapper for API calls with automatic error handling
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  context: Record<string, any> = {}
): Promise<T> {
  try {
    addBreadcrumb(`API call to ${url}`, 'api', { method: options.method || 'GET' });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    addBreadcrumb(`API call to ${url} succeeded`, 'api', { status: response.status });
    
    return data;
  } catch (error) {
    captureError(
      error instanceof Error ? error : new Error(String(error)),
      { ...context, url, options },
      'high'
    );
    throw error;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static startMeasurement(name: string): void {
    this.measurements.set(name, performance.now());
  }

  static endMeasurement(name: string, threshold: number = 1000): number {
    const startTime = this.measurements.get(name);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.measurements.delete(name);

    // Report slow operations
    if (duration > threshold) {
      captureMessage(
        `Slow operation detected: ${name}`,
        'warning',
        { duration, threshold }
      );
    }

    return duration;
  }

  static measureAsync<T>(name: string, asyncFn: () => Promise<T>, threshold?: number): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startMeasurement(name);
      
      try {
        const result = await asyncFn();
        this.endMeasurement(name, threshold);
        resolve(result);
      } catch (error) {
        this.endMeasurement(name, threshold);
        reject(error);
      }
    });
  }
}
