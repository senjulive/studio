
export type TierSetting = {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
};

export const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'Tier 1', balanceThreshold: 0, dailyProfit: 0.02, clicks: 4 },
  { id: 'tier-2', name: 'Tier 2', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5 },
  { id: 'tier-3', name: 'Tier 3', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6 },
  { id: 'tier-4', name: 'Tier 4', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7 },
  { id: 'tier-5', name: 'Tier 5', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8 },
  { id: 'tier-6', name: 'Tier 6', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10 },
];

export async function getBotTierSettings(): Promise<TierSetting[]> {
    try {
        const response = await fetch('/api/public-settings?key=botTierSettings');
        if (!response.ok) return defaultTierSettings;
        const data = await response.json();
        const settings = data || defaultTierSettings;
        return settings.sort((a: TierSetting, b: TierSetting) => a.balanceThreshold - b.balanceThreshold);
    } catch(e) {
        console.error("Failed to fetch bot tier settings", e);
        return defaultTierSettings;
    }
}
