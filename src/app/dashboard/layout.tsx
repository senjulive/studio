'use client';

import * as React from 'react';
import { DashboardLayoutWithNavigation } from '@/components/layout/DashboardLayoutWithNavigation';
import { UserProvider } from '@/contexts/UserContext';
import { getOrCreateWallet, type WalletData } from '@/lib/wallet';
import { getUserRank, getCurrentTier } from '@/lib/ranks';
import { type TierSetting as TierData, getBotTierSettings } from '@/lib/tiers';
import { AstralLogo } from '@/components/icons/astral-logo';

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
  const [user, setUser] = React.useState<any | null>(null);
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [tierSettings, setTierSettings] = React.useState<TierData[]>([]);
  const [isInitializing, setIsInitializing] = React.useState(true);

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

      if (currentUser.id) {
        await fetchWalletAndTiers(currentUser.id);
      }
      setIsInitializing(false);
    };
    initializeUser();
  }, [fetchWalletAndTiers]);

  if (isInitializing) {
    return <DashboardLoading />;
  }
  
  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);
  const tier = getCurrentTier(totalBalance, tierSettings);
  
  return (
    <UserProvider value={{ user: user as any, wallet, rank, tier, tierSettings }}>
      <DashboardLayoutWithNavigation
        user={user}
        wallet={wallet}
        rank={rank}
        tier={tier}
      >
        {children}
      </DashboardLayoutWithNavigation>
    </UserProvider>
  );
}
