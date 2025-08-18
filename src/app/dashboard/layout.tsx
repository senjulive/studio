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
import { AstralLogo } from '@/components/icons/astral-logo';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Lazy load heavy components for better performance
const NotificationBell = dynamic(
  () =>
    import('@/components/dashboard/notification-bell').then(mod => ({
      default: mod.NotificationBell,
    })),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
    ssr: false,
  }
);

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
import { MessageSquare, UserPlus, Shield, Lock as LucideLock, Trophy } from 'lucide-react';
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
import { ModeToggle } from '@/components/ui/mode-toggle';

// Lazy load RightSidebar for better performance
const RightSidebar = dynamic(
  () => import('@/components/ui/right-sidebar').then(mod => ({ default: mod.RightSidebar })),
  {
    loading: () => <Skeleton className="w-80 h-full" />,
    ssr: false,
  }
);

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

// Wrapper component for Lucide Lock icon to match our type
const Lock: IconComponent = props => <LucideLock {...props} />;

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
      <AstralLogo className="h-40 w-40 animate-pulse" />
      <p className="mt-4 text-lg font-semibold">Loading Your Dashboard</p>
      <p className="text-muted-foreground">Please wait a moment...</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        getBotTierSettings(),
      ]);
      setWallet(walletData);
      setTierSettings(tiers);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
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
      const fileContent = `[InternetShortcut]
URL=${window.location.origin}`;
      const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(fileContent)}`;
      setDownloadHref(dataUri);
    }
  }, []);

  const menuConfig = React.useMemo(() => {
    const baseConfig = [
      {
        title: 'Overview',
        items: [
          { href: '/dashboard', label: 'Home', icon: HomeIcon },
          { href: '/dashboard/market', label: 'Market', icon: MarketIcon },
          { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
        ],
      },
      {
        title: 'Community',
        items: [
          { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
          { href: '/dashboard/squad', label: 'Squad', icon: SquadIcon },
          { href: '/dashboard/invite', label: 'Invite', icon: UserPlus },
          { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy },
        ],
      },
      {
        title: 'Manage',
        items: [
          { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
          { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
        ],
      },
      {
        title: 'Account',
        items: [
          { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
          { href: '/dashboard/security', label: 'Security', icon: SettingsIcon },
          { href: '/dashboard/inbox', label: 'Inbox', icon: InboxIcon },
        ],
      },
      {
        title: 'Platform',
        items: [
          { href: '/dashboard/promotions', label: 'Promotions', icon: PromotionIcon },
          { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: Trophy },
          { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
          { href: '/dashboard/about', label: 'About', icon: AboutIcon },
          {
            href: downloadHref,
            label: 'Download App',
            icon: DownloadIcon,
            download: 'AstralCore.url',
          },
        ],
      },
    ];

    if (isAdmin || isModerator) {
      const adminItems = [];
      if (isAdmin) {
        adminItems.push({ href: '/admin', label: 'Admin Panel', icon: Shield });
      }
      if (isModerator) {
        adminItems.push({ href: '/moderator', label: 'Moderator Panel', icon: Shield });
      }
      baseConfig.push({
        title: 'Admin Tools',
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
    { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
    { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
  ];

  const getPageTitle = () => {
    const currentPath = pathname || '/dashboard';
    const simplePath = currentPath.startsWith('/dashboard')
      ? currentPath
      : `/dashboard${currentPath}`;

    if (simplePath === '/dashboard/trading') return 'Astral Core Trading';
    const currentItem = menuConfig
      .flatMap(g => g.items)
      .find(item => {
        return (
          (simplePath.startsWith(item.href) && item.href !== '/dashboard') ||
          simplePath === item.href
        );
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
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <AstralLogo className="h-10 w-10" />
              <span className="text-lg font-semibold text-sidebar-foreground">AstralCore</span>
            </div>
          </SidebarHeader>

          <div className="mt-12 mb-4 px-4 space-y-4">
            <div className="flex items-center gap-3">
              <AvatarUploadDialog
                onUploadSuccess={() => fetchWalletAndTiers(user.id)}
                wallet={wallet}
              >
                <Avatar className="h-12 w-12 cursor-pointer">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </AvatarUploadDialog>

              <div className="overflow-hidden">
                <p className="font-semibold text-sidebar-foreground truncate flex items-center gap-2">
                  {wallet?.profile?.username || 'User'}
                  {userCountry && <span className="text-lg">{userCountry.flag}</span>}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{userEmail}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn('text-sm py-1 px-2 flex items-center gap-1.5', rank.className)}
              >
                <RankIcon className="h-4 w-4" />
                <span>{rank.name}</span>
              </Badge>
              {tier && TierIcon && tierClassName && (
                <Badge
                  variant="outline"
                  className={cn('text-sm py-1 px-2 flex items-center gap-1.5', tierClassName)}
                >
                  <TierIcon className="h-4 w-4" />
                  <span>{tier.name}</span>
                </Badge>
              )}
            </div>
          </div>
          <Separator className="bg-sidebar-border" />

          <SidebarContent>
            <SidebarMenu>
              {menuConfig.map((group, index) => (
                <React.Fragment key={group.title}>
                  {index > 0 && <Separator className="my-2 bg-sidebar-border/50" />}
                  <p className="px-4 pt-2 pb-1 text-xs font-semibold text-sidebar-foreground/50">
                    {group.title}
                  </p>
                  {group.items.map(item => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          isClient ? (pathname || '').endsWith(item.href) && !item.download : false
                        }
                      >
                        <Link href={item.href} download={item.download}>
                          <item.icon className={cn(item.label === 'CORE' && 'h-6 w-6 p-0.5')} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground h-auto p-2"
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings & Logout
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
        <div className="flex flex-1">
          <main className="flex-1 bg-background p-2 md:p-6 pb-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Mobile-first header */}
            <header className="relative z-10 flex h-12 md:h-16 items-center gap-3 mobile-card mb-4 sticky top-2 md:top-6">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="hidden md:flex items-center gap-2">
                  <AstralLogo className="h-6 w-6 electric-glow" />
                </div>
                {isClient ? (
                  <h1 className="text-sm md:text-xl font-bold truncate bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h1>
                ) : (
                  <Skeleton className="h-5 w-20 md:h-6 md:w-24" />
                )}
              </div>

              {/* Mobile-optimized header actions */}
              <div className="flex items-center gap-1 md:gap-2">
                <TooltipProvider>
                  {/* Mobile: Show only icons, Desktop: Show badges */}
                  <div className="flex md:hidden">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center electric-glow">
                          <RankIcon className="h-4 w-4 text-primary" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{rank.name} Rank</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="hidden md:flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={cn('flex items-center gap-1.5 electric-glow', rank.className)}
                        >
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
                          <Badge
                            variant="outline"
                            className={cn(
                              'flex items-center gap-1.5 electric-glow-cyan',
                              tierClassName
                            )}
                          >
                            <TierIcon className="h-4 w-4" />
                            <span>{tier.name}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>VIP CORE Tier</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TooltipProvider>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 rounded-xl hover:electric-glow transition-all"
                  asChild
                >
                  <Link href="/dashboard/inbox">
                    <InboxIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Inbox</span>
                  </Link>
                </Button>
                <div className="hidden md:block">
                  <NotificationBell />
                </div>
                <div className="hidden lg:block">
                  <ModeToggle />
                </div>
              </div>
            </header>

            {/* Main content with mobile optimization */}
            <div className="relative z-10">{children}</div>
          </main>

          {/* Right sidebar - hidden on mobile */}
          <div className="hidden lg:block border-l border-primary/20">
            <RightSidebar />
          </div>
        </div>

        {/* Modern bottom navigation - always visible on mobile */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 md:hidden z-50">
          {/* Background with blur and electric border */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-primary/30 electric-glow"></div>

          {/* Navigation items */}
          <div className="relative z-10 flex items-center justify-around h-full px-2">
            {bottomNavItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-all duration-300 relative rounded-xl',
                  isClient && (pathname || '').endsWith(item.href)
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label === 'CORE' ? (
                  <div className="absolute -top-8 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/50 flex items-center justify-center electric-glow">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-1 electric-glow">
                        <item.icon className="h-full w-full text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'p-2 rounded-xl transition-all duration-300',
                      isClient && (pathname || '').endsWith(item.href)
                        ? 'bg-primary/20 scale-110'
                        : 'hover:bg-primary/10'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                )}

                <span
                  className={cn(
                    'font-medium transition-all duration-300',
                    item.label === 'CORE' && 'mt-8',
                    isClient &&
                      (pathname || '').endsWith(item.href) &&
                      item.label !== 'CORE' &&
                      'text-primary'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </SidebarProvider>
    </UserProvider>
  );
}
