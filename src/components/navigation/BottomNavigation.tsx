"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  TrendingUp,
  MessageSquare,
  User,
  Wallet
} from 'lucide-react';
import { AstralLogo } from '@/components/icons/astral-logo';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { 
    href: '/dashboard', 
    label: 'Home', 
    icon: Home, 
    color: 'text-blue-500',
    activeColor: 'bg-blue-500/20 border-blue-500/30'
  },
  { 
    href: '/dashboard/portfolio', 
    label: 'Portfolio', 
    icon: Wallet, 
    color: 'text-purple-500',
    activeColor: 'bg-purple-500/20 border-purple-500/30'
  },
  { 
    href: '/dashboard/trading', 
    label: 'CORE', 
    icon: AstralLogo, 
    isCenter: true,
    color: 'text-primary',
    activeColor: 'bg-primary border-primary'
  },
  { 
    href: '/dashboard/chat', 
    label: 'Chat', 
    icon: MessageSquare, 
    color: 'text-green-500',
    activeColor: 'bg-green-500/20 border-green-500/30'
  },
  { 
    href: '/dashboard/profile', 
    label: 'Profile', 
    icon: User, 
    color: 'text-orange-500',
    activeColor: 'bg-orange-500/20 border-orange-500/30'
  },
];

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 md:hidden',
        'glass-nav border-t border-border/30 safe-bottom',
        className
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Link href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[60px] relative',
                    item.isCenter
                      ? 'absolute -top-6 left-1/2 -translate-x-1/2'
                      : ''
                  )}
                >
                  {/* Center item special styling */}
                  {item.isCenter ? (
                    <div className={cn(
                      'relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
                      isActive
                        ? 'bg-primary shadow-lg shadow-primary/50 scale-110'
                        : 'glass border border-border/50 hover:border-primary/50'
                    )}>
                      <Icon className={cn(
                        'transition-all duration-200',
                        isActive ? 'h-8 w-8 text-primary-foreground' : 'h-7 w-7 text-primary'
                      )} />
                      
                      {/* Pulse animation for center item */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/30"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  ) : (
                    /* Regular items */
                    <div className={cn(
                      'relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                      isActive
                        ? `glass ${item.activeColor}`
                        : 'hover:bg-muted/50'
                    )}>
                      <Icon className={cn(
                        'h-6 w-6 transition-all duration-200',
                        isActive ? item.color : 'text-muted-foreground'
                      )} />
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="bottomActiveIndicator"
                          className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/20 to-transparent"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  )}

                  {/* Label */}
                  <span className={cn(
                    'text-xs font-medium transition-all duration-200 mt-1',
                    item.isCenter && 'mt-3',
                    isActive ? item.color : 'text-muted-foreground'
                  )}>
                    {item.label}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && !item.isCenter && (
                    <motion.div
                      layoutId="bottomDot"
                      className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>


      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent pointer-events-none" />
    </motion.nav>
  );
}
