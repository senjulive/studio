
import { NextResponse } from 'next/server';
import { supabaseService, ADMIN_PASSWORD } from '@/lib/supabase-service';

// POST handler to save/update a setting
export async function POST(request: Request) {
  try {
    const { adminPassword, key, value } = await request.json();

    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Setting key and value are required' }, { status: 400 });
    }

    const { error } = await supabaseService.from('settings').upsert({ key, value });
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
