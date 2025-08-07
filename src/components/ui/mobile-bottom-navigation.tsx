'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  TrendingUp,
  Trophy,
  User,
  MessageCircle,
  Plus,
  Zap,
  Bell,
  Sparkles
} from 'lucide-react';
import { AstralLogo } from '@/components/icons/astral-logo';

interface NavigationItem {
  href: string;
  label: string;
  icon: any;
  isCenter?: boolean;
  badge?: string;
  isNew?: boolean;
  notification?: number;
}

interface MobileBottomNavigationProps {
  className?: string;
  onMenuToggle?: () => void;
}

export function MobileBottomNavigation({ 
  className, 
  onMenuToggle 
}: MobileBottomNavigationProps) {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const navigationItems: NavigationItem[] = [
    { 
      href: '/dashboard', 
      label: 'Home', 
      icon: Home 
    },
    { 
      href: '/dashboard/market', 
      label: 'Market', 
      icon: TrendingUp,
      isNew: true
    },
    { 
      href: '/dashboard/trading', 
      label: 'CORE', 
      icon: AstralLogo, 
      isCenter: true 
    },
    { 
      href: '/dashboard/rewards', 
      label: 'Rewards', 
      icon: Trophy,
      notification: 3
    },
    { 
      href: '/dashboard/profile', 
      label: 'Profile', 
      icon: User 
    }
  ];

  React.useEffect(() => {
    const currentIndex = navigationItems.findIndex(item => item.href === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]);

  const handleNavigation = (index: number, href: string) => {
    setActiveIndex(index);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        className
      )}
    >
      {/* Glassmorphic Background */}
      <div className="relative">
        {/* Backdrop Blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/90 to-slate-900/80 backdrop-blur-xl border-t border-white/10" />
        
        {/* Active Indicator Background */}
        <motion.div
          className="absolute top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-b-full"
          animate={{
            left: `${(activeIndex / (navigationItems.length - 1)) * 100}%`,
            width: `${100 / navigationItems.length}%`
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        />

        {/* Navigation Container */}
        <div className="relative flex items-center justify-around px-4 py-3 h-20">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            const isCenter = item.isCenter;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(index, item.href)}
                className={cn(
                  "relative flex flex-col items-center justify-center transition-all duration-300",
                  isCenter 
                    ? "transform -translate-y-2" 
                    : "flex-1",
                  "group"
                )}
              >
                {isCenter ? (
                  // Center CORE Button
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Outer Glow Ring */}
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-300",
                        isActive 
                          ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl scale-150" 
                          : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg scale-125"
                      )}
                      animate={isActive ? {
                        scale: [1.2, 1.4, 1.2],
                        opacity: [0.3, 0.5, 0.3]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Main Button */}
                    <motion.div
                      className={cn(
                        "relative p-4 rounded-full transition-all duration-300 border-2",
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 border-white/30 shadow-2xl shadow-purple-500/50"
                          : "bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-white/20 shadow-xl shadow-purple-500/30"
                      )}
                    >
                      {/* Inner Sparkle Effect */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-2 rounded-full bg-gradient-to-r from-white/20 to-white/10"
                          />
                        )}
                      </AnimatePresence>
                      
                      <IconComponent className="h-7 w-7 text-white relative z-10" />
                      
                      {/* AI Indicator */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        animate={isActive ? {
                          scale: [1, 1.2, 1],
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Active Indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                        >
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((dot) => (
                              <motion.div
                                key={dot}
                                className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: dot * 0.2
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Label */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    >
                      <span className={cn(
                        "text-xs font-bold transition-colors",
                        isActive ? "text-purple-300" : "text-slate-400"
                      )}>
                        {item.label}
                      </span>
                    </motion.div>
                  </motion.div>
                ) : (
                  // Regular Navigation Items
                  <motion.div
                    className="flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative">
                      {/* Icon Container */}
                      <motion.div
                        className={cn(
                          "p-2 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30"
                            : "bg-white/5 group-hover:bg-white/10"
                        )}
                      >
                        <IconComponent className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-purple-300" : "text-slate-400 group-hover:text-white"
                        )} />
                      </motion.div>

                      {/* Notification Badge */}
                      {item.notification && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-slate-900"
                        >
                          <span className="text-xs text-white font-bold">
                            {item.notification > 9 ? '9+' : item.notification}
                          </span>
                        </motion.div>
                      )}

                      {/* New Badge */}
                      {item.isNew && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-2 -right-2"
                        >
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-2 py-0.5">
                            <Sparkles className="h-2 w-2 text-white" />
                            <span className="text-xs text-white font-bold">NEW</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Label */}
                    <span className={cn(
                      "text-xs font-medium transition-colors truncate max-w-full",
                      isActive ? "text-purple-300" : "text-slate-400 group-hover:text-white"
                    )}>
                      {item.label}
                    </span>

                    {/* Active Indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-1"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions Floating Button */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={onMenuToggle}
            className="p-2 bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-4 w-4 text-white" />
          </motion.button>
        </motion.div>

        {/* Haptic Feedback Indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/20 rounded-t-full"
          animate={{
            scaleX: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.nav>
  );
}
