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
}
from '@/components/ui/sidebar';
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
import { MessageSquare, UserPlus, Shield, Lock, Trophy, Cpu, Users, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/contexts/UserContext';
import { getOrCreateWallet, type WalletData } from '@/lib/wallet';
import { getUserRank } from '@/lib/ranks';
import { type TierSetting as TierData, getBotTierSettings, getCurrentTier } from '@/lib/tiers';
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
import { RightSidebar } from '@/components/ui/right-sidebar';
import { ModeToggle } from '@/components/ui/mode-toggle';

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
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex flex-col items-center justify-center">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Neural Network Lines */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="rgb(59,130,246)" strokeWidth="1" className="animate-pulse" />
          <path d="M100,400 Q300,300 500,400 T900,400" stroke="rgb(147,51,234)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          <path d="M100,600 Q300,500 500,600 T900,600" stroke="rgb(6,182,212)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '1s'}} />
          <path d="M100,800 Q300,700 500,800 T900,800" stroke="rgb(168,85,247)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '1.5s'}} />
        </svg>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in-50 duration-1000">
        {/* Quantum Logo with Rotating Rings */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-48 h-48 border-2 border-blue-400/30 rounded-full animate-spin" style={{animationDuration: '4s'}} />

          {/* Middle rotating ring */}
          <div className="absolute inset-4 w-40 h-40 border-2 border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}} />

          {/* Inner rotating ring */}
          <div className="absolute inset-8 w-32 h-32 border-2 border-cyan-400/50 rounded-full animate-spin" style={{animationDuration: '2s'}} />

          {/* Central logo with pulse */}
          <div className="relative flex items-center justify-center w-48 h-48">
            <AstralLogo className="h-24 w-24 text-blue-400 animate-pulse" />
          </div>

          {/* Quantum dots */}
          <div className="absolute top-4 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
          <div className="absolute top-1/2 right-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}} />
        </div>

        {/* Loading Text with Gradient */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Initializing AstralCore
          </h1>
          <div className="space-y-2">
            <p className="text-xl text-gray-300 font-medium">Quantum AI Neural Networks</p>
            <p className="text-gray-400">Calibrating trading algorithms...</p>
          </div>
        </div>

        {/* Animated Progress Indicators */}
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* System Status */}
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-300">Neural Grid: Active</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
            <span className="text-purple-300">Market Analysis: Online</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-400/30">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
            <span className="text-cyan-300">Quantum Core: Syncing</span>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-80 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse transform origin-left animate-[slide_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Bottom Subtle Branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-sm text-gray-500">AstralCore Quantum Nexus v3.76</p>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%) scaleX(0); }
          50% { transform: translateX(0%) scaleX(1); }
          100% { transform: translateX(100%) scaleX(0); }
        }
      `}</style>
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
            Promise.resolve(getBotTierSettings())
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
      const fileContent = `[InternetShortcut]
URL=${window.location.origin}`;
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
          { href: downloadHref, label: 'Download App', icon: DownloadIcon, download: 'AstralCore.url'},
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
        <Sidebar className="border-r-0 shadow-lg">
          <SidebarHeader className="border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar-background to-sidebar-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm"></div>
                <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-lg border border-primary/20">
                  <AstralLogo className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text text-transparent">
                  AstralCore
                </span>
                <span className="text-xs text-sidebar-foreground/60 font-medium">
                  Quantum Nexus v3.76
                </span>
              </div>
            </div>
          </SidebarHeader>

          <div className="p-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"></div>
              <div className="relative p-4 rounded-xl border border-sidebar-border/50 bg-sidebar-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <AvatarUploadDialog
                    onUploadSuccess={() => fetchWalletAndTiers(user.id)}
                    wallet={wallet}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-sm animate-pulse"></div>
                      <Avatar className="h-12 w-12 cursor-pointer relative border-2 border-primary/20">
                        <AvatarImage
                          src={wallet?.profile?.avatarUrl}
                          alt={wallet?.profile?.username || 'User'}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </AvatarUploadDialog>

                  <div className="flex-1 overflow-hidden">
                     <p className="font-bold text-sidebar-foreground truncate flex items-center gap-2 text-sm">
                        {wallet?.profile?.username || 'User'}
                        {userCountry && <span className="text-base">{userCountry.flag}</span>}
                     </p>
                     <p className="text-xs text-sidebar-foreground/60 truncate font-medium">{userEmail}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs py-1 px-2 flex items-center gap-1 border-opacity-50 bg-opacity-10", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    <span className="font-medium">{rank.name}</span>
                  </Badge>
                  {tier && TierIcon && tierClassName && (
                    <Badge variant="outline" className={cn("text-xs py-1 px-2 flex items-center gap-1 border-opacity-50 bg-opacity-10", tierClassName)}>
                      <TierIcon className="h-3 w-3" />
                      <span className="font-medium">{tier.name}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <SidebarContent className="px-2">
            <SidebarMenu className="space-y-1">
              {menuConfig.map((group, index) => (
                <React.Fragment key={group.title}>
                  {index > 0 && (
                    <div className="my-4">
                      <Separator className="bg-sidebar-border/30" />
                    </div>
                  )}
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-bold text-sidebar-foreground/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                      {group.title === 'Overview' && <Cpu className="h-3 w-3" />}
                      {group.title === 'Community' && <Users className="h-3 w-3" />}
                      {group.title === 'Manage' && <Shield className="h-3 w-3" />}
                      {group.title === 'Account' && <User className="h-3 w-3" />}
                      {group.title === 'Platform' && <Globe className="h-3 w-3" />}
                      {group.title === 'Admin Tools' && <Lock className="h-3 w-3" />}
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = isClient ? (pathname.endsWith(item.href) && !item.download) : false;
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                "h-10 px-3 rounded-lg transition-all duration-200 group hover:shadow-sm",
                                isActive
                                  ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 text-primary shadow-sm"
                                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <Link href={item.href} download={item.download} className="flex items-center gap-3 w-full">
                                {item.label === 'CORE' ? (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-primary/30 rounded-md blur-sm animate-pulse"></div>
                                    <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-1 rounded-md border border-primary/20">
                                      <item.icon className="h-4 w-4 text-primary" />
                                    </div>
                                  </div>
                                ) : (
                                  <item.icon className={cn(
                                    "h-4 w-4 transition-colors",
                                    isActive ? "text-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                                  )} />
                                )}
                                <span className={cn(
                                  "font-medium text-sm transition-colors",
                                  isActive ? "text-primary font-semibold" : "text-sidebar-foreground group-hover:text-sidebar-foreground"
                                )}>
                                  {item.label}
                                </span>
                                {isActive && (
                                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground h-auto p-2">
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
          <main className="flex-1 bg-secondary p-4 md:p-6 pb-20">
            <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 -ml-4 -mr-4 md:-ml-6 md:-mr-6">
              <SidebarTrigger />
              <div className="w-full flex-1">
                <h1 className="flex items-center gap-2 text-lg font-semibold md:text-2xl capitalize">
                  <AstralLogo className="h-6 w-6" />
                  {isClient ? (
                    <span>{getPageTitle()}</span>
                  ) : (
                    <Skeleton className="h-6 w-24" />
                  )}
                </h1>
              </div>
              <div className="flex items-center gap-2">
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

                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                  <Link href="/dashboard/inbox">
                    <InboxIcon className="h-5 w-5" />
                    <span className="sr-only">Inbox</span>
                  </Link>
                </Button>
                <NotificationBell />
                <ModeToggle />
              </div>
            </header>
            {children}
          </main>
          <div className="hidden lg:block border-l">
            <RightSidebar />
          </div>
        </div>
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center justify-around z-10 md:hidden">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors relative',
                  isClient && pathname.endsWith(item.href)
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label === 'CORE' ? (
                  <div className="absolute -top-7 flex items-center justify-center">
                     <div className="h-16 w-16 rounded-full bg-transparent flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-1">
                           <item.icon className="h-full w-full" />
                        </div>
                     </div>
                  </div>
                ) : (
                  <item.icon className="h-6 w-6" />
                )}
                
                <span className={cn(item.label === 'CORE' && 'mt-8')}>{item.label}</span>
              </Link>
            ))}
          </nav>
      </SidebarProvider>
    </UserProvider>
  );
}
