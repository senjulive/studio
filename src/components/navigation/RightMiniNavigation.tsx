"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Bell, 
  MessageSquare, 
  Settings, 
  User, 
  Wallet,
  TrendingUp,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const quickActions = [
  { href: '/dashboard/inbox', icon: Bell, label: 'Notifications', color: 'text-blue-500' },
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat', color: 'text-green-500' },
  { href: '/dashboard', icon: Wallet, label: 'Wallet', color: 'text-purple-500' },
  { href: '/dashboard/trading', icon: TrendingUp, label: 'Trading', color: 'text-orange-500' },
  { href: '/dashboard/security', icon: Shield, label: 'Security', color: 'text-red-500' },
  { href: '/dashboard/support', icon: HelpCircle, label: 'Support', color: 'text-cyan-500' },
  { href: '/dashboard/profile', icon: User, label: 'Profile', color: 'text-indigo-500' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings', color: 'text-gray-500' },
];

interface RightMiniNavigationProps {
  notificationCount?: number;
}

export function RightMiniNavigation({ notificationCount = 0 }: RightMiniNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Auto-hide after 5 seconds of inactivity
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Show/hide based on scroll or user interaction
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up, hide when scrolling down significantly
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 100) {
        setIsVisible(false);
        setIsExpanded(false);
      }
      
      lastScrollY = currentScrollY;
      
      // Show temporarily when scrolling stops
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setIsVisible(true);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ 
          x: isVisible ? 0 : 100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
      >
        <div className="glass-nav rounded-2xl p-2 shadow-lg">
          {/* Toggle Button */}
          <div className="flex items-center justify-center mb-2">
            <Button
              onClick={toggleExpanded}
              variant="ghost"
              size="icon"
              className="glass-button w-8 h-8"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </motion.div>
            </Button>
          </div>

          {/* Navigation Items */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {quickActions.map((action, index) => {
                  const isActive = pathname === action.href;
                  const Icon = action.icon;
                  
                  return (
                    <motion.div
                      key={action.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={action.href}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`
                                relative w-10 h-10 glass-button group
                                ${isActive ? 'bg-primary/20 border border-primary/30' : ''}
                              `}
                            >
                              <Icon className={`h-5 w-5 transition-all duration-200 group-hover:scale-110 ${
                                isActive ? 'text-primary' : action.color
                              }`} />
                              
                              {/* Notification badge for inbox */}
                              {action.href === '/dashboard/inbox' && notificationCount > 0 && (
                                <Badge 
                                  variant="destructive" 
                                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                                >
                                  {notificationCount > 9 ? '9+' : notificationCount}
                                </Badge>
                              )}
                              
                              {/* Active indicator */}
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute inset-0 bg-primary/10 rounded-lg"
                                  transition={{ duration: 0.2 }}
                                />
                              )}
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="glass border-border/50">
                          <p>{action.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed state - show only important icons */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {/* Notification icon with badge */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/inbox">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative w-8 h-8 glass-button"
                    >
                      <Bell className="h-4 w-4 text-blue-500" />
                      {notificationCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-3 w-3 p-0 text-xs flex items-center justify-center"
                        >
                          {notificationCount > 9 ? '!' : notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" className="glass border-border/50">
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>

              {/* Chat icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/chat">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 glass-button"
                    >
                      <MessageSquare className="h-4 w-4 text-green-500" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" className="glass border-border/50">
                  <p>Chat</p>
                </TooltipContent>
              </Tooltip>

              {/* Trading icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/dashboard/trading">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 glass-button"
                    >
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" className="glass border-border/50">
                  <p>Trading</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </div>

        {/* Expand hint */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
            className="absolute -left-8 top-1/2 -translate-y-1/2"
          >
            <div className="w-2 h-8 bg-primary/30 rounded-full animate-pulse" />
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
