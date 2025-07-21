
import { NextResponse } from 'next/server';
import { getUserRank } from '@/lib/ranks';
import { getCurrentTier } from '@/lib/tiers';
import { getBotTierSettings } from '@/lib/tiers';
import { tierIcons, tierClassNames } from '@/lib/settings';

const MOCK_USER_ID = 'mock-user-123';

export type SquadMember = {
    id: string;
    username: string;
    rank: { name: string; Icon: any; className: string };
    tier: { name: string; Icon: any; className: string };
    team: SquadMember[];
};

export async function GET(request: Request) {
    try {
        const tierSettings = await getBotTierSettings();

        // This is mock data and would be replaced by a database query in a real app
        const mockSquad: Omit<SquadMember, 'rank' | 'tier'>[] = [
            { id: 'mock-member-1', username: 'SquadMemberOne', team: [] },
            { id: 'mock-member-2', username: 'SquadMemberTwo', team: [] },
        ];

        const squadWithDetails = mockSquad.map(member => {
            // Simulate different balances for different ranks/tiers
            const mockBalance = Math.random() * 10000;
            const rank = getUserRank(mockBalance);
            const tier = getCurrentTier(mockBalance, tierSettings);

            return {
                ...member,
                rank: {
                    name: rank.name,
                    Icon: rank.Icon, // Note: This will be a function, can't be serialized directly but NextJS handles it.
                    className: rank.className,
                },
                tier: tier ? {
                    name: tier.name,
                    Icon: tierIcons[tier.id],
                    className: tierClassNames[tier.id],
                } : {
                    name: 'N/A',
                    Icon: tierIcons['tier-1'],
                    className: tierClassNames['tier-1'],
                },
            };
        });

        return NextResponse.json(squadWithDetails);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch squad data' }, { status: 500 });
    }
}
