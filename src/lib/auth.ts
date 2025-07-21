
'use server';

import { redirect } from 'next/navigation';

// Mock authentication functions after removing Supabase

export async function login(credentials: any) {
  console.log("Mock Login Attempt with:", credentials.email);
  // This is a mock. In a real app, you'd validate credentials against a database.
  // For this demo, any login is considered successful.
  if (credentials.email && credentials.password) {
    return { error: null };
  }
  return { error: "Invalid credentials" };
}

export async function register(credentials: any) {
  console.log("Mock Registration Attempt for:", credentials.email);
  // This is a mock. In a real app, you'd create a new user.
  // For this demo, registration is always successful to allow UI flow.
  if (credentials.email && credentials.password) {
    return { error: null };
  }
  return { error: 'Registration failed. Please provide all required information.' };
}

export async function logout() {
  // In a real app, you would clear the session/token here.
  redirect('/');
}

export async function resetPasswordForEmail(email: string) {
  console.log("Mock Password Reset requested for:", email);
  // In a real app, you would trigger a password reset flow (e.g., send an email).
  // For this demo, we just log the request and return success.
  return null;
}
