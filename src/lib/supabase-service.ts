
import { createClient } from '@supabase/supabase-js';

// These variables are only available on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('YOUR_SUPABASE_URL_HERE') && !supabaseServiceKey.includes('YOUR_SUPABASE_SERVICE_KEY_HERE');

if (!isConfigured) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn("Supabase URL and/or service role key are not defined in .env. Admin features will not work until they are added.");
    }
}

// The service role client for admin operations that bypasses RLS.
// IMPORTANT: This should ONLY be used in server-side code (e.g., API routes).
export const supabaseService = createClient(
    isConfigured ? supabaseUrl! : 'http://localhost:54321', 
    isConfigured ? supabaseServiceKey! : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.M-toASj1I4j1gOApd-L4R0nyts3S-1d9325y9j2JtT8', // dummy service role key
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Xx#%admin%34%xX";
