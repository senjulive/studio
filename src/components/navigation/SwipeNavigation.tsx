"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AstralLogo } from '@/components/icons/astral-logo';

// Navigation items
const navigationItems = [
  {
    section: 'Overview',
    items: [
      { href: '/dashboard', label: 'Home', icon: '🏠' },
      { href: '/dashboard/market', label: 'Market', icon: '📈' },
      { href: '/dashboard/trading', label: 'CORE Trading', icon: '🤖' },
      { href: '/dashboard/portfolio', label: 'Portfolio', icon: '💼' },
    ]
  },
  {
    section: 'Community',
    items: [
      { href: '/dashboard/chat', label: 'Chat', icon: '💬' },
      { href: '/dashboard/squad', label: 'Squad', icon: '👥' },
      { href: '/dashboard/invite', label: 'Invite', icon: '🎯' },
      { href: '/dashboard/rewards', label: 'Rewards', icon: '🎁' },
    ]
  },
  {
    section: 'Manage',
    items: [
      { href: '/dashboard/deposit', label: 'Deposit', icon: '💰' },
      { href: '/dashboard/withdraw', label: 'Withdraw', icon: '💸' },
      { href: '/dashboard/history', label: 'History', icon: '📋' },
      { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
    ]
  },
  {
    section: 'Account',
    items: [
      { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
      { href: '/dashboard/security', label: 'Security', icon: '🔒' },
      { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
      { href: '/dashboard/inbox', label: 'Inbox', icon: '📬' },
    ]
  },
  {
    section: 'Platform',
    items: [
      { href: '/dashboard/promotions', label: 'Promotions', icon: '🎉' },
      { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: '🏆' },
      { href: '/dashboard/support', label: 'Support', icon: '🆘' },
      { href: '/dashboard/about', label: 'About', icon: 'ℹ️' },
    ]
  }
];

interface SwipeNavigationProps {
  children: React.ReactNode;
}

export function SwipeNavigation({ children }: SwipeNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-hide indicator after 5 seconds
  useEffect(() => {
    if (showIndicator) {
      timeoutRef.current = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showIndicator]);

  // Reset indicator on route change
  useEffect(() => {
    setShowIndicator(true);
    setIsOpen(false);
  }, [pathname]);

  // Handle swipe gestures
  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Swipe from right edge to open
    if (offset.x < -100 && velocity.x < -500) {
      setIsOpen(true);
    }
    // Swipe right to close
    else if (offset.x > 100 && velocity.x > 500) {
      setIsOpen(false);
    }
  };

  const closeNavigation = () => {
    setIsOpen(false);
  };

  const toggleNavigation = () => {
    setIsOpen(!isOpen);
    setShowIndicator(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Swipe indicator */}
      <AnimatePresence>
        {showIndicator && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="swipe-indicator"
          />
        )}
      </AnimatePresence>

      {/* Menu button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleNavigation}
          variant="ghost"
          size="icon"
          className="glass-button"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content with swipe detection */}
      <motion.div
        className="swipe-area min-h-screen"
        onPan={handleSwipe}
        onTap={() => isOpen && closeNavigation()}
      >
        {children}
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-nav-overlay"
            onClick={closeNavigation}
          />
        )}
      </AnimatePresence>

      {/* Side Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-nav"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <AstralLogo className="h-8 w-8" />
                  <span className="font-bold text-lg text-gradient">AstralCore</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    onClick={closeNavigation}
                    variant="ghost"
                    size="icon"
                    className="glass-button"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {navigationItems.map((section, sectionIndex) => (
                  <motion.div
                    key={section.section}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3">
                      {section.section}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const isActive = pathname === item.href;
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                          >
                            <Link href={item.href} onClick={closeNavigation}>
                              <div
                                className={`
                                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 touch-feedback
                                  ${isActive 
                                    ? 'bg-primary/20 text-primary-foreground border border-primary/30' 
                                    : 'hover:bg-muted/50 glass-button'
                                  }
                                `}
                              >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                                <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50">
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Swipe ← to close navigation
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-hides in 5 seconds
                  </p>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SwipeNavigation;
