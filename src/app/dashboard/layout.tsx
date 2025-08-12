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
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { logout } from '@/lib/auth';
import * as React from 'react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Skeleton } from '@/components/ui/skeleton';

import { HomeIcon } from '@/components/icons/nav/home-icon';
import { MarketIcon } from '@/components/icons/nav/market-icon';
import { DepositIcon } from '@/components/icons/nav/deposit-icon';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { SquadIcon } from '@/components/icons/nav/squad-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { AboutIcon } from '@/components/icons/nav/about-icon';
import { DownloadIcon } from '@/components/icons/nav/download-icon';
import { SettingsIcon } from '@/components/icons/nav/settings-icon';
import { LogoutIcon } from '@/components/icons/nav/logout-icon';
import { InboxIcon } from '@/components/icons/nav/inbox-icon';
import { MessageSquare, UserPlus, Shield, Lock, Trophy, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/contexts/UserContext';
import { getOrCreateWallet, type WalletData } from '@/lib/wallet';
import { getUserRank, getCurrentTier } from '@/lib/ranks';
import { type TierSetting as TierData, getBotTierSettings } from '@/lib/tiers';
import { Badge } from '@/components/ui/badge';
import { countries } from '@/lib/countries';
import { tierIcons, tierClassNames } from '@/lib/settings';
import { PromotionIcon } from '@/components/icons/nav/promotion-icon';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AvatarUploadDialog } from '@/components/dashboard/profile-view';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
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

