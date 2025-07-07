'use client';

export type SiteSettings = {
  usdtDepositAddress: string;
};

const SITE_SETTINGS_STORAGE_KEY = 'astral-site-settings';

const defaultSiteSettings: SiteSettings = {
  usdtDepositAddress: 'TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x', // Default placeholder
};

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    return parsed as T;
  } catch (e) {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (typeof window === 'undefined') return defaultSiteSettings;
  const stored = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
  const settings = safeJsonParse<SiteSettings>(stored, defaultSiteSettings);
  return { ...defaultSiteSettings, ...settings };
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (typeof window === 'undefined') return;
  localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
