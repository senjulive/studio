
'use client';

import type { SVGProps } from 'react';
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';

export type Rank = {
  name: string;
  minSquadSize: number;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className: string;
};

export const ranks: Rank[] = [
  { name: 'Recruit', minSquadSize: 0, Icon: RecruitRankIcon, className: 'text-muted-foreground' },
  { name: 'Bronze', minSquadSize: 1, Icon: BronzeRankIcon, className: 'text-orange-600' },
  { name: 'Silver', minSquadSize: 5, Icon: SilverRankIcon, className: 'text-slate-400' },
  { name: 'Gold', minSquadSize: 10, Icon: GoldRankIcon, className: 'text-amber-500' },
  { name: 'Platinum', minSquadSize: 25, Icon: PlatinumRankIcon, className: 'text-sky-400' },
];

export const getUserRank = (squadSize: number): Rank => {
  const sortedRanks = [...ranks].sort((a, b) => b.minSquadSize - a.minSquadSize);
  return sortedRanks.find(rank => squadSize >= rank.minSquadSize) || ranks[0];
};
