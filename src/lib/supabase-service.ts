
import { createClient } from '@supabase/supabase-js';

// These variables are only available on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    if (process.env.NODE_ENV === 'development') {
        console.warn("Supabase URL and/or service role key are not defined in .env. Admin features will not work until they are added.");
    }
}

// The service role client for admin operations that bypasses RLS.
// IMPORTANT: This should ONLY be used in server-side code (e.g., API routes).
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Xx#%admin%34%xX";
