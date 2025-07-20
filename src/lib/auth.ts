'use server';

import { redirect } from 'next/navigation';

// Mock authentication functions after removing Supabase

export async function login(credentials: any) {
  console.log("Attempted login with:", credentials.email);
  // In a real app, you'd validate against your new backend here.
  // For now, we'll just redirect to the dashboard.
  return { error: null };
}

export async function register(credentials: any) {
  console.log("Attempted registration for:", credentials.email);
  // In a real app, you would create a new user in your backend.
  return { error: 'Registration is currently disabled.' };
}

export async function logout() {
  // In a real app, you would clear the session/token here.
  redirect('/');
}

export async function resetPasswordForEmail(email: string) {
  console.log("Password reset requested for:", email);
  // In a real app, you would trigger a password reset flow here.
  return null;
}
