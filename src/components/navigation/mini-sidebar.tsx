'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { useResponsive } from '@/hooks/use-responsive';
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  Users, 
  Settings, 
  HelpCircle, 
  X,
  ChevronLeft,
  Bell,
  User
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MiniSidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  category?: 'primary' | 'secondary' | 'utility';
}

const sidebarItems: MiniSidebarItem[] = [
  { id: 'home', label: 'Home', href: '/dashboard', icon: Home, category: 'primary' },
  { id: 'wallet', label: 'Wallet', href: '/dashboard/wallet', icon: Wallet, category: 'primary' },
  { id: 'trading', label: 'Trading', href: '/dashboard/trading', icon: TrendingUp, category: 'primary' },
  { id: 'squad', label: 'Squad', href: '/dashboard/squad', icon: Users, category: 'secondary' },
  { id: 'profile', label: 'Profile', href: '/dashboard/profile', icon: User, category: 'secondary' },
  { id: 'notifications', label: 'Notifications', href: '/dashboard/inbox', icon: Bell, badge: 3, category: 'utility' },
  { id: 'settings', label: 'Settings', href: '/dashboard/security', icon: Settings, category: 'utility' },
  { id: 'support', label: 'Support', href: '/dashboard/support', icon: HelpCircle, category: 'utility' },
];

interface MiniSidebarProps {
  className?: string;
}

export function MiniSidebar({ className }: MiniSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const { isMobile } = useResponsive();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Auto-hide after inactivity
  const resetAutoHideTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000); // Hide after 5 seconds of inactivity
    }
  }, [isOpen]);

  // Touch gestures for the main screen (to open sidebar)
  const mainScreenRef = useTouchGestures({
    onSwipeLeft: () => {
      if (isMobile && !isOpen) {
        setIsOpen(true);
        resetAutoHideTimer();
      }
    },
  }, {
    threshold: 50,
    restraint: 100,
  });

  // Touch gestures for the sidebar handle
  const handleGestureRef = useTouchGestures({
    onTap: () => {
      setIsOpen(!isOpen);
      resetAutoHideTimer();
    },
    onSwipeLeft: () => {
      setIsOpen(false);
    },
    onSwipeRight: () => {
      if (!isOpen) {
        setIsOpen(true);
        resetAutoHideTimer();
      }
    },
  });

  // Touch gestures for the sidebar content
  const sidebarGestureRef = useTouchGestures({
    onSwipeRight: () => {
      setIsOpen(false);
    },
  });

  // Handle drag interactions for smooth opening/closing
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || !isMobile) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      // Only allow dragging from right edge or when sidebar is open
      if (startX > window.innerWidth - 50 || isOpen) {
        const clampedDelta = Math.max(-250, Math.min(0, deltaX));
        setDragX(clampedDelta);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      isDragging = false;
      setIsDragging(false);
      
      // Determine if should open or close based on drag distance
      if (Math.abs(dragX) > 100) {
        setIsOpen(dragX > -125);
      }
      
      setDragX(0);
      resetAutoHideTimer();
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, dragX, resetAutoHideTimer, isMobile]);

  // Reset timer when sidebar opens
  useEffect(() => {
    resetAutoHideTimer();
  }, [resetAutoHideTimer]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        handleRef.current &&
        !handleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const groupedItems = sidebarItems.reduce((acc, item) => {
    const category = item.category || 'primary';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MiniSidebarItem[]>);

  return (
    <>
      {/* Main screen touch area */}
      <div
        ref={mainScreenRef as React.RefObject<HTMLDivElement>}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      {/* Sidebar Handle */}
      <motion.div
        ref={handleRef}
        className={cn(
          'fixed right-0 top-1/2 -translate-y-1/2 z-50',
          'w-6 h-16 bg-gradient-to-l from-[var(--qn-primary)] to-[var(--qn-secondary)]',
          'rounded-l-lg cursor-pointer shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-300',
          isDragging && 'scale-110',
          className
        )}
        style={{
          transform: `translateY(-50%) translateX(${isOpen ? '-250px' : dragX + 'px'})`,
        }}
        animate={{
          opacity: isMobile ? 1 : 0.7,
          scale: isDragging ? 1.1 : 1,
        }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft 
          className={cn(
            'w-4 h-4 text-black transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mini Sidebar */}
      <motion.div
        ref={sidebarRef}
        className={cn(
          'fixed right-0 top-0 h-full w-64 z-50',
          'bg-gradient-to-b from-[var(--qn-darker)] to-[var(--qn-dark)]',
          'border-l border-white/10 shadow-2xl',
          'flex flex-col overflow-hidden'
        )}
        style={{
          transform: `translateX(${isOpen ? dragX + 'px' : '100%'})`,
        }}
        animate={{
          x: isOpen ? 0 : '100%',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 style={{
            background: 'linear-gradient(90deg, var(--qn-primary), var(--qn-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '600',
            fontSize: '18px'
          }}>
            Quick Access
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-[var(--qn-light)]" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-[var(--qn-secondary)] uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setIsOpen(false);
                        resetAutoHideTimer();
                      }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg',
                        'text-[var(--qn-light)] hover:text-[var(--qn-secondary)]',
                        'hover:bg-white/5 transition-all duration-200',
                        'group relative overflow-hidden'
                      )}
                    >
                      <Icon className="w-5 h-5 transition-colors" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[var(--qn-danger)] text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--qn-primary)]/10 to-[var(--qn-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-[var(--qn-light)]/60 text-center">
            Swipe right to close
          </div>
        </div>
      </motion.div>
    </>
  );
}