function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground animate-in fade-in-50">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
        <AstralLogo className="relative h-32 w-32 sm:h-40 sm:w-40 animate-float" />
      </div>
      <div className="mt-6 space-y-2 text-center">
        <p className="text-xl sm:text-2xl font-bold">Loading Your Dashboard</p>
        <p className="text-muted-foreground">Preparing quantum trading interface...</p>
        <div className="flex items-center justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
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
  const [downloadHref, setDownloadHref] = React.useState('');

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
      const loggedInEmail = sessionStorage.getItem('loggedInEmail') || mockUser.email;
      const currentUser = { ...mockUser, email: loggedInEmail };

      setUser(currentUser);
      setIsAdmin(loggedInEmail === 'admin@astralcore.io');
      setIsModerator(loggedInEmail === 'moderator@astralcore.io');

      if (currentUser.id) {
        await fetchWalletAndTiers(currentUser.id);
      }
      setIsInitializing(false);
    };
    initializeUser();
  }, [fetchWalletAndTiers]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const fileContent = `[InternetShortcut]\nURL=${window.location.origin}`;
      const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(
        fileContent
      )}`;
      setDownloadHref(dataUri);
    }
  }, []);

  const menuConfig = React.useMemo(() => {
    const baseConfig = [
      {
        title: 'Overview',
        icon: Star,
        items: [
          { href: '/dashboard', label: 'Home', icon: HomeIcon, description: 'Dashboard overview' },
          { href: '/dashboard/market', label: 'Market', icon: MarketIcon, description: 'Live market data' },
          { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo, description: 'AI Trading Bot', highlight: true },
        ],
      },
      {
        title: 'Community',
        icon: MessageSquare,
        items: [
          { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare, description: 'Public chat' },
          { href: '/dashboard/squad', label: 'Squad', icon: SquadIcon, description: 'Team trading' },
          { href: '/dashboard/invite', label: 'Invite', icon: UserPlus, description: 'Invite friends' },
          { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy, description: 'Earn rewards' },
        ],
      },
      {
        title: 'Manage',
        icon: Zap,
        items: [
          { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon, description: 'Fund account' },
          { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon, description: 'Withdraw funds' },
        ],
      },
      {
        title: 'Account',
        icon: Shield,
        items: [
          { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon, description: 'Account settings' },
          { href: '/dashboard/security', label: 'Security', icon: SettingsIcon, description: 'Security settings' },
          { href: '/dashboard/inbox', label: 'Inbox', icon: InboxIcon, description: 'Messages' },
        ],
      },
      {
        title: 'Platform',
        icon: Sparkles,
        items: [
          { href: '/dashboard/promotions', label: 'Promotions', icon: PromotionIcon, description: 'Special offers' },
          { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: Trophy, description: 'Account tiers' },
          { href: '/dashboard/support', label: 'Support', icon: SupportIcon, description: 'Get help' },
          { href: '/dashboard/about', label: 'About', icon: AboutIcon, description: 'Platform info' },
          { href: downloadHref, label: 'Download App', icon: DownloadIcon, download: 'AstralCore.url', description: 'Mobile app'},
        ],
      },
    ];

    if (isAdmin || isModerator) {
      const adminItems = [];
      if (isAdmin) {
        adminItems.push({ href: '/admin', label: 'Admin Panel', icon: Shield, description: 'Admin controls' });
      }
      if (isModerator) {
        adminItems.push({ href: '/moderator', label: 'Moderator Panel', icon: Shield, description: 'Moderator tools' });
      }
      baseConfig.push({
        title: 'Admin Tools',
        icon: Shield,
        items: adminItems,
      });
    }

    return baseConfig;
  }, [isAdmin, isModerator, downloadHref]);

  const handleLogout = async () => {
    sessionStorage.removeItem('loggedInEmail');
    await logout();
    router.push('/');
  };

  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const bottomNavItems = [
    { href: '/dashboard', label: 'Home', icon: HomeIcon },
    { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
    { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo, special: true },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
    { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
  ];

  const getPageTitle = () => {
    const currentPath = pathname;
    const simplePath = currentPath.startsWith('/dashboard') ? currentPath : `/dashboard${currentPath}`;

    if (simplePath === '/dashboard/trading') return 'Astral Core Trading';
    const currentItem = menuConfig.flatMap(g => g.items).find((item) => {
        return simplePath.startsWith(item.href) && item.href !== '/dashboard' || simplePath === item.href;
    });
     if (simplePath === '/dashboard') return 'Home';
    return currentItem
      ? currentItem.label
      : simplePath.split('/').pop()?.replace('-', ' ') || 'Home';
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
    return <DashboardLoading />;
  }
  
  return (
    <UserProvider value={{ user: user as any, wallet, rank, tier, tierSettings }}>
      <SidebarProvider>
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="border-b border-border/50 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                <AstralLogo className="relative h-10 w-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xl font-bold text-sidebar-foreground bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  AstralCore
                </span>
                <p className="text-xs text-sidebar-foreground/60">Quantum Trading</p>
              </div>
            </div>
          </SidebarHeader>

          <div className="mt-6 mb-6 px-6 space-y-4">
             <div className="flex items-center gap-3">
                  <AvatarUploadDialog 
                    onUploadSuccess={() => fetchWalletAndTiers(user.id)}
                    wallet={wallet}
                  >
                    <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      <AvatarImage
                        src={wallet?.profile?.avatarUrl}
                        alt={wallet?.profile?.username || 'User'}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </AvatarUploadDialog>

                  <div className="overflow-hidden flex-1 min-w-0">
                     <p className="font-semibold text-sidebar-foreground truncate flex items-center gap-2">
                        {wallet?.profile?.username || 'User'}
                        {userCountry && <span className="text-lg">{userCountry.flag}</span>}
                     </p>
                     <p className="text-xs text-sidebar-foreground/70 truncate">{userEmail}</p>
                  </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                 <Badge variant="outline" className={cn("text-xs py-1 px-2 flex items-center gap-1.5", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    <span>{rank.name}</span>
                 </Badge>
                 {tier && TierIcon && tierClassName && (
                  <Badge variant="outline" className={cn("text-xs py-1 px-2 flex items-center gap-1.5", tierClassName)}>
                    <TierIcon className="h-3 w-3" />
                    <span>{tier.name}</span>
                  </Badge>
                )}
              </div>

              {/* Balance display */}
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <div className="text-xs text-sidebar-foreground/60 mb-1">Total Balance</div>
                <div className="text-lg font-bold text-primary">${totalBalance.toFixed(2)}</div>
              </div>
          </div>
          
          <Separator className="bg-sidebar-border mx-6" />

          <SidebarContent className="px-3 py-4">
            <SidebarMenu className="space-y-2">
              {menuConfig.map((group, index) => (
                  <React.Fragment key={group.title}>
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                        <group.icon className="h-3 w-3" />
                        {group.title}
                      </div>
                    </div>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "rounded-xl transition-all duration-200 h-auto py-3",
                            isClient && (pathname.endsWith(item.href) && !item.download) && "bg-primary/10 border border-primary/20 text-primary"
                          )}
                        >
                          <Link href={item.href} download={item.download}>
                            <div className="flex items-center gap-3 w-full">
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-lg",
                                item.highlight ? "bg-primary/20" : "bg-sidebar-accent",
                                item.label === 'CORE' && 'p-1'
                              )}>
                                <item.icon className={cn(
                                  "h-4 w-4",
                                  item.label === 'CORE' && 'h-full w-full',
                                  item.highlight && "text-primary"
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium truncate">{item.label}</span>
                                  {item.highlight && (
                                    <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                                      AI
                                    </Badge>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-xs text-sidebar-foreground/60 truncate">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                    {index < menuConfig.length - 1 && <Separator className="my-3 bg-sidebar-border/50" />}
                  </React.Fragment>
                ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground h-auto p-3 rounded-xl hover:bg-sidebar-accent">
                   <SettingsIcon className="mr-3 h-4 w-4" />
                   <div className="flex-1 text-left">
                     <div className="font-medium">Settings</div>
                     <div className="text-xs text-sidebar-foreground/60">Account & logout</div>
                   </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {wallet?.profile?.username || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail || '...'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <ProfileIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/security">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogoutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-secondary/30">
          <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-xl px-4 lg:h-[70px] lg:px-6 sticky top-0 z-30 mobile-padding">
            <SidebarTrigger className="lg:hidden" />
            <div className="w-full flex-1">
              <h1 className="flex items-center gap-3 text-lg font-bold md:text-2xl capitalize">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                  <AstralLogo className="relative h-6 w-6" />
                </div>
                {isClient ? (
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getPageTitle()}
                  </span>
                ) : (
                  <Skeleton className="h-6 w-24" />
                )}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5 px-3 py-1", rank.className)}>
                        <RankIcon className="h-4 w-4" />
                        <span>{rank.name}</span>
                     </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Account Rank</p>
                  </TooltipContent>
                </Tooltip>
                
                 {tier && TierIcon && tierClassName && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5 px-3 py-1", tierClassName)}>
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

              <ThemeSwitcher />
              
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" asChild>
                <Link href="/dashboard/inbox">
                  <InboxIcon className="h-5 w-5" />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
              
              <NotificationBell />
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-6 pb-24 lg:pb-6 mobile-gap">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Enhanced mobile navigation */}
          <nav className="mobile-nav flex items-center justify-around z-50 md:hidden">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-all duration-200 relative haptic-light',
                  isClient && pathname.endsWith(item.href)
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.special ? (
                  <div className="absolute -top-8 flex items-center justify-center">
                     <div className="h-16 w-16 rounded-full bg-transparent flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground flex items-center justify-center p-2 shadow-lg shadow-primary/25">
                           <item.icon className="h-full w-full" />
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 transition-transform duration-200",
                    isClient && pathname.endsWith(item.href) && "scale-110"
                  )}>
                    <item.icon className="h-full w-full" />
                  </div>
                )}
                
                <span className={cn(
                  "font-medium transition-all duration-200",
                  item.special && 'mt-8',
                  isClient && pathname.endsWith(item.href) && "text-primary font-semibold"
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isClient && pathname.endsWith(item.href) && !item.special && (
                  <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
