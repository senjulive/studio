
import { NextResponse } from 'next/server';
import { ranks, getUserRank } from '@/lib/ranks';
import { defaultTierSettings, getCurrentTier } from '@/lib/settings';
import type { Rank } from '@/lib/ranks';
import type { TierSetting } from '@/lib/settings';

// Since we removed Supabase, we can no longer get the current user from cookies this way.
// The app will function in a mock state. We'll return a mock squad.

export type SquadMember = {
    id: string;
    username: string;
    balance: number;
    rank: { name: Rank['name']; Icon: Rank['Icon'], className: Rank['className'] };
    tier: { name: TierSetting['name']; Icon: TierSetting['Icon'], className: TierSetting['className'] };
    team: SquadMember[];
};

function getMemberWithRankAndTier(id: string, username: string, balance: number, team: SquadMember[] = []): SquadMember {
    const rank = getUserRank(balance);
    const tier = getCurrentTier(balance, defaultTierSettings) || defaultTierSettings[0];
    return {
        id,
        username,
        balance,
        rank: { name: rank.name, Icon: rank.Icon, className: rank.className },
        tier: { name: tier.name, Icon: tier.Icon, className: tier.className },
        team,
    };
}


const mockSquad: SquadMember[] = [
    getMemberWithRankAndTier('mock-member-1', 'SquadMemberOne', 1250, [
        getMemberWithRankAndTier('mock-sub-member-1', 'SubMemberOne', 600)
    ]),
    getMemberWithRankAndTier('mock-member-2', 'SquadMemberTwo', 5500),
    getMemberWithRankAndTier('mock-member-3', 'RecruitZero', 250),
    getMemberWithRankAndTier('mock-member-4', 'DiamondHands', 16000),
]

export async function GET(request: Request) {
    // Return mock data because there is no database to query.
    return NextResponse.json(mockSquad);
}
