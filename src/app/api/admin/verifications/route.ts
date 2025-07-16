
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    
    const { data: verifications, error } = await supabaseAdmin
        .from('wallets')
        .select(`
            user_id,
            verification_status,
            profile:profiles!inner(*)
        `)
        .in('verification_status', ['verifying', 'unverified']);

    if (error) throw error;
    
    return NextResponse.json(verifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
