'use server';

import {createAdminClient} from '@/lib/supabase/admin';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const {userId} = await request.json();
    if (!userId) {
      return NextResponse.json({error: 'User ID is required'}, {status: 400});
    }

    const supabaseAdmin = createAdminClient();

    const {error: walletError} = await supabaseAdmin
      .from('wallets')
      .update({verification_status: 'verified'})
      .eq('user_id', userId);

    if (walletError) throw walletError;

    return NextResponse.json({
      success: true,
      message: 'User verified successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
