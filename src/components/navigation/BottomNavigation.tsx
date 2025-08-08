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
  Wallet,
  PlusCircle
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
        'glass-nav border-t border-border/30 safe-bottom rounded-t-3xl',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-around px-3 py-1.5">
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
                    'flex flex-col items-center justify-center transition-all duration-200 relative',
                    item.isCenter
                      ? 'absolute -top-8 left-1/2 -translate-x-1/2 p-3'
                      : 'p-2 min-h-[50px]'
                  )}
                >
                  {/* Center item special styling */}
                  {item.isCenter ? (
                    <div className={cn(
                      'relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl',
                      isActive
                        ? 'bg-primary shadow-lg shadow-primary/60 scale-110'
                        : 'backdrop-blur-xl bg-white/10 border-2 border-white/20 hover:border-primary/50 hover:bg-primary/10'
                    )}>
                      <Icon className={cn(
                        'transition-all duration-200',
                        isActive ? 'h-9 w-9 text-primary-foreground' : 'h-8 w-8 text-primary'
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
                      'relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200',
                      isActive
                        ? `backdrop-blur-sm ${item.activeColor} border border-white/20`
                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                    )}>
                      <Icon className={cn(
                        'h-5 w-5 transition-all duration-200',
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
                    'text-xs font-medium transition-all duration-200',
                    item.isCenter ? 'mt-2' : 'mt-1',
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

      {/* Quick action button overlay */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-1 right-3"
      >
        <Link href="/dashboard/deposit">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="w-7 h-7 rounded-full backdrop-blur-sm border border-green-500/30 bg-green-500/20 flex items-center justify-center group shadow-lg"
          >
            <PlusCircle className="h-3.5 w-3.5 text-green-500 group-hover:text-green-400 transition-colors" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/20 to-transparent pointer-events-none rounded-t-3xl" />
    </motion.nav>
  );
}
