
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseService } from '@/lib/supabase-service';

export type SquadMember = {
    id: string;
    username: string | null;
    team: SquadMember[];
};

export async function GET(request: Request) {
    const cookieStore = cookies();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data: allWallets, error } = await supabaseService
            .from('wallets_public')
            .select('id, username, squad_leader_id');

        if (error) throw error;
        
        const userMap = new Map<string, SquadMember>();
        allWallets.forEach(w => {
            userMap.set(w.id, {
                id: w.id,
                username: w.username,
                team: [],
            });
        });

        allWallets.forEach(w => {
            if (w.squad_leader_id && userMap.has(w.squad_leader_id)) {
                const parentNode = userMap.get(w.squad_leader_id)!;
                const childNode = userMap.get(w.id)!;
                parentNode.team.push(childNode);
            }
        });
        
        const userSquad = userMap.get(user.id);
        const responseTree = userSquad ? userSquad.team : [];

        return NextResponse.json(responseTree);

    } catch (error: any) {
        console.error("Error fetching squad tree:", error.message);
        return NextResponse.json(
            { error: 'An unexpected error occurred while fetching squad data.' },
            { status: 500 }
        );
    }
}
