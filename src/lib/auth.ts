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
  console.log("Mock Registration Attempt for:", credentials.email);
  
  if (credentials.email && credentials.password) {
    if (credentials.email === MOCK_ADMIN_EMAIL || credentials.email === MOCK_MODERATOR_EMAIL) {
        return { error: "This email is reserved. Please use a different email." };
    }
    
    // Create a new mock user wallet
    const newUserId = `mock-user-${crypto.randomUUID()}`;
    const countryInfo = countries.find(c => c.name === credentials.options?.data?.country);
    
    const newWallet = {
        addresses: { usdt: "" },
        balances: { usdt: 10, btc: 0, eth: 0 }, // Start with a small bonus
        pending_withdrawals: [],
        pending_deposits: [],
        created_at: new Date().toISOString(),
        growth: {
            clicksLeft: 4,
            lastReset: new Date().toISOString(),
            dailyEarnings: 0,
            earningsHistory: [],
        },
        squad: {
            referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            members: [],
            squad_leader: credentials.options?.data?.referral_code ? { username: 'DefaultUser' } : null,
        },
        profile: {
            username: credentials.options?.data?.username || newUserId,
            fullName: "",
            idCardNo: "",
            contactNumber: credentials.options?.data?.contact_number || "",
            country: countryInfo?.name || "Unknown",
            avatarUrl: "",
            verificationStatus: "unverified",
        },
        security: {
            withdrawalAddresses: {},
        },
        verification_status: 'unverified',
    };
    
    // This is a mock implementation, so we're not actually saving to a persistent store here.
    // In a real app, you would write this newWallet to your database.
    // For now, we just log that it would be created.
    console.log("A new user wallet would be created with ID:", newUserId, newWallet);
    
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
  return null;
}
