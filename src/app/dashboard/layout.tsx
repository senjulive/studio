'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/lib/auth';
import * as React from 'react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { AstralLogo } from '@/components/icons/astral-logo';
import { SwipeNavigation } from '@/components/navigation/SwipeNavigation';
import { QuickThemeToggle } from '@/components/ui/theme-toggle';

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
import { MessageSquare, UserPlus, Shield, Lock, Trophy } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground animate-in fade-in-50">
      <AstralLogo className="h-40 w-40 animate-pulse" />
      <p className="mt-4 text-lg font-semibold">Loading Your Dashboard</p>
      <p className="text-muted-foreground">Please wait a moment...</p>
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
      <SwipeNavigation>
        <div className="min-h-screen pb-20">
          {/* Mobile Header */}
          <header className="mobile-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-lg truncate">
                    {isClient ? getPageTitle() : 'Loading...'}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", rank.className)}>
                      <RankIcon className="h-3 w-3 mr-1" />
                      {rank.name}
                    </Badge>
                    {tier && TierIcon && tierClassName && (
                      <Badge variant="outline" className={cn("text-xs", tierClassName)}>
                        <TierIcon className="h-3 w-3 mr-1" />
                        {tier.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <QuickThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="mobile-content">
            {children}
          </main>
        </div>
      </SwipeNavigation>
    </UserProvider>
  );
}
