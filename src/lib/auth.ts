
'use server';

import { createClient } from './supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createAdminClient } from './supabase/admin';
import { cookies } from 'next/headers';


export async function login(credentials: { email?: string; password?: string; }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email!,
    password: credentials.password!,
  });
  
  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function register(credentials: { email: string; password: string, options?: any }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
            data: credentials.options?.data,
            // emailRedirectTo is not required when auto-confirming
        }
    });

    if (error) {
        console.error("Registration error:", error.message);
        if (error.message.includes('already registered')) {
            return { error: 'Registration failed: This email is already in use.' };
        }
        if (error.message.includes('Username is already taken')) {
            return { error: 'Registration failed: This username is already taken.' };
        }
        return { error: `Registration failed: ${error.message}` };
    }

    // After successful sign-up, if email confirmation is disabled,
    // a session is created automatically. If not, the user needs to confirm their email.
    // For this app, we assume auto-confirmation is enabled in Supabase settings.

    return { error: null };
}


export async function logout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
    });
    if (error) {
        return error.message;
    }
    return null;
}

export async function verifyOtp(token: string, type: EmailOtpType) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.verifyOtp({ token, type });
     if (error) {
        return error.message;
    }
    return null;
}
