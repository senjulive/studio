'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';
import { useTouchGestures } from '@/hooks/use-touch-gestures';

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'filled' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  swipeable?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
}

const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({
    variant = 'default',
    size = 'md',
    interactive = false,
    swipeable = false,
    onSwipeLeft,
    onSwipeRight,
    onTap,
    onLongPress,
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile } = useResponsive();

    const gestureRef = useTouchGestures({
      onSwipeLeft,
      onSwipeRight,
      onTap,
      onLongPress,
    });

    const variantClasses = {
      default: 'bg-white/5 border border-white/10',
      outlined: 'bg-transparent border-2 border-[var(--qn-primary)]',
      filled: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/5',
      gradient: 'bg-gradient-to-br from-[var(--qn-primary)]/20 to-[var(--qn-secondary)]/10 border border-white/10',
    };

    const sizeClasses = {
      sm: 'p-3 rounded-lg',
      md: 'p-4 rounded-xl',
      lg: 'p-6 rounded-2xl',
    };

    return (
      <motion.div
        ref={swipeable ? gestureRef : ref}
        className={cn(
          'backdrop-blur-sm transition-all duration-300',
          variantClasses[variant],
          sizeClasses[size],
          interactive && [
            'cursor-pointer',
            'hover:bg-white/10',
            'hover:border-[var(--qn-primary)]/30',
            'hover:shadow-lg',
            'hover:shadow-[var(--qn-primary)]/10',
            isMobile && 'active:scale-95',
          ],
          swipeable && 'touch-pan-y',
          className
        )}
        whileHover={interactive ? { y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {/* Gradient overlay for gradient variant */}
        {variant === 'gradient' && (
          <div 
            className="absolute inset-0 rounded-inherit opacity-50 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(110, 0, 255, 0.1), rgba(0, 247, 255, 0.05))',
            }}
          />
        )}
        
        {/* Shimmer effect for interactive cards */}
        {interactive && (
          <div className="absolute inset-0 -z-10 rounded-inherit opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div 
              className="absolute inset-0 rounded-inherit animate-pulse"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(110, 0, 255, 0.1) 50%, transparent 70%)',
                backgroundSize: '200% 200%',
                animation: 'shine 2s infinite',
              }}
            />
          </div>
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

MobileCard.displayName = 'MobileCard';

// Card Header
interface MobileCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MobileCardHeader = forwardRef<HTMLDivElement, MobileCardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4 pb-3 border-b border-white/10', className)}
      {...props}
    >
      {children}
    </div>
  )
);

MobileCardHeader.displayName = 'MobileCardHeader';

// Card Title
interface MobileCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

const MobileCardTitle = forwardRef<HTMLParagraphElement, MobileCardTitleProps>(
  ({ className, children, gradient = false, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-semibold text-lg leading-tight',
        gradient ? [
          'bg-gradient-to-r from-[var(--qn-primary)] to-[var(--qn-secondary)]',
          'bg-clip-text text-transparent'
        ] : 'text-[var(--qn-light)]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

MobileCardTitle.displayName = 'MobileCardTitle';

// Card Description
interface MobileCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const MobileCardDescription = forwardRef<HTMLParagraphElement, MobileCardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--qn-secondary)] opacity-80', className)}
      {...props}
    >
      {children}
    </p>
  )
);

MobileCardDescription.displayName = 'MobileCardDescription';

// Card Content
interface MobileCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MobileCardContent = forwardRef<HTMLDivElement, MobileCardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

MobileCardContent.displayName = 'MobileCardContent';

// Card Footer
interface MobileCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const MobileCardFooter = forwardRef<HTMLDivElement, MobileCardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-3 border-t border-white/10 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
);

MobileCardFooter.displayName = 'MobileCardFooter';

export {
  MobileCard,
  MobileCardHeader,
  MobileCardTitle,
  MobileCardDescription,
  MobileCardContent,
  MobileCardFooter,
};
