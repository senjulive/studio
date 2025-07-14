
import { ranks, getUserRank } from '@/lib/ranks';
import { getCurrentTier, getBotTierSettings } from '@/lib/settings';
import { createClient } from '@/lib/supabase/server';
import type { Rank } from '@/lib/ranks';
import type { TierSetting } from '@/lib/settings';
import { NextResponse } from 'next/server';

export type SquadMember = {
    id: string;
    username: string;
    balance: number;
    rank: { name: Rank['name']; Icon: Rank['Icon'], className: Rank['className'] };
    tier: { name: TierSetting['name']; Icon: TierSetting['Icon'], className: TierSetting['className'] };
    team: SquadMember[];
};

export async function GET(request: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const tierSettings = await getBotTierSettings();

        // This is a simplified version. A real implementation would use a recursive query
        // or a more complex logic to fetch the entire squad hierarchy.
        // For now, we fetch direct referrals.
        const { data: members, error } = await supabase
            .from('profiles')
            .select('user_id, username, wallets(balances)')
            .eq('squad_leader_id', user.id);

        if (error) throw error;
        
        const squadList: SquadMember[] = members.map((member: any) => {
            const balance = member.wallets?.balances?.usdt || 0;
            const rank = getUserRank(balance);
            const tier = getCurrentTier(balance, tierSettings);

            return {
                id: member.user_id,
                username: member.username,
                balance,
                rank: { name: rank.name, Icon: rank.Icon, className: rank.className },
                tier: tier ? { name: tier.name, Icon: tier.Icon, className: tier.className } : { name: 'N/A', Icon: () => null, className: '' },
                team: [], // Nested teams not implemented in this version
            };
        });

        return NextResponse.json(squadList);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
