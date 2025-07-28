
import { NextResponse } from 'next/server';

export type SquadMember = {
    id: string;
    username: string;
    rank: { name: string; Icon: any; className: string };
    tier: { name: string; Icon: any; className: string };
    team?: SquadMember[];
};

// This is a mock response. A real implementation would query the database.
const mockSquadData: SquadMember[] = [
    {
        id: 'team-member-1',
        username: 'CryptoWhale',
        rank: { name: 'Gold', Icon: 'GoldRankIcon', className: 'text-amber-500' },
        tier: { name: 'VIP CORE IV', Icon: 'GoldTierIcon', className: 'text-amber-500' },
        team: [
            {
                id: 'sub-member-1',
                username: 'NewbieTrader',
                rank: { name: 'Bronze', Icon: 'BronzeRankIcon', className: 'text-orange-600' },
                tier: { name: 'VIP CORE II', Icon: 'BronzeTierIcon', className: 'text-orange-600' }
            }
        ]
    },
    {
        id: 'team-member-2',
        username: 'DiamondHands',
        rank: { name: 'Silver', Icon: 'SilverRankIcon', className: 'text-slate-400' },
        tier: { name: 'VIP CORE III', Icon: 'SilverTierIcon', className: 'text-slate-400' }
    }
];

export async function GET() {
    // We can't serialize the Icon component, so we'll have to handle that on the client
    return NextResponse.json(mockSquadData.map(member => ({...member, rank: { ...member.rank, Icon: null}, tier: {...member.tier, Icon: null} })));
}
