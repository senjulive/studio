
'use server';

import { redirect } from 'next/navigation';

// Mock authentication functions after removing Supabase.
// In a real app, this would interact with your actual authentication backend.

export async function login(credentials: any) {
  console.log("Mock Login Attempt with:", credentials.email);
  if (!credentials.email || !credentials.password) {
    return { error: 'Email and password are required.' };
  }
  // Simulate successful login
  return { error: null };
}

export async function register(credentials: any) {
  console.log("Mock Registration Attempt for:", credentials.email, credentials.options.data);
  
  if (!credentials.email || !credentials.password) {
      return { error: 'Email and password are required.' };
  }

  if (!credentials.options.data.username) {
      return { error: 'Username is required.' };
  }

  // Simulate successful registration
  return { error: null };
}

export async function logout() {
  console.log("Mock Logout");
  // In a real app, you would clear the session/token here.
  redirect('/');
}

export async function resetPasswordForEmail(email: string) {
  console.log("Mock Password Reset requested for:", email);
  // In a real app, you would trigger a password reset flow here.
  // We'll return null to simulate success, preventing the UI from showing an error.
  return null;
}
