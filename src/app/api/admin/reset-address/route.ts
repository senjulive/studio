
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const { data: wallet, error: fetchError } = await supabaseAdmin
      .from('wallets')
      .select('security')
      .eq('user_id', userId)
      .single();

    if (fetchError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const updatedSecurity = {
      ...wallet.security,
      withdrawalAddresses: {},
    };

    const { error: updateError } = await supabaseAdmin
      .from('wallets')
      .update({ security: updatedSecurity })
      .eq('user_id', userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
