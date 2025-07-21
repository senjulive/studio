// This is a server-safe module for tier data and logic.
// It does not contain any client-side code (like React components or hooks).

export type TierSetting = {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
};

export const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'VIP CORE I', balanceThreshold: 0, dailyProfit: 0.02, clicks: 4 },
  { id: 'tier-2', name: 'VIP CORE II', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5 },
  { id: 'tier-3', name: 'VIP CORE III', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6 },
  { id: 'tier-4', name: 'VIP CORE IV', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7 },
  { id: 'tier-5', name: 'VIP CORE V', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8 },
  { id: 'tier-6', name: 'VIP CORE VI', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10 },
  { id: 'tier-7', name: 'VIP CORE VII', balanceThreshold: 50000, dailyProfit: 0.1, clicks: 12 },
  { id: 'tier-8', name: 'VIP CORE VIII', balanceThreshold: 100000, dailyProfit: 0.12, clicks: 15 },
];

export async function getBotTierSettings(): Promise<TierSetting[]> {
    // In a real app, this might fetch from a database or a remote JSON file.
    // For this mock app, we return the default settings.
    // A fetch from the local API could also be placed here if settings were dynamic.
    return defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}

export const getCurrentTier = (balance: number, tiers: TierSetting[]): TierSetting | null => {
    if (!tiers || tiers.length === 0) return null;
    const applicableTier = [...tiers].reverse().find(
      tier => balance >= tier.balanceThreshold && !tier.name.includes('VII') && !tier.name.includes('VIII')
    );
    return applicableTier || null;
};
