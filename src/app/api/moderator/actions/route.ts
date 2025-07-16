'use server';

import {createClient} from '@/lib/supabase/server';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const {data, error} = await supabase
      .from('action_logs')
      .select(
        `
        *,
        user:profiles(username)
      `
      )
      .order('created_at', {ascending: false});

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
