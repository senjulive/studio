'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { AstralLogo } from '@/components/icons/astral-logo';
import { FuturisticLoading } from '@/components/ui/futuristic-loading';
import { EnhancedThemeToggle } from '@/components/ui/enhanced-theme-toggle';
import { UserProvider } from '@/contexts/UserContext';
import { getOrCreateWallet, type WalletData } from '@/lib/wallet';
import { getUserRank, getCurrentTier } from '@/lib/ranks';
import { type TierSetting as TierData, getBotTierSettings } from '@/lib/tiers';
import { countries } from '@/lib/countries';
import { tierIcons, tierClassNames } from '@/lib/settings';
import { motion, AnimatePresence } from 'framer-motion';

// Import icons
import { 
  Home, 
  TrendingUp, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Users, 
  MessageCircle, 
  UserPlus, 
  Trophy, 
  User, 
  Shield, 
  Mail, 
  Bell, 
  Settings, 
  Info, 
  Download, 
  LogOut, 
  Menu, 
  X,
  Star,
  Zap,
  Gift,
  Target,
  Lock,
  Crown
} from 'lucide-react';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

const rankIcons: Record<string, any> = {
  RecruitRankIcon,
  BronzeRankIcon,
  SilverRankIcon,
  GoldRankIcon,
  PlatinumRankIcon,
  DiamondRankIcon,
  Lock,
};

// Mock user object
const mockUser = {
  id: 'mock-user-123',
  email: 'user@example.com',
};

