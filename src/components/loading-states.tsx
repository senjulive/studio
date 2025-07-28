'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generic loading spinner
export function LoadingSpinner({ size = 'default', className }: { size?: 'sm' | 'default' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
}

// Full page loading
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Zap className="h-8 w-8 text-primary animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        </div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// Trading bot card skeleton
export function TradingBotSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center space-y-1">
            <Skeleton className="h-3 w-12 mx-auto" />
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
          <div className="text-center space-y-1">
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-4 w-12 mx-auto" />
          </div>
          <div className="text-center space-y-1">
            <Skeleton className="h-3 w-12 mx-auto" />
            <Skeleton className="h-4 w-10 mx-auto" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

// Market data skeleton
export function MarketDataSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Wallet summary skeleton
export function WalletSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Loading chart data...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-20" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Dashboard stats skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Lazy loading wrapper with skeleton
interface LazyLoadWrapperProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  error?: Error | null;
  retry?: () => void;
}

export function LazyLoadWrapper({ loading, skeleton, children, error, retry }: LazyLoadWrapperProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Failed to load content</p>
            <p className="text-xs text-red-500">{error.message}</p>
            {retry && (
              <button
                onClick={retry}
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
}

// Animated loading dots
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-current rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Progress indicator
export function ProgressIndicator({ 
  progress, 
  message, 
  steps 
}: { 
  progress: number; 
  message?: string; 
  steps?: string[];
}) {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{message || 'Loading...'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {steps && (
        <div className="space-y-1">
          {steps.map((step, index) => {
            const stepProgress = (index + 1) / steps.length * 100;
            const isCompleted = progress >= stepProgress;
            const isCurrent = progress >= (index / steps.length * 100) && progress < stepProgress;
            
            return (
              <div key={index} className={cn(
                'flex items-center text-sm',
                isCompleted ? 'text-green-600' : isCurrent ? 'text-primary' : 'text-muted-foreground'
              )}>
                <div className={cn(
                  'w-2 h-2 rounded-full mr-2',
                  isCompleted ? 'bg-green-600' : isCurrent ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
                )} />
                {step}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
