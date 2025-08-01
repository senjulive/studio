// Tier data and logic module
// Client-side compatible version

export interface TierSetting {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
  locked: boolean;
}

export const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'VIP CORE I', balanceThreshold: 0, dailyProfit: 0.02, clicks: 4, locked: false },
  { id: 'tier-2', name: 'VIP CORE II', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5, locked: false },
  { id: 'tier-3', name: 'VIP CORE III', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6, locked: false },
  { id: 'tier-4', name: 'VIP CORE IV', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7, locked: false },
  { id: 'tier-5', name: 'VIP CORE V', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8, locked: false },
  { id: 'tier-6', name: 'VIP CORE VI', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10, locked: false },
  { id: 'tier-7', name: 'VIP CORE VII', balanceThreshold: 50000, dailyProfit: 0.1, clicks: 12, locked: true },
  { id: 'tier-8', name: 'VIP CORE VIII', balanceThreshold: 100000, dailyProfit: 0.12, clicks: 15, locked: true },
];

// Client-side version that returns the default tiers
export function getBotTierSettings(): TierSetting[] {
  return defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}

// Server-side version for API routes (async)
export async function getBotTierSettingsAsync(): Promise<TierSetting[]> {
  // For server-side, we can try to read from file system
  if (typeof window === 'undefined') {
    try {
      // Dynamic import to avoid client-side bundling
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'settings.json');
      const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
      const settings = JSON.parse(data);
      const tierSettings = settings['botTierSettings'];
      
      if (tierSettings && Array.isArray(tierSettings) && tierSettings.length > 0) {
        return tierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
      }
    } catch (error) {
      console.error("Could not read tier settings from file, using defaults.", error);
    }
  }
  
  return defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}

export function getCurrentTier(balance: number, tierSettings?: TierSetting[]): TierSetting | null {
    const tiers = tierSettings || getBotTierSettings();
    
    // Find the highest tier that the user qualifies for
    let currentTier: TierSetting | null = null;
    
    for (const tier of tiers) {
        if (balance >= tier.balanceThreshold) {
            currentTier = tier;
        } else {
            break; // Since tiers are sorted by threshold, we can break here
        }
    }
    
    return currentTier;
}

// Client-side version that doesn't use async file operations
export function getCurrentTierSync(balance: number, tierSettings: TierSetting[]): TierSetting | null {
    let currentTier: TierSetting | null = null;
    
    for (const tier of tierSettings) {
        if (balance >= tier.balanceThreshold) {
            currentTier = tier;
        } else {
            break;
        }
    }
    
    return currentTier;
}
