
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseService } from '@/lib/supabase-service';

// This route allows any authenticated user to fetch settings.
export async function GET(request: Request) {
    const cookieStore = cookies();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
        }
        
        // We use the service client to bypass RLS for reading settings,
        // since we've already confirmed the user is authenticated.
        const { data, error } = await supabaseService
            .from('settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

        return NextResponse.json(data?.value || null);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
