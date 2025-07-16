
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    
    const { data: wallets, error } = await supabaseAdmin
        .from('wallets')
        .select(`
            *,
            profile:profiles!inner(username, full_name)
        `);

    if (error) throw error;
    
    const walletsMap = wallets.reduce((acc, wallet) => {
        const profileData = Array.isArray(wallet.profile) ? wallet.profile[0] : wallet.profile;
        acc[wallet.user_id] = {
            ...wallet,
            profile: {
                ...profileData,
                username: profileData?.username,
                fullName: profileData?.full_name,
            }
        };
        return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(walletsMap);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
