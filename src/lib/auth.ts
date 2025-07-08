'use client';

// This file handles auth using Supabase.
import { supabase } from '@/lib/supabase';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export async function register(credentials: SignUpWithPasswordCredentials): Promise<void> {
    const { error } = await supabase.auth.signUp(credentials);
    if (error) {
        throw new Error(error.message);
    }
}

export async function login(credentials: SignInWithPasswordCredentials): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
        throw new Error(error.message);
    }
}

export async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
    }
}

export async function getCurrentUser() {
    // Note: To be fully secure, this should ideally be called in a server component
    // or an API route to avoid exposing the session to the client-side directly in all cases.
    // For this app's structure, we'll use it on the client and protect routes.
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
}


export async function resetPasswordForEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    // Don't expose specific errors like "User not found" for security reasons.
    console.error("Password reset error:", error.message);
    // We can throw a generic error or just return, the UI will show a generic message.
  }
}
