
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, fullName, idCardNo, address, dateOfBirth } = await request.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!userId || !fullName || !idCardNo || !address || !dateOfBirth) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    if (!/^\d{9,}$/.test(idCardNo)) {
        return NextResponse.json({ success: false, error: 'ID Card Number must be at least 9 digits.' }, { status: 400 });
    }
    
    const supabaseAdmin = createAdminClient();

    // Check for uniqueness
    const { data: existingProfile, error: uniqueError } = await supabaseAdmin
        .from('profiles')
        .select('user_id')
        .eq('id_card_no', idCardNo)
        .neq('user_id', userId)
        .maybeSingle();

    if (uniqueError) throw uniqueError;

    if (existingProfile) {
      return NextResponse.json({ success: false, error: 'This ID Card Number is already in use.' }, { status: 409 });
    }

    // Update profile and wallet status
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
            full_name: fullName,
            id_card_no: idCardNo,
            address,
            date_of_birth: dateOfBirth,
        })
        .eq('user_id', userId);

    if (profileError) throw profileError;
    
    const { error: walletError } = await supabaseAdmin
        .from('wallets')
        .update({ verification_status: 'verifying' })
        .eq('user_id', userId);

    if (walletError) throw walletError;

    // Simulate the 2-minute verification delay
    setTimeout(async () => {
      try {
        const { error: verificationError } = await createAdminClient()
            .from('wallets')
            .update({ verification_status: 'verified' })
            .eq('user_id', userId);
        if (verificationError) throw verificationError;
        console.log(`Verification completed for user ${userId}`);
      } catch (error) {
        console.error(`Error completing verification for user ${userId}:`, error);
        // Optionally, handle the failure case (e.g., set status to 'failed')
        await createAdminClient()
            .from('wallets')
            .update({ verification_status: 'unverified' })
            .eq('user_id', userId);
      }
    }, 2 * 60 * 1000); // 2 minutes

    return NextResponse.json({ success: true, message: 'Profile update received. Verification is in progress.' });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

