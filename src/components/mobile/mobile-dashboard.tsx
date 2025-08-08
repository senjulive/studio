'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  Search,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  Zap,
  TrendingUp,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { MobileWalletCard } from './mobile-wallet-card';
import { 
  MobileCard, 
  MobileCardHeader, 
  MobileCardTitle, 
  MobileCardContent 
} from '@/components/ui/mobile-optimized-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useApp } from '@/contexts/AppContext';
import { useResponsive } from '@/hooks/use-responsive';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { cn } from '@/lib/utils';

interface MobileDashboardProps {
  className?: string;
}

export function MobileDashboard({ className }: MobileDashboardProps) {
  const { state, isLoading, startLoading, stopLoading } = useApp();
  const { isMobile, isTablet } = useResponsive();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pull to refresh functionality
  const refreshGestureRef = useTouchGestures({
    onSwipeDown: handleRefresh,
  }, {
    threshold: 100,
    restraint: 50,
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    startLoading('dashboard');
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    stopLoading('dashboard');
    setIsRefreshing(false);
  }

  const quickActions = [
    {
      id: 'deposit',
      title: 'Deposit',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      href: '/dashboard/deposit',
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: TrendingUp,
      color: 'from-red-500 to-pink-500',
      href: '/dashboard/withdraw',
    },
    {
      id: 'trading',
      title: 'Trading',
      icon: Zap,
      color: 'from-blue-500 to-purple-500',
      href: '/dashboard/trading',
    },
    {
      id: 'squad',
      title: 'Squad',
      icon: Users,
      color: 'from-orange-500 to-yellow-500',
      href: '/dashboard/squad',
    },
  ];

  const tradingStats = [
    {
      label: 'Active Positions',
      value: '12',
      change: '+3',
      color: 'text-green-400',
    },
    {
      label: 'Daily P&L',
      value: '+$234.50',
      change: '+12.3%',
      color: 'text-green-400',
    },
    {
      label: 'Success Rate',
      value: '89.2%',
      change: '+2.1%',
      color: 'text-blue-400',
    },
    {
      label: 'Total Trades',
      value: '1,847',
      change: '+156',
      color: 'text-purple-400',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'trade',
      title: 'BTC/USD Position Opened',
      description: 'Long position at $42,500',
      time: '5 minutes ago',
      status: 'active',
      icon: TrendingUp,
    },
    {
      id: 2,
      type: 'reward',
      title: 'Daily Bonus Claimed',
      description: '+$50 trading bonus',
      time: '2 hours ago',
      status: 'completed',
      icon: Award,
    },
    {
      id: 3,
      type: 'squad',
      title: 'Squad Milestone Reached',
      description: 'Team reached 1000 points',
      time: '4 hours ago',
      status: 'completed',
      icon: Users,
    },
  ];

  return (
    <div 
      ref={refreshGestureRef}
      className={cn('space-y-6 pb-20', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--qn-light)]">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--qn-light)]/60">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
            <Bell className="w-6 h-6 text-[var(--qn-light)]" />
            {state.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {state.unreadCount}
              </span>
            )}
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-6 h-6 text-[var(--qn-light)]" />
          </button>
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center py-4"
          >
            <LoadingSpinner size="sm" text="Refreshing..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Card */}
      <MobileWalletCard />

      {/* Quick Actions */}
      <MobileCard>
        <MobileCardHeader>
          <MobileCardTitle>Quick Actions</MobileCardTitle>
        </MobileCardHeader>
        <MobileCardContent>
          <div className={cn(
            'grid gap-3',
            isMobile ? 'grid-cols-2' : 'grid-cols-4'
          )}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={action.id}
                  href={action.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className={cn(
                    'p-3 rounded-full mb-2 bg-gradient-to-br',
                    action.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--qn-light)] group-hover:text-[var(--qn-secondary)] transition-colors">
                    {action.title}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </MobileCardContent>
      </MobileCard>

      {/* Trading Stats */}
      <MobileCard>
        <MobileCardHeader>
          <div className="flex items-center justify-between">
            <MobileCardTitle>Trading Overview</MobileCardTitle>
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={cn(
                'w-4 h-4 text-[var(--qn-secondary)]',
                isLoading('dashboard') && 'animate-spin'
              )} />
            </button>
          </div>
        </MobileCardHeader>
        <MobileCardContent>
          <div className="grid grid-cols-2 gap-4">
            {tradingStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="text-xs text-[var(--qn-light)]/60 mb-1">
                  {stat.label}
                </div>
                <div className="text-lg font-bold text-[var(--qn-light)] mb-1">
                  {stat.value}
                </div>
                <div className={cn('text-xs font-medium', stat.color)}>
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </MobileCardContent>
      </MobileCard>

      {/* Recent Activity */}
      <MobileCard>
        <MobileCardHeader>
          <div className="flex items-center justify-between">
            <MobileCardTitle>Recent Activity</MobileCardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {viewMode === 'grid' ? (
                  <List className="w-4 h-4 text-[var(--qn-secondary)]" />
                ) : (
                  <Grid3X3 className="w-4 h-4 text-[var(--qn-secondary)]" />
                )}
              </button>
            </div>
          </div>
        </MobileCardHeader>
        <MobileCardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-full bg-[var(--qn-primary)]/20">
                    <Icon className="w-4 h-4 text-[var(--qn-primary)]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--qn-light)] group-hover:text-[var(--qn-secondary)] transition-colors">
                      {activity.title}
                    </div>
                    <div className="text-xs text-[var(--qn-light)]/60 truncate">
                      {activity.description}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      activity.status === 'active' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    )}>
                      {activity.status}
                    </div>
                    <div className="text-xs text-[var(--qn-light)]/60 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <button className="w-full mt-4 p-3 rounded-lg border border-[var(--qn-primary)]/30 text-[var(--qn-primary)] hover:bg-[var(--qn-primary)]/10 transition-colors font-medium">
            View All Activity
          </button>
        </MobileCardContent>
      </MobileCard>

      {/* Loading Overlay */}
      {isLoading('dashboard') && !isRefreshing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      )}
    </div>
  );
}
