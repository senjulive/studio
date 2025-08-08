"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
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
  const [isVisible, setIsVisible] = useState(false); // Start hidden
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-hide after 3 seconds of inactivity
  useEffect(() => {
    if (isExpanded || isVisible) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
        setIsVisible(false);
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isExpanded, isVisible]);

  // Handle swipe gestures (simplified for now)
  const handlePan = () => {
    // Simplified implementation
    setIsVisible(true);
    setIsExpanded(true);
  };

  // Detect swipe from screen edge
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth - 30) { // 30px from right edge
        setIsVisible(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth - 30) { // 30px from right edge
        setIsVisible(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setIsVisible(true);
  };

  return (
    <TooltipProvider>
      <motion.div
        ref={containerRef}
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed right-2 top-1/2 -translate-y-1/2 z-40"
        drag="x"
        dragConstraints={{ left: -100, right: 50 }}
        dragElastic={0.1}
        onPan={handlePan}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="relative backdrop-blur-xl bg-background/20 border border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          whileHover={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
          }}
        >
          {/* Toggle Button */}
          <div className="flex items-center justify-center mb-2">
            <Button
              onClick={toggleExpanded}
              variant="ghost"
              size="icon"
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300 w-9 h-9"
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
                                relative w-11 h-11 group transition-all duration-300
                                backdrop-blur-sm border border-white/10 rounded-2xl
                                hover:bg-white/10 hover:border-white/20 hover:scale-105
                                ${isActive
                                  ? 'bg-primary/20 border-primary/30 shadow-lg shadow-primary/20'
                                  : 'bg-white/5 hover:bg-white/10'
                                }
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
                      className="relative w-9 h-9 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
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
                      className="w-9 h-9 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
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
                      className="w-9 h-9 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
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
        </motion.div>

        {/* Edge indicator for swipe */}
        {!isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-30"
          >
            <motion.div
              className="w-1 h-12 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40 rounded-l-full"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scaleY: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
