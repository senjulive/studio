
'use server';

import { createClient } from './supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createAdminClient } from './supabase/admin';

export async function login(credentials: { email?: string; password?: string; }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  
  if (error) {
    return { error: error.message };
  }

  return { data, error: null };
}

export async function register(credentials: { email?: string; password?: string, options?: any }) {
  const supabase = createClient();
  const adminSupabase = createAdminClient();

  // --- Ensure Admin User Exists ---
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();
    if (!listError && !users.find(u => u.email === adminEmail)) {
      // Admin does not exist, create it.
      await adminSupabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm admin email
      });
    }
  }
  // --- End Admin Creation ---

  // 1. Create the user in the auth system
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      // We pass some data here for the user object, but will also save it to profiles
      data: {
        username: credentials.options?.data?.username,
        country: credentials.options?.data?.country,
      }
    }
  });

  if (signUpError) {
    return `Registration failed: ${signUpError.message}`;
  }
  if (!user) {
    return 'Registration failed: User not created.';
  }

  try {
    const { username, contact_number, country, referral_code: squad_referral_code } = credentials.options.data;

    let squad_leader_id_val: string | null = null;
    if (squad_referral_code) {
      const { data: leaderProfile, error: leaderError } = await adminSupabase
        .from('profiles')
        .select('user_id')
        .eq('referral_code', squad_referral_code)
        .single();
      if (leaderProfile) {
        squad_leader_id_val = leaderProfile.user_id;
      }
    }
    
    // 2. Generate a unique referral code
    let generated_referral_code;
    while (true) {
        generated_referral_code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const { data: existingProfile, error: checkError } = await adminSupabase
            .from('profiles')
            .select('user_id')
            .eq('referral_code', generated_referral_code)
            .single();
        if (!existingProfile) {
            break;
        }
    }

    // 3. Create the profile
    const { error: profileError } = await adminSupabase.from('profiles').insert({
      user_id: user.id,
      username: username,
      contact_number: contact_number,
      country: country,
      squad_leader_id: squad_leader_id_val,
      referral_code: generated_referral_code,
    });
    
    if (profileError) {
      // If profile fails, we should ideally delete the user from auth to allow them to retry
      await adminSupabase.auth.admin.deleteUser(user.id);
      return `Database error: ${profileError.message}`;
    }

    // 4. Create the wallet
    const { error: walletError } = await adminSupabase.from('wallets').insert({
      user_id: user.id
    });

    if (walletError) {
      await adminSupabase.auth.admin.deleteUser(user.id);
      // We could also delete the profile here for a full rollback
      return `Database error creating wallet: ${walletError.message}`;
    }

  } catch (error: any) {
    // Catch any other errors, delete the user, and return a generic message
    await adminSupabase.auth.admin.deleteUser(user.id);
    return `An unexpected error occurred during registration: ${error.message}`;
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
