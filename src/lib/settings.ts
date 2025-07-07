'use client';

export type TierSetting = {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
};

const SETTINGS_STORAGE_KEY = 'astral-bot-settings';

const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'Tier 1', balanceThreshold: 0, dailyProfit: 0.02, clicks: 4 },
  { id: 'tier-2', name: 'Tier 2', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5 },
  { id: 'tier-3', name: 'Tier 3', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6 },
  { id: 'tier-4', name: 'Tier 4', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7 },
  { id: 'tier-5', name: 'Tier 5', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8 },
  { id: 'tier-6', name: 'Tier 6', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10 },
];

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    // Basic validation to ensure it's an array
    if (Array.isArray(parsed)) {
      return parsed as T;
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
}

export async function getBotTierSettings(): Promise<TierSetting[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (typeof window === 'undefined') return defaultTierSettings;
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  const settings = safeJsonParse<TierSetting[]>(stored, defaultTierSettings);
  // Ensure we return a list sorted by balance threshold for consistency
  return settings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}

export async function saveBotTierSettings(settings: TierSetting[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
