'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ModernSidebar } from '@/components/ui/modern-sidebar';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { MobileNotifications } from '@/components/ui/mobile-notifications';
import { cn } from '@/lib/utils';

// Icons
import {
  Menu,
  X,
  Search,
  Bell,
  Settings,
  User,
  Globe,
  Zap,
  TrendingUp,
  Shield,
  ChevronDown
} from 'lucide-react';

// Mock data - replace with actual user context
const mockUser = {
  name: 'John Doe',
  email: 'user@astralcore.io',
  avatar: undefined,
  country: '🇺🇸'
};

const mockRank = {
  name: 'Diamond',
  icon: Shield,
  className: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
};

const mockTier = {
  name: 'VIP Pro',
  icon: Zap,
  className: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
};

const mockBalance = {
  total: 12546.89,
  currency: 'USDT'
};

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
}

export function ModernDashboardLayout({ children }: ModernDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = async () => {
    // Implement logout logic
    router.push('/login');
  };

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/trading') return 'CORE AI Trading';
    
    return lastSegment
      ? lastSegment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      : 'Dashboard';
  };

  const getPageIcon = () => {
    if (pathname.includes('trading')) return <Zap className="h-5 w-5 text-primary" />;
    if (pathname.includes('market')) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (pathname.includes('profile')) return <User className="h-5 w-5 text-blue-500" />;
    return <Globe className="h-5 w-5 text-muted-foreground" />;
  };

  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + segments.slice(0, index + 1).join('/'),
      current: index === segments.length - 1
    }));
  }, [pathname]);

  const quickActions = [
    {
      label: 'Start Trading',
      href: '/dashboard/trading',
      icon: Zap,
      variant: 'default' as const,
      className: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
    },
    {
      label: 'Deposit',
      href: '/dashboard/deposit',
      icon: TrendingUp,
      variant: 'outline' as const
    },
    {
      label: 'View Rewards',
      href: '/dashboard/rewards',
      icon: Shield,
      variant: 'outline' as const
    }
  ];

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <ModernSidebar
            user={mockUser}
            rank={mockRank}
            tier={mockTier}
            balance={mockBalance}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute left-0 top-0 h-full w-80 max-w-[80vw]"
              >
                <ModernSidebar
                  user={mockUser}
                  rank={mockRank}
                  tier={mockTier}
                  balance={mockBalance}
                  onLogout={handleLogout}
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="flex-shrink-0 h-16 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 h-full">
              {/* Left side */}
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden h-8 w-8"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Page title and breadcrumbs */}
                <div className="flex items-center gap-3">
                  {getPageIcon()}
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                          {index > 0 && <span>/</span>}
                          <span className={crumb.current ? 'text-primary' : ''}>
                            {crumb.name}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 text-sm bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Mobile search toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="lg:hidden h-8 w-8"
                >
                  <Search className="h-4 w-4" />
                </Button>

                {/* Rank and Tier badges */}
                <div className="hidden sm:flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={mockRank.className}>
                        <mockRank.icon className="h-3 w-3 mr-1" />
                        {mockRank.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Account Rank</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={mockTier.className}>
                        <mockTier.icon className="h-3 w-3 mr-1" />
                        {mockTier.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>VIP Tier</TooltipContent>
                  </Tooltip>
                </div>

                {/* Balance display */}
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-foreground">
                    ${mockBalance.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{mockBalance.currency}</div>
                </div>

                {/* Notifications */}
                <NotificationBell />

                {/* Theme switcher */}
                <ThemeSwitcher />

                {/* User menu */}
                <div className="relative">
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="text-xs">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">
                      {mockUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile search bar */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden border-t border-border/50 p-4 bg-background/95"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search navigation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-1 top-1/2 h-8 w-8 transform -translate-y-1/2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Quick Actions Bar */}
          <div className="flex-shrink-0 bg-background/50 border-b border-border/30 px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant}
                    size="sm"
                    asChild
                    className={cn("flex-shrink-0", action.className)}
                  >
                    <a href={action.href} className="flex items-center gap-2">
                      <action.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{action.label}</span>
                    </a>
                  </Button>
                ))}
              </div>

              {/* Status indicators */}
              <div className="hidden lg:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-muted-foreground">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-muted-foreground">AI Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-secondary/30">
            <div className="container mx-auto p-4 lg:p-6 pb-20 md:pb-6">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around z-40">
            {[
              { href: '/dashboard', icon: Globe, label: 'Home' },
              { href: '/dashboard/trading', icon: Zap, label: 'CORE' },
              { href: '/dashboard/market', icon: TrendingUp, label: 'Market' },
              { href: '/dashboard/profile', icon: User, label: 'Profile' }
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors',
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  {item.label === 'CORE' ? (
                    <div className="relative -top-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <item.icon className="h-5 w-5" />
                  )}
                  <span className={cn(item.label === 'CORE' && 'mt-2')}>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Mobile Notifications */}
        <div className="md:hidden fixed bottom-20 right-4 z-50">
          <MobileNotifications />
        </div>
      </div>
    </TooltipProvider>
  );
}
