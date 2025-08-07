'use client';

import * as React from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Home,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  MessageCircle,
  UserPlus,
  Trophy,
  User,
  Shield,
  Mail,
  Bell,
  Info,
  Gift,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Sparkles,
  Zap,
  Crown,
  Gem,
  Lock
} from 'lucide-react';
import { AstralLogo } from '@/components/icons/astral-logo';

interface NavigationItem {
  href: string;
  label: string;
  icon: any;
  description?: string;
  badge?: string;
  isNew?: boolean;
  isLocked?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface SwipeableNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  wallet?: any;
  rank?: any;
  tier?: any;
}

export function SwipeableNavigation({ 
  isOpen, 
  onClose, 
  user, 
  wallet, 
  rank, 
  tier 
}: SwipeableNavigationProps) {
  const pathname = usePathname();
  const [dragStarted, setDragStarted] = React.useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-300, 0], [0, 1]);
  const backdropOpacity = useTransform(x, [-300, 0], [0, 0.5]);

  const navigationSections: NavigationSection[] = [
    {
      title: 'Core Features',
      items: [
        { href: '/dashboard', label: 'Home', icon: Home, description: 'Dashboard overview' },
        { href: '/dashboard/market', label: 'Market', icon: TrendingUp, description: 'Live market data' },
        { href: '/dashboard/trading', label: 'AI CORE', icon: AstralLogo, description: 'AI Trading Bot', isNew: true },
      ]
    },
    {
      title: 'Trading',
      items: [
        { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownCircle, description: 'Fund account' },
        { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpCircle, description: 'Withdraw funds' },
      ]
    },
    {
      title: 'Community',
      items: [
        { href: '/dashboard/chat', label: 'Chat', icon: MessageCircle, description: 'Community chat' },
        { href: '/dashboard/squad', label: 'Squad', icon: Users, description: 'Referral system' },
        { href: '/dashboard/invite', label: 'Invite', icon: UserPlus, description: 'Invite friends', badge: '25% Bonus' },
        { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy, description: 'Claim rewards' },
      ]
    },
    {
      title: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: User, description: 'Manage profile' },
        { href: '/dashboard/security', label: 'Security', icon: Shield, description: 'Account security' },
        { href: '/dashboard/inbox', label: 'Messages', icon: Mail, description: 'Notifications' },
      ]
    },
    {
      title: 'Platform',
      items: [
        { href: '/dashboard/promotions', label: 'Promotions', icon: Gift, description: 'Special offers', isNew: true },
        { href: '/dashboard/trading-info', label: 'VIP Tiers', icon: Star, description: 'Tier benefits' },
        { href: '/dashboard/support', label: 'Support', icon: Bell, description: 'Get help' },
        { href: '/dashboard/about', label: 'About', icon: Info, description: 'Platform info' },
      ]
    }
  ];

  const handleDragStart = () => {
    setDragStarted(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setDragStarted(false);
    
    if (info.offset.x < -100) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  const userEmail = user?.email || 'user@example.com';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const username = wallet?.profile?.username || user?.username || 'User';

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            style={{ opacity: backdropOpacity }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.div
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: -350, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ x, opacity }}
            className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="absolute top-4 right-4 w-1 h-12 bg-white/20 rounded-full" />
            
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10"
                  >
                    <AstralLogo className="h-8 w-8 text-purple-400" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      AstralCore
                    </h1>
                    <p className="text-xs text-slate-400">Quantum Trading</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* User Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-12 w-12 border-2 border-purple-400/30">
                    <AvatarImage
                      src={wallet?.profile?.avatarUrl}
                      alt={username}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-white truncate">{username}</p>
                      <Sparkles className="h-4 w-4 text-purple-400" />
                    </div>
                    <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                  </div>
                </div>
                
                {/* Rank and Tier */}
                <div className="flex space-x-2">
                  {rank && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1.5 border-purple-400/30 bg-purple-500/10 text-purple-300",
                        rank.className
                      )}
                    >
                      <Crown className="h-3 w-3" />
                      <span className="text-xs">{rank.name}</span>
                    </Badge>
                  )}
                  {tier && (
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1.5 border-pink-400/30 bg-pink-500/10 text-pink-300"
                    >
                      <Gem className="h-3 w-3" />
                      <span className="text-xs">{tier.name}</span>
                    </Badge>
                  )}
                </div>

                {/* Balance */}
                {wallet?.balances && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Portfolio Value</span>
                      <span className="text-sm font-bold text-white">
                        ${(wallet.balances.usdt || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Navigation Sections */}
            <div className="p-4 space-y-6">
              {navigationSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + sectionIndex * 0.05 }}
                >
                  <h3 className="mb-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-1">
                    {section.items.map((item, itemIndex) => {
                      const isActive = pathname === item.href;
                      const IconComponent = item.icon;
                      
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + sectionIndex * 0.05 + itemIndex * 0.02 }}
                        >
                          <Link
                            href={item.href}
                            onClick={handleLinkClick}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                              isActive
                                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30"
                                : "hover:bg-white/5 text-slate-300 hover:text-white"
                            )}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeMobileNav"
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            
                            <div className="relative z-10 flex items-center space-x-3 w-full">
                              <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                isActive 
                                  ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30" 
                                  : "bg-white/5 group-hover:bg-white/10"
                              )}>
                                <IconComponent className={cn(
                                  "h-4 w-4",
                                  item.label === 'AI CORE' && "h-5 w-5"
                                )} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium truncate">{item.label}</p>
                                  {item.isNew && (
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5">
                                      NEW
                                    </Badge>
                                  )}
                                  {item.isLocked && (
                                    <Lock className="h-3 w-3 text-slate-400" />
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-slate-400 truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              
                              {item.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              
                              <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-60 transition-opacity" />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 border-t border-white/10 mt-auto"
            >
              <div className="space-y-2">
                <Link
                  href="/dashboard/profile"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </Link>
                
                <button
                  onClick={() => {
                    // Handle logout
                    onClose();
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-slate-300 hover:text-red-400 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>

              {/* Version Info */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center">
                  AstralCore v2.0.0
                </p>
                <p className="text-xs text-slate-500 text-center">
                  Quantum Trading Platform
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
