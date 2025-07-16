'use server';

import {createAdminClient} from '@/lib/supabase/admin';
import {NextResponse} from 'next/server';
import {logModeratorAction} from '@/lib/moderator';

export async function GET(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const {data, error} = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'moderators')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json(data?.value || []);
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function POST(request: Request) {
  try {
    const {moderators} = await request.json();
    const supabaseAdmin = createAdminClient();

    const {data, error} = await supabaseAdmin
      .from('settings')
      .upsert({key: 'moderators', value: moderators}, {onConflict: 'key'})
      .select()
      .single();

    if (error) throw error;

    await logModeratorAction('Admin updated moderator settings.');

    return NextResponse.json({success: true, data: data.value});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
