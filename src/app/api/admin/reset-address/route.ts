
import { NextResponse } from 'next/server';
import { supabaseService, ADMIN_PASSWORD } from '@/lib/supabase-service';
import type { WalletData } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const { adminPassword, userId } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the current wallet data
    const { data: wallet, error: fetchError } = await supabaseService
      .from('wallets')
      .select('data')
      .eq('id', userId)
      .single();

    if (fetchError || !wallet) {
      throw new Error('Wallet not found for user.');
    }
    
    const walletData = wallet.data as WalletData;
    walletData.security.withdrawalAddresses = {};

    // Update the wallet data
    const { error: updateError } = await supabaseService
      .from('wallets')
      .update({ data: walletData as any })
      .eq('id', userId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
