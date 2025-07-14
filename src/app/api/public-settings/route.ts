
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json({ error: 'A key is required' }, { status: 400 });
    }
    
    const supabase = createClient();
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single();
    
    if (error) {
        // If the key is not found, Supabase returns an error. We want to return null.
        if (error.code === 'PGRST116') {
            return NextResponse.json(null);
        }
        throw error;
    }

    return NextResponse.json(data?.value || null);
  } catch (error: any) {
    console.error("Error fetching public setting:", error.message);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
