'use server';

import { redirect } from 'next/navigation';
import { getOrCreateWallet } from './wallet';

type Credentials = {
    email?: string;
    password?: string;
    options?: any;
}

type LoginResult = {
    error: string | null;
    role?: 'admin' | 'moderator' | 'user';
    user?: any;
}

export async function login(credentials: Credentials): Promise<LoginResult> {
  console.log("Login attempt for:", credentials.email);

  if (!credentials.email || !credentials.password) {
      return { error: "Please provide both email and password." };
  }

  // Client-side authentication will be handled by userStore
  // This server action just validates and returns success

  try {
    // Basic validation - actual auth happens client-side
    const email = credentials.email.toLowerCase().trim();
    const password = credentials.password.trim();

    if (email.length < 3 || password.length < 6) {
      return { error: "Invalid email or password format." };
    }

    // For demo purposes, create wallet for users
    if (!email.includes('admin') && !email.includes('moderator')) {
      await getOrCreateWallet(`user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`);
    }

    return { error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { error: "Login failed. Please try again." };
  }
}

export async function register(credentials: Credentials) {
  console.log("Registration attempt for:", credentials.email);

  if (!credentials.email || !credentials.password) {
    return { error: 'Please provide all required information.' };
  }

  try {
    const email = credentials.email.toLowerCase().trim();
    const password = credentials.password.trim();

    // Basic validation
    if (email.length < 3 || !email.includes('@')) {
      return { error: 'Please provide a valid email address.' };
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    // Check for reserved emails
    const reservedEmails = ['admin@astralcore.io', 'moderator@astralcore.io'];
    if (reservedEmails.includes(email)) {
      return { error: 'This email is reserved. Please use a different email.' };
    }

    // Create wallet for new user
    const userId = `user-${email.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    await getOrCreateWallet(userId);

    return { error: null };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Registration failed. Please try again.' };
  }
}

export async function logout() {
  // In a real app, you would clear the session/token here.
  redirect('/');
}

export async function resetPasswordForEmail(email: string) {
  console.log("Password reset requested for:", email);

  try {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { error: 'Please provide a valid email address.' };
    }

    // In a real app, you would:
    // 1. Check if email exists in database
    // 2. Generate secure reset token
    // 3. Save token with expiration
    // 4. Send email with reset link

    // For demo, we'll simulate the process
    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    console.log(`Reset token generated for ${normalizedEmail}: ${resetToken}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, message: 'If an account with this email exists, you will receive a password reset link.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error: 'Failed to process password reset. Please try again.' };
  }
}
