"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, ChevronRight, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Navigation items grouped by sections
const navigationSections = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Home', icon: '🏠' },
      { href: '/dashboard/portfolio', label: 'Portfolio', icon: '💼' },
      { href: '/dashboard/market', label: 'Market', icon: '📈' },
      { href: '/dashboard/trading', label: 'CORE Bot', icon: '🤖' },
    ]
  },
  {
    title: 'Transactions',
    items: [
      { href: '/dashboard/deposit', label: 'Deposit', icon: '💰' },
      { href: '/dashboard/withdraw', label: 'Withdraw', icon: '💸' },
      { href: '/dashboard/history', label: 'History', icon: '📋' },
      { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
    ]
  },
  {
    title: 'Community',
    items: [
      { href: '/dashboard/chat', label: 'Chat', icon: '💬' },
      { href: '/dashboard/squad', label: 'Squad', icon: '👥' },
      { href: '/dashboard/invite', label: 'Invite', icon: '🎯' },
      { href: '/dashboard/rewards', label: 'Rewards', icon: '🎁' },
    ]
  },
  {
    title: 'Platform',
    items: [
      { href: '/dashboard/promotions', label: 'Promotions', icon: '🎉' },
      { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: '🏆' },
      { href: '/dashboard/support', label: 'Support', icon: '🆘' },
      { href: '/dashboard/about', label: 'About', icon: 'ℹ️' },
    ]
  }
];

interface LeftSideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  wallet?: any;
  rank?: any;
  tier?: any;
}

export function LeftSideNavigation({ 
  isOpen, 
  onClose, 
  user, 
  wallet, 
  rank, 
  tier 
}: LeftSideNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInEmail');
    router.push('/');
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 glass-nav z-50 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <AstralLogo className="h-8 w-8" />
            <span className="font-bold text-xl text-gradient">AstralCore</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="glass-button lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        {user && wallet && (
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={wallet?.profile?.avatarUrl}
                  alt={wallet?.profile?.username || 'User'}
                />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">
                  {wallet?.profile?.username || 'User'}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            
            {/* Rank and Tier Badges */}
            <div className="flex flex-wrap gap-2">
              {rank && (
                <Badge variant="outline" className={cn("text-xs", rank.className)}>
                  {rank.name}
                </Badge>
              )}
              {tier && (
                <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30">
                  {tier.name}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="space-y-2"
              >
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      >
                        <Link href={item.href} onClick={onClose}>
                          <div
                            className={cn(
                              'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                              isActive 
                                ? 'bg-primary/20 text-primary-foreground border border-primary/30' 
                                : 'hover:bg-muted/50 glass-button'
                            )}
                          >
                            <span className="text-lg group-hover:scale-110 transition-transform">
                              {item.icon}
                            </span>
                            <span className="font-medium flex-1">{item.label}</span>
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-all duration-200",
                              isActive ? "opacity-100 translate-x-1" : "opacity-50 group-hover:opacity-100 group-hover:translate-x-1"
                            )} />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <Link href="/dashboard/profile">
            <Button variant="ghost" className="w-full justify-start glass-button">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start glass-button">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button 
            onClick={handleLogout}
            variant="destructive" 
            className="w-full justify-start"
          >
            <span className="mr-2">🚪</span>
            Logout
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
