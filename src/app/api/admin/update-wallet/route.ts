
import { NextResponse } from 'next/server';
import { supabaseService, ADMIN_PASSWORD } from '@/lib/supabase-service';
import type { WalletData } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const { adminPassword, userId, newWalletData } = (await request.json()) as {
      adminPassword: string;
      userId: string;
      newWalletData: WalletData;
    };

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update private wallet data
    const { error: privateError } = await supabaseService
        .from('wallets')
        .update({ data: newWalletData as any })
        .eq('id', userId);

    if (privateError) throw privateError;

    // Update public wallet balances
    const { error: publicError } = await supabaseService
        .from('wallets_public')
        .update({ balances: newWalletData.balances as any })
        .eq('id', userId);
    
    if (publicError) {
        console.warn(`Could not update public balance for ${userId}: ${publicError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
