
'use server';

import { createClient } from './supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function login(credentials: { email?: string; password?: string; }) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    return error.message;
  }
  return null;
}

export async function register(credentials: { email?: string; password?: string, options?: any }) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp(credentials);
  if (error) {
    return error.message;
  }
  return null;
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
    });
    if (error) {
        return error.message;
    }
    return null;
}

export async function verifyOtp(token: string, type: EmailOtpType) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ token, type });
     if (error) {
        return error.message;
    }
    return null;
}
