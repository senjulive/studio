
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side environment
// as it has admin privileges and can bypass your Row Level Security policies.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! || "http://localhost:54321"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGgMecxjaw-bbBCXbDv19TPL4WouP3G4B3UbdF3Uab4"

export const createAdminClient = () => createClient<Database>(supabaseUrl, supabaseServiceKey);
