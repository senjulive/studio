'use client';

// This file handles auth using Supabase.
import { supabase } from '@/lib/supabase';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, User } from '@supabase/supabase-js';

const isSupabaseConfigured = () => {
    // Check if the environment variables are set and are not the placeholder values.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key && !url.includes('localhost');
};

export async function register(credentials: SignUpWithPasswordCredentials): Promise<User> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Please add your credentials to the .env file.");
    }
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) {
        throw new Error(error.message);
    }
    if (!data.user) {
        throw new Error("Registration did not return a user.");
    }
    return data.user;
}

export async function login(credentials: SignInWithPasswordCredentials): Promise<void> {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase is not configured. Please add your credentials to the .env file.");
    }
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error("Connection to Supabase failed. Please check your credentials and network connection.");
        }
        throw new Error(error.message);
    }
}

export async function logout(): Promise<void> {
    if (!isSupabaseConfigured()) return; // Don't block logout if offline
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
    }
}

export async function getCurrentUser() {
    if (!isSupabaseConfigured()) return null;
    // Note: To be fully secure, this should ideally be called in a server component
    // or an API route to avoid exposing the session to the client-side directly in all cases.
    // For this app's structure, we'll use it on the client and protect routes.
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
}


export async function resetPasswordForEmail(email: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Please add your credentials to the .env file.");
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    // Don't expose specific errors like "User not found" for security reasons.
    console.error("Password reset error:", error.message);
    // We can throw a generic error or just return, the UI will show a generic message.
  }
}
