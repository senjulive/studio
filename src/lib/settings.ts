
'use client';

import type { SVGProps } from 'react';
import { RecruitTierIcon } from '@/components/icons/tiers/recruit-tier-icon';
import { BronzeTierIcon } from '@/components/icons/tiers/bronze-tier-icon';
import { SilverTierIcon } from '@/components/icons/tiers/silver-tier-icon';
import { GoldTierIcon } from '@/components/icons/tiers/gold-tier-icon';
import { PlatinumTierIcon } from '@/components/icons/tiers/platinum-tier-icon';
import { DiamondTierIcon } from '@/components/icons/tiers/diamond-tier-icon';
import { Lock } from 'lucide-react';

export type TierSetting = {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className: string;
};

export const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'VIP CORE I', balanceThreshold: 0, dailyProfit: 0.02, clicks: 4, Icon: RecruitTierIcon, className: 'text-muted-foreground' },
  { id: 'tier-2', name: 'VIP CORE II', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5, Icon: BronzeTierIcon, className: 'text-orange-600' },
  { id: 'tier-3', name: 'VIP CORE III', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6, Icon: SilverTierIcon, className: 'text-slate-400' },
  { id: 'tier-4', name: 'VIP CORE IV', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7, Icon: GoldTierIcon, className: 'text-amber-500' },
  { id: 'tier-5', name: 'VIP CORE V', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8, Icon: PlatinumTierIcon, className: 'text-sky-400' },
  { id: 'tier-6', name: 'VIP CORE VI', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10, Icon: DiamondTierIcon, className: 'text-purple-400' },
  { id: 'tier-7', name: 'VIP CORE VII', balanceThreshold: 50000, dailyProfit: 0.1, clicks: 12, Icon: Lock, className: 'text-muted-foreground' },
  { id: 'tier-8', name: 'VIP CORE VIII', balanceThreshold: 100000, dailyProfit: 0.12, clicks: 15, Icon: Lock, className: 'text-muted-foreground' },
];

// Returns the default settings directly as there is no database.
export async function getBotTierSettings(): Promise<TierSetting[]> {
    const settings = defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
    return Promise.resolve(settings);
}


export const getCurrentTier = (balance: number): TierSetting | null => {
    if (defaultTierSettings.length === 0) return null;
    const applicableTier = [...defaultTierSettings].reverse().find(tier => balance >= tier.balanceThreshold && tier.Icon !== Lock);
    return applicableTier || null;
};
