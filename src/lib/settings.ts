
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
];

// Returns the default settings directly as there is no database.
export async function getBotTierSettings(): Promise<TierSetting[]> {
    const settings = defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
    return Promise.resolve(settings);
}
