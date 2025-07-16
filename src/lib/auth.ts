
'use server';

import { createClient } from './supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export async function login(credentials: SignInWithPasswordCredentials) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.error('Login error:', error.message);
    return { error: 'Could not authenticate user. Please check your credentials.' };
  }

  return { error: null }
}

export async function register(credentials: SignUpWithPasswordCredentials) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp(credentials);

  if (error) {
    console.error('Registration Error:', error.message);
    // Provide more specific feedback to the user
    if (error.message.includes('already registered')) {
        return { error: 'Email already in use. Please log in.' };
    }
    return { error: `Could not authenticate user: ${error.message}`};
  }
  
  // After sign-up, Supabase sends a confirmation email (if enabled).
  // For this app, we have auto-confirm on, so we can sign them in directly.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInError) {
      console.error('Sign-in after-signup error:', signInError.message);
      return { error: 'Registration successful, but login failed. Please try logging in manually.' };
  }

  return { error: null }
}

export async function logout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect('/');
}

export async function resetPasswordForEmail(email: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    let redirectUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    if (redirectUrl && !redirectUrl.endsWith('/')) {
        redirectUrl += '/';
    }
    redirectUrl += 'auth/callback?next=/update-password';
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
    });
    if (error) {
        return error.message;
    }
    return null;
}
