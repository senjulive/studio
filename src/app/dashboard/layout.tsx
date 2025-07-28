'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { RouteGuard } from '@/components/auth/route-guard';
import { AstralLogo } from '@/components/icons/astral-logo';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { FloatingNav } from '@/components/dashboard/floating-nav';
import { FloatingChat } from '@/components/dashboard/floating-chat';
import { RightSideDock } from '@/components/dashboard/right-side-dock';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Import navigation icons
import { HomeIcon } from '@/components/icons/nav/home-icon';
import { MarketIcon } from '@/components/icons/nav/market-icon';
import { DepositIcon } from '@/components/icons/nav/deposit-icon';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { SquadIcon } from '@/components/icons/nav/squad-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';
import { SecurityIcon } from '@/components/icons/nav/security-icon';
import { SettingsIcon } from '@/components/icons/nav/settings-icon';
import { InboxIcon } from '@/components/icons/nav/inbox-icon';
import { LogoutIcon } from '@/components/icons/nav/logout-icon';
import { AnnouncementIcon } from '@/components/icons/nav/announcement-icon';
import { PromotionIcon } from '@/components/icons/nav/promotion-icon';
import { AboutIcon } from '@/components/icons/nav/about-icon';

// Import tier and rank icons
import { RecruitTierIcon } from '@/components/icons/tiers/recruit-tier-icon';
import { BronzeTierIcon } from '@/components/icons/tiers/bronze-tier-icon';
import { SilverTierIcon } from '@/components/icons/tiers/silver-tier-icon';
import { GoldTierIcon } from '@/components/icons/tiers/gold-tier-icon';
import { PlatinumTierIcon } from '@/components/icons/tiers/platinum-tier-icon';
import { DiamondTierIcon } from '@/components/icons/tiers/diamond-tier-icon';

import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

const tierIcons = {
  'tier-1': RecruitTierIcon,
  'tier-2': BronzeTierIcon,
  'tier-3': SilverTierIcon,
  'tier-4': GoldTierIcon,
  'tier-5': PlatinumTierIcon,
  'tier-6': DiamondTierIcon,
};

const rankIcons = {
  'Recruit': RecruitRankIcon,
  'Bronze': BronzeRankIcon,
  'Silver': SilverRankIcon,
  'Gold': GoldRankIcon,
  'Platinum': PlatinumRankIcon,
  'Diamond': DiamondRankIcon,
};

const menuConfig = [
  {
    title: 'Dashboard',
    items: [
      { href: '/dashboard', label: 'CORE', icon: AstralLogo },
      { href: '/dashboard/market', label: 'Market', icon: MarketIcon },
      { href: '/dashboard/trading', label: 'Pro Trader', icon: MarketIcon },
    ],
  },
  {
    title: 'Wallet',
    items: [
      { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
      { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
    ],
  },
  {
    title: 'Social',
    items: [
      { href: '/dashboard/squad', label: 'Squad', icon: SquadIcon },
      { href: '/dashboard/invite', label: 'Invite', icon: SquadIcon },
    ],
  },
  {
    title: 'Support',
    items: [
      { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
      { href: '/dashboard/promotions', label: 'Promotions', icon: PromotionIcon },
      { href: '/dashboard/about', label: 'About', icon: AboutIcon },
    ],
  },
];

const bottomNavItems = [
  { href: '/dashboard', label: 'CORE', icon: AstralLogo },
  { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
  { href: '/dashboard/market', label: 'Market', icon: MarketIcon },
  { href: '/dashboard/squad', label: 'Squad', icon: SquadIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout: authLogout } = useAuth();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = () => {
    authLogout();
  };

  // Mock wallet and tier data - in real app this would come from API
  const mockWallet = {
    profile: {
      username: user?.username || 'User',
      avatarUrl: user?.profile?.avatarUrl || '',
    },
    balances: {
      usdt: 1000,
    },
  };

  // Mock rank and tier calculation
  const balance = mockWallet.balances.usdt;
  const rank = balance >= 15000 ? { name: 'Diamond', className: 'text-purple-400' } :
               balance >= 10000 ? { name: 'Platinum', className: 'text-sky-400' } :
               balance >= 5000 ? { name: 'Gold', className: 'text-amber-500' } :
               balance >= 1000 ? { name: 'Silver', className: 'text-slate-400' } :
               balance >= 500 ? { name: 'Bronze', className: 'text-orange-600' } :
               { name: 'Recruit', className: 'text-muted-foreground' };

  const tier = balance >= 15000 ? { id: 'tier-6', name: 'VIP CORE VI' } :
               balance >= 10000 ? { id: 'tier-5', name: 'VIP CORE V' } :
               balance >= 5000 ? { id: 'tier-4', name: 'VIP CORE IV' } :
               balance >= 1000 ? { id: 'tier-3', name: 'VIP CORE III' } :
               balance >= 500 ? { id: 'tier-2', name: 'VIP CORE II' } :
               { id: 'tier-1', name: 'VIP CORE I' };

  const RankIcon = rankIcons[rank.name as keyof typeof rankIcons] || RecruitRankIcon;
  const TierIcon = tierIcons[tier.id as keyof typeof tierIcons] || RecruitTierIcon;
  const tierClassName = tier.id === 'tier-6' ? 'text-purple-400' :
                       tier.id === 'tier-5' ? 'text-sky-400' :
                       tier.id === 'tier-4' ? 'text-amber-500' :
                       tier.id === 'tier-3' ? 'text-slate-400' :
                       tier.id === 'tier-2' ? 'text-orange-600' :
                       'text-muted-foreground';

  return (
    <RouteGuard allowedRoles={['user']}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={mockWallet.profile.avatarUrl} 
                  alt={mockWallet.profile.username} 
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {(mockWallet.profile.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {mockWallet.profile.username}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email || '...'}
                </p>
              </div>
            </div>
            <div className="px-4 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("text-sm py-1 px-2 flex items-center gap-1.5", rank.className)}>
                  <RankIcon className="h-4 w-4" />
                  <span>{rank.name}</span>
                </Badge>
                <Badge variant="outline" className={cn("text-sm py-1 px-2 flex items-center gap-1.5", tierClassName)}>
                  <TierIcon className="h-4 w-4" />
                  <span>{tier.name}</span>
                </Badge>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuConfig.map((group, index) => (
                <React.Fragment key={group.title}>
                  {index > 0 && <Separator className="my-2 bg-sidebar-border/50" />}
                  <p className="px-4 pt-2 pb-1 text-xs font-semibold text-sidebar-foreground/50">{group.title}</p>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isClient ? pathname === item.href : false}
                      >
                        <Link href={item.href}>
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
            <div className="flex items-center justify-between p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="justify-start text-sidebar-foreground h-auto p-2">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {mockWallet.profile.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || '...'}
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
              <ThemeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
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
              <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5", rank.className)}>
                <RankIcon className="h-4 w-4" />
                <span>{rank.name}</span>
              </Badge>
              <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5", tierClassName)}>
                <TierIcon className="h-4 w-4" />
                <span>{tier.name}</span>
              </Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/inbox">
                  <InboxIcon className="h-5 w-5" />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
              <NotificationBell />
            </div>
          </header>

          <main className="flex-1 bg-secondary p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center justify-around z-10 md:hidden">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors relative',
                  isClient && pathname === item.href
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label === 'CORE' ? (
                  <div className="absolute -top-7 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
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

          {/* Desktop Floating Elements */}
          <div className="hidden md:block">
            <FloatingNav />
            <FloatingChat />
          </div>
          <RightSideDock />
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
