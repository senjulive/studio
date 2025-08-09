'use client';

import { ReactNode, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MiniSidebar } from '@/components/navigation/mini-sidebar';
import { AppProvider } from '@/contexts/AppContext';
import { useResponsive } from '@/hooks/use-responsive';
import { cn } from '@/lib/utils';

interface MobileAppLayoutProps {
  children: ReactNode;
  showMiniSidebar?: boolean;
  className?: string;
}

export function MobileAppLayout({ 
  children, 
  showMiniSidebar = true,
  className 
}: MobileAppLayoutProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <AppProvider>
      <ErrorBoundary>
        <div 
          className={cn(
            'min-h-screen',
            'bg-[var(--qn-darker)]',
            'text-[var(--qn-light)]',
            'relative overflow-x-hidden',
            className
          )}
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(110, 0, 255, 0.1) 0%, transparent 20%),
              radial-gradient(circle at 90% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 20%)
            `
          }}
        >
          {/* PWA Meta Tags */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="mobile-web-app-capable" content="yes" />
          
          {/* Main Content Area */}
          <main 
            className={cn(
              'relative z-10',
              'min-h-screen',
              'transition-all duration-300 ease-in-out',
              isMobile && 'px-4 py-2',
              isTablet && 'px-6 py-4',
              !isMobile && !isTablet && 'px-8 py-6'
            )}
          >
            <Suspense 
              fallback={
                <LoadingSpinner 
                  fullScreen 
                  size="lg" 
                  text="Loading AstralCore..." 
                  variant="gradient"
                />
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key="main-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="w-full max-w-7xl mx-auto"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>

          {/* Mini Sidebar for Mobile */}
          {showMiniSidebar && (
            <MiniSidebar />
          )}

          {/* Performance and A11y Enhancements */}
          <div className="sr-only" role="region" aria-label="Application status">
            <div aria-live="polite" id="status-announcements" />
            <div aria-live="assertive" id="error-announcements" />
          </div>
        </div>
      </ErrorBoundary>
    </AppProvider>
  );
}

// Specialized layout for dashboard pages
interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  className?: string;
}

export function DashboardLayout({ 
  children, 
  title, 
  description,
  showHeader = true,
  className 
}: DashboardLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <MobileAppLayout className={className}>
      <div className="space-y-6">
        {showHeader && (title || description) && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              'space-y-2',
              isMobile ? 'text-center' : 'text-left'
            )}
          >
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold">
                <span 
                  className="bg-gradient-to-r from-[var(--qn-primary)] to-[var(--qn-secondary)] bg-clip-text text-transparent"
                >
                  {title}
                </span>
              </h1>
            )}
            {description && (
              <p className="text-[var(--qn-light)]/70 text-sm md:text-base max-w-2xl">
                {description}
              </p>
            )}
          </motion.header>
        )}
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </MobileAppLayout>
  );
}

// Specialized layout for auth pages
interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <MobileAppLayout showMiniSidebar={false} className={className}>
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isMobile ? 'p-4' : 'p-8'
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </MobileAppLayout>
  );
}
