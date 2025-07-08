
import { NextResponse } from 'next/server';
import { supabaseService, ADMIN_PASSWORD } from '@/lib/supabase-service';

export async function POST(request: Request) {
  try {
    const { adminPassword } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseService.from('wallets').select('id, data');

    if (error) {
      throw error;
    }

    const wallets: Record<string, any> = {};
    for (const row of data) {
      wallets[row.id] = row.data;
    }

    return NextResponse.json(wallets);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
