"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeftSideNavigation } from '@/components/navigation/LeftSideNavigation';
import { RightMiniNavigation } from '@/components/navigation/RightMiniNavigation';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: any;
  wallet?: any;
  rank?: any;
  tier?: any;
}

export function DashboardLayoutWithNavigation({ 
  children, 
  user, 
  wallet, 
  rank, 
  tier 
}: DashboardLayoutProps) {
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock count

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  // Close navigation on route change
  useEffect(() => {
    setIsLeftNavOpen(false);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            setIsLeftNavOpen(!isLeftNavOpen);
            break;
        }
      }
      if (e.key === 'Escape') {
        setIsLeftNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLeftNavOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Left Side Navigation */}
      <LeftSideNavigation
        isOpen={isLeftNavOpen}
        onClose={() => setIsLeftNavOpen(false)}
        user={user}
        wallet={wallet}
        rank={rank}
        tier={tier}
      />

      {/* Main Content Area */}
      <div className={cn(
        'transition-all duration-300 min-h-screen',
        'lg:ml-80', // Make space for left sidebar on desktop
        'pb-20 md:pb-0' // Space for bottom nav on mobile
      )}>
        {/* Top Mobile Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 md:hidden"
        >
          <div className="glass-nav border-b border-border/30 px-4 py-3 safe-top">
            <div className="flex items-center justify-between">
              {/* Left section */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsLeftNavOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="glass-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {user && wallet && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={wallet?.profile?.avatarUrl}
                        alt={wallet?.profile?.username || 'User'}
                      />
                      <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">
                        {wallet?.profile?.username || 'User'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right section */}
              <div className="flex items-center gap-2">
                {/* Rank and Tier badges on mobile */}
                {rank && (
                  <Badge variant="outline" className={cn("text-xs hidden sm:flex", rank.className)}>
                    {rank.name}
                  </Badge>
                )}
                {tier && (
                  <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30 hidden sm:flex">
                    {tier.name}
                  </Badge>
                )}
                
                <NotificationBell />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Desktop Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-20 hidden md:block"
        >
          <div className="glass-nav border-b border-border/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gradient">
                  Dashboard
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Desktop user info */}
                {user && wallet && (
                  <div className="flex items-center gap-3">
                    {/* Rank and Tier badges */}
                    <div className="flex items-center gap-2">
                      {rank && (
                        <Badge variant="outline" className={cn("text-sm", rank.className)}>
                          {rank.name}
                        </Badge>
                      )}
                      {tier && (
                        <Badge variant="outline" className="text-sm bg-primary/20 text-primary border-primary/30">
                          {tier.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={wallet?.profile?.avatarUrl}
                          alt={wallet?.profile?.username || 'User'}
                        />
                        <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {wallet?.profile?.username || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <NotificationBell />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Right Mini Navigation */}
      <RightMiniNavigation notificationCount={notificationCount} />

      {/* Bottom Navigation (Mobile only) */}
      <BottomNavigation />

      {/* Keyboard shortcuts info */}
      <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
        <div className="glass-card p-2">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+B</kbd> to toggle menu
          </p>
        </div>
      </div>
    </div>
  );
}
