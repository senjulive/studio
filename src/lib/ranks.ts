
'use client';

import type { SVGProps } from 'react';
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';

export type Rank = {
  name: string;
  minBalance: number;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className: string;
};

export const ranks: Rank[] = [
  { name: 'Recruit', minBalance: 0, Icon: RecruitRankIcon, className: 'text-muted-foreground' },
  { name: 'Bronze', minBalance: 500, Icon: BronzeRankIcon, className: 'text-orange-600' },
  { name: 'Silver', minBalance: 1000, Icon: SilverRankIcon, className: 'text-slate-400' },
  { name: 'Gold', minBalance: 5000, Icon: GoldRankIcon, className: 'text-amber-500' },
  { name: 'Platinum', minBalance: 10000, Icon: PlatinumRankIcon, className: 'text-sky-400' },
];

export const getUserRank = (balance: number): Rank => {
  const sortedRanks = [...ranks].sort((a, b) => b.minBalance - a.minBalance);
  return sortedRanks.find(rank => balance >= rank.minBalance) || ranks[0];
};
