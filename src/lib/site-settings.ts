import { supabase } from '@/lib/supabase';

export type SiteSettings = {
  usdtDepositAddress: string;
  ethDepositAddress: string;
  btcDepositAddress: string;
};

const SITE_SETTINGS_KEY = 'siteSettings';

const defaultSiteSettings: SiteSettings = {
  usdtDepositAddress: 'TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x', // Default placeholder
  ethDepositAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', // Default placeholder
  btcDepositAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', // Default placeholder
};

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
  return { ...defaultValue, ...(data.value as T) };
}

async function saveSetting<T>(key: string, value: T): Promise<void> {
  const { error } = await supabase.from('settings').upsert({ key, value: value as any });
  if (error) {
    console.error(`Error saving setting ${key}:`, error);
    throw new Error(`Failed to save setting ${key}.`);
  }
}


export async function getSiteSettings(): Promise<SiteSettings> {
  return await getSetting<SiteSettings>(SITE_SETTINGS_KEY, defaultSiteSettings);
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await saveSetting(SITE_SETTINGS_KEY, settings);
}
