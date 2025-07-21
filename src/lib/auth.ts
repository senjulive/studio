
'use server';

import { redirect } from 'next/navigation';

// Mock authentication functions after removing Supabase

type Credentials = {
    email?: string;
    password?: string;
    options?: any;
}

const MOCK_ADMIN_EMAIL = "admin@astralcore.io";
const MOCK_MODERATOR_EMAIL = "moderator@astralcore.io";

export async function login(credentials: Credentials) {
  console.log("Mock Login Attempt with:", credentials.email);
  
  if (!credentials.email || !credentials.password) {
      return { error: "Please provide both email and password." };
  }

  if (credentials.email === MOCK_ADMIN_EMAIL && credentials.password === "admin") {
      return { error: null };
  }

  if (credentials.email === MOCK_MODERATOR_EMAIL && credentials.password === "moderator") {
      return { error: null };
  }

  // Allow any other login for demo purposes
  if (credentials.email.includes('@')) {
      return { error: null };
  }
  
  return { error: "Invalid credentials" };
}

export async function register(credentials: Credentials) {
  console.log("Mock Registration Attempt for:", credentials.email);
  
  if (credentials.email && credentials.password) {
    if (credentials.email === MOCK_ADMIN_EMAIL || credentials.email === MOCK_MODERATOR_EMAIL) {
        return { error: "This email is reserved. Please use a different email." };
    }
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
