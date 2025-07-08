import { supabase } from '@/lib/supabase';

export type TierSetting = {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
};

const BOT_TIERS_KEY = 'botTierSettings';

const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'Tier 1', balanceThreshold: 0, dailyProfit: 0.02, clicks: 4 },
  { id: 'tier-2', name: 'Tier 2', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5 },
  { id: 'tier-3', name: 'Tier 3', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6 },
  { id: 'tier-4', name: 'Tier 4', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7 },
  { id: 'tier-5', name: 'Tier 5', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8 },
  { id: 'tier-6', name: 'Tier 6', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10 },
];

async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    await supabase.from('settings').upsert({ key, value: defaultValue as any });
    return defaultValue;
  }
  return data.value as T;
}

async function saveSetting<T>(key: string, value: T): Promise<void> {
  const { error } = await supabase.from('settings').upsert({ key, value: value as any });
  if (error) {
    console.error(`Error saving setting ${key}:`, error);
    throw new Error(`Failed to save setting ${key}.`);
  }
}

export async function getBotTierSettings(): Promise<TierSetting[]> {
  const settings = await getSetting<TierSetting[]>(BOT_TIERS_KEY, defaultTierSettings);
  return settings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}

export async function saveBotTierSettings(settings: TierSetting[]): Promise<void> {
  await saveSetting(BOT_TIERS_KEY, settings);
}
