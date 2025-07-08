import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE_URL_HERE');


if (!isConfigured) {
  // This warning will show up in the server logs during development.
  console.warn("Supabase URL and/or anon key are not defined in .env. The app will build, but Supabase features will not work until they are added.");
}

// Pass placeholder values if the variables are not set or are placeholders.
// createClient requires valid-looking values and will throw an error on empty strings.
// Subsequent calls to Supabase will fail gracefully without crashing the app.
export const supabase = createClient(
  isConfigured ? supabaseUrl! : 'http://localhost:54321', 
  isConfigured ? supabaseAnonKey! : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
)