interface NavItem {
  href: string;
  label: string;
  icon: any;
  description?: string;
  badge?: string;
  download?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any | null>(null);
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [tierSettings, setTierSettings] = React.useState<TierData[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isModerator, setIsModerator] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  const fetchWalletAndTiers = React.useCallback(async (userId: string) => {
    try {
      const [walletData, tiers] = await Promise.all([
        getOrCreateWallet(userId),
        getBotTierSettings()
      ]);
      setWallet(walletData);
      setTierSettings(tiers);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  }, []);

  React.useEffect(() => {
    const initializeUser = async () => {
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const loggedInEmail = sessionStorage.getItem('loggedInEmail') || mockUser.email;
      const currentUser = { ...mockUser, email: loggedInEmail };

      setUser(currentUser);
      setIsAdmin(loggedInEmail === 'admin@astralcore.io');
      setIsModerator(loggedInEmail === 'moderator@astralcore.io');

      if (currentUser.id) {
        await fetchWalletAndTiers(currentUser.id);
      }
      
      setLoadingProgress(100);
      setTimeout(() => {
        setIsInitializing(false);
      }, 500);
    };
    initializeUser();
  }, [fetchWalletAndTiers]);

  const menuConfig: NavSection[] = React.useMemo(() => {
    const baseConfig: NavSection[] = [
      {
        title: 'Overview',
        items: [
          { href: '/dashboard', label: 'Home', icon: Home, description: 'Dashboard overview' },
          { href: '/dashboard/market', label: 'Market', icon: TrendingUp, description: 'Market analysis' },
          { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo, description: 'AI Trading bot' },
        ],
      },
      {
        title: 'Trading',
        items: [
          { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownCircle, description: 'Fund your account' },
          { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpCircle, description: 'Withdraw funds' },
        ],
      },
      {
        title: 'Community',
        items: [
          { href: '/dashboard/chat', label: 'Chat', icon: MessageCircle, description: 'Community chat' },
          { href: '/dashboard/squad', label: 'Squad', icon: Users, description: 'Your referral team' },
          { href: '/dashboard/invite', label: 'Invite', icon: UserPlus, description: 'Invite friends' },
          { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy, description: 'Claim rewards' },
        ],
      },
      {
        title: 'Account',
        items: [
          { href: '/dashboard/profile', label: 'Profile', icon: User, description: 'Manage profile' },
          { href: '/dashboard/security', label: 'Security', icon: Shield, description: 'Security settings' },
          { href: '/dashboard/inbox', label: 'Inbox', icon: Mail, description: 'Messages & notifications' },
        ],
      },
      {
        title: 'Platform',
        items: [
          { href: '/dashboard/promotions', label: 'Promotions', icon: Gift, description: 'Special offers' },
          { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: Star, description: 'VIP information' },
          { href: '/dashboard/support', label: 'Support', icon: Bell, description: 'Get help' },
          { href: '/dashboard/about', label: 'About', icon: Info, description: 'Platform info' },
        ],
      },
    ];

    if (isAdmin || isModerator) {
      const adminItems: NavItem[] = [];
      if (isAdmin) {
        adminItems.push({ href: '/admin', label: 'Admin Panel', icon: Shield, description: 'System administration' });
      }
      if (isModerator) {
        adminItems.push({ href: '/moderator', label: 'Moderator Panel', icon: Shield, description: 'Content moderation' });
      }
      baseConfig.push({
        title: 'Admin Tools',
        items: adminItems,
      });
    }

    return baseConfig;
  }, [isAdmin, isModerator]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      sessionStorage.removeItem('loggedInEmail');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on error
      sessionStorage.removeItem('loggedInEmail');
      router.push('/');
    }
  };

  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const bottomNavItems = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
    { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const getPageTitle = () => {
    const currentPath = pathname;
    if (currentPath === '/dashboard/trading') return 'Astral Core Trading';
    if (currentPath === '/dashboard') return 'Dashboard';
    
    const currentItem = menuConfig.flatMap(g => g.items).find((item) => {
      return currentPath.startsWith(item.href) && item.href !== '/dashboard' || currentPath === item.href;
    });
    
    return currentItem?.label || currentPath.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  };

  const isClient = typeof window !== 'undefined';
  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || Lock;
  const tier = getCurrentTier(totalBalance, tierSettings);
  const TierIcon = tier ? tierIcons[tier.id] : null;
  const tierClassName = tier ? tierClassNames[tier.id] : null;
  const userCountry = countries.find(c => c.name === wallet?.profile?.country);

  if (isInitializing) {
    return (
      <FuturisticLoading 
        message="Loading your AstralCore dashboard" 
        progress={loadingProgress}
        showProgress={true}
      />
    );
  }

  return (
    <UserProvider value={{ user: user as any, wallet, rank, tier, tierSettings }}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        {/* Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: isSidebarOpen ? 0 : -300 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border/50 z-50 lg:translate-x-0 lg:static lg:z-auto overflow-y-auto"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <AstralLogo className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    AstralCore
                  </h1>
                  <p className="text-xs text-muted-foreground">Quantum Trading</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage
                  src={wallet?.profile?.avatarUrl}
                  alt={wallet?.profile?.username || 'User'}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold truncate">
                    {wallet?.profile?.username || 'User'}
                  </p>
                  {userCountry && <span className="text-lg">{userCountry.flag}</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            
            {/* Rank and Tier Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={cn("flex items-center gap-1.5", rank.className)}>
                <RankIcon className="h-4 w-4" />
                <span className="text-xs">{rank.name}</span>
              </Badge>
              {tier && TierIcon && tierClassName && (
                <Badge variant="outline" className={cn("flex items-center gap-1.5", tierClassName)}>
                  <TierIcon className="h-4 w-4" />
                  <span className="text-xs">{tier.name}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-6">
            {menuConfig.map((section, sectionIndex) => (
              <div key={section.title}>
                <h3 className="mb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = isClient ? pathname === item.href : false;
                    const IconComponent = item.icon;
                    
                    return (
                      <TooltipProvider key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                              )}
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeNav"
                                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                              <div className="relative z-10 flex items-center space-x-3 w-full">
                                <IconComponent className={cn(
                                  "h-5 w-5 flex-shrink-0",
                                  item.label === 'CORE' && "h-6 w-6"
                                )} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{item.label}</p>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.description || item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
                {sectionIndex < menuConfig.length - 1 && (
                  <Separator className="mt-4 bg-border/50" />
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/50 mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings & Logout</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{wallet?.profile?.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/security">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="lg:ml-80">
          {/* Top Navigation */}
          <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-3">
                  <AstralLogo className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Rank Badge (Hidden on mobile) */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5", rank.className)}>
                        <RankIcon className="h-4 w-4" />
                        <span>{rank.name}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Account Rank</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Tier Badge (Hidden on mobile) */}
                  {tier && TierIcon && tierClassName && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5", tierClassName)}>
                          <TierIcon className="h-4 w-4" />
                          <span>{tier.name}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>VIP CORE Tier</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>

                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/inbox">
                    <Mail className="h-5 w-5" />
                  </Link>
                </Button>
                <NotificationBell />
                <EnhancedThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-6 pb-24 lg:pb-6 min-h-[calc(100vh-4rem)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </main>
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className="fixed bottom-0 left-0 right-0 h-18 bg-background/90 backdrop-blur-xl border-t border-border/50 lg:hidden z-40">
          <div className="flex items-center justify-around h-full px-4">
            {bottomNavItems.map((item, index) => {
              const isActive = isClient && pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-all duration-200 min-w-0 flex-1',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label === 'CORE' ? (
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "p-3 rounded-full transition-all duration-200",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50" 
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <IconComponent className="h-6 w-6" />
                      </motion.div>
                      {isActive && (
                        <motion.div
                          layoutId="bottomActiveIndicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        />
                      )}
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center space-y-1"
                    >
                      <IconComponent className="h-5 w-5" />
                      {isActive && (
                        <motion.div
                          layoutId="bottomIndicator"
                          className="w-1 h-1 bg-primary rounded-full"
                        />
                      )}
                    </motion.div>
                  )}
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </UserProvider>
  );
}
