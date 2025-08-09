'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'gradient' | 'orbit';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'rounded-full bg-current',
                  size === 'sm' && 'w-1 h-1',
                  size === 'md' && 'w-1.5 h-1.5',
                  size === 'lg' && 'w-2 h-2',
                  size === 'xl' && 'w-3 h-3'
                )}
                animate={{
                  y: [-4, 4, -4],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={cn(
              'rounded-full border-2 border-current',
              sizeClasses[size]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );

      case 'gradient':
        return (
          <motion.div
            className={cn(
              'rounded-full',
              sizeClasses[size]
            )}
            style={{
              background: 'conic-gradient(from 0deg, var(--qn-primary), var(--qn-secondary), var(--qn-primary))',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        );

      case 'orbit':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border border-current border-b-transparent"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        );

      default:
        return (
          <Loader2
            className={cn(
              'animate-spin',
              sizeClasses[size]
            )}
          />
        );
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen && 'min-h-screen',
      className
    )}>
      <div className="text-[var(--qn-primary)]">
        {renderSpinner()}
      </div>
      
      {text && (
        <motion.p
          className={cn(
            'text-[var(--qn-light)] font-medium',
            textSizeClasses[size]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[var(--qn-darker)] bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton loader component
interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white/10',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-md',
        variant === 'text' && 'rounded-sm h-4',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-pulse', // Could implement wave animation
        className
      )}
    />
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: React.ComponentProps<typeof LoadingSpinner>;
  overlay?: boolean;
}

export function LoadingOverlay({
  isLoading,
  children,
  spinner,
  overlay = true,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className={cn(
          'absolute inset-0 z-10 flex items-center justify-center',
          overlay && 'bg-black/20 backdrop-blur-sm'
        )}>
          <LoadingSpinner {...spinner} />
        </div>
      )}
    </div>
  );
}
