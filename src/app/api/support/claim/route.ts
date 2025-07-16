'use server';

import {createClient} from '@/lib/supabase/server';
import {NextResponse} from 'next/server';
import {logModeratorAction} from '@/lib/moderator';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const {supportUserId, action} = await request.json();
    if (!supportUserId)
      return NextResponse.json({error: 'User ID is required'}, {status: 400});

    const handlerId = action === 'claim' ? user.id : null;

    // We'll use a new `support_threads` table to manage claim status
    const {data, error} = await supabase
      .from('support_threads')
      .upsert(
        {user_id: supportUserId, handler_id: handlerId},
        {onConflict: 'user_id'}
      )
      .select('*, handler:profiles(username)')
      .single();

    if (error) throw error;

    if (action === 'claim') {
      await logModeratorAction(`Claimed support thread for user ${supportUserId}.`);
    } else {
      await logModeratorAction(
        `Unclaimed support thread for user ${supportUserId}.`
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {data, error} = await supabase
      .from('support_threads')
      .select('*, handler:profiles(username)');

    if (error) throw error;

    const claimStatusMap = data.reduce((acc, thread) => {
      acc[thread.user_id] = thread;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(claimStatusMap);
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
