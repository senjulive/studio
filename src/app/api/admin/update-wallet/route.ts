
import { createAdminClient } from '@/lib/supabase/admin';
import type { WalletData } from '@/lib/wallet';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, newWalletData } = (await request.json()) as {
      userId: string;
      newWalletData: WalletData;
    };
    
    if (!userId || !newWalletData) {
        return NextResponse.json({ error: 'User ID and new wallet data are required' }, { status: 400 });
    }
    
    const supabaseAdmin = createAdminClient();
    
    const { data, error } = await supabaseAdmin
      .from('wallets')
      .update(newWalletData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
        throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
