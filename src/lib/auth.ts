
'use server';

import { createClient } from './supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createAdminClient } from './supabase/admin';

export async function login(credentials: { email?: string; password?: string; }) {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Special handling for admin login to bypass standard flow if needed
  // and ensure the admin user exists.
  if (credentials.email === adminEmail) {
    if (credentials.password !== adminPassword) {
        return { error: "Invalid password for admin." };
    }

    const supabaseAdmin = createAdminClient();

    // Check if admin user exists in Supabase Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (listError) {
        return { error: `Failed to query users: ${listError.message}` };
    }

    let adminUser = users.find(u => u.email === adminEmail);

    // If admin does not exist, create it.
    if (!adminUser) {
        const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true, // Auto-confirm admin email
        });

        if (createError) {
            return { error: `Failed to create admin user: ${createError.message}` };
        }
        if (!user) {
            return { error: "Failed to create admin user, no user returned." };
        }
        adminUser = user;

        // Also create a profile and wallet for the admin
        await supabaseAdmin.from('profiles').insert({ user_id: adminUser.id, username: 'admin' });
        await supabaseAdmin.from('wallets').insert({ user_id: adminUser.id });
    }
    
    // Now that we're sure the user exists, sign them in with the server client
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(credentials);

    if (signInError) {
        // This might happen if there's a temporary issue, but the user does exist.
        return { error: `Admin sign-in failed: ${signInError.message}`};
    }

    return { data: null, error: null };
  }

  // Standard user login
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

  // 1. Create the user in the auth system
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
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
      const { data: leaderProfile } = await adminSupabase
        .from('profiles')
        .select('user_id')
        .eq('referral_code', squad_referral_code)
        .single();
      if (leaderProfile) {
        squad_leader_id_val = leaderProfile.user_id;
      }
    }
    
    let generated_referral_code;
    let isUnique = false;
    while (!isUnique) {
        generated_referral_code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const { data: existingProfile } = await adminSupabase
            .from('profiles')
            .select('user_id')
            .eq('referral_code', generated_referral_code)
            .single();
        if (!existingProfile) {
            isUnique = true;
        }
    }

    const { error: profileError } = await adminSupabase.from('profiles').insert({
      user_id: user.id,
      username: username,
      contact_number: contact_number,
      country: country,
      squad_leader_id: squad_leader_id_val,
      referral_code: generated_referral_code,
    });
    
    if (profileError) {
      await adminSupabase.auth.admin.deleteUser(user.id);
      return `Database error: ${profileError.message}`;
    }

    const { error: walletError } = await adminSupabase.from('wallets').insert({
      user_id: user.id
    });

    if (walletError) {
      await adminSupabase.auth.admin.deleteUser(user.id);
      return `Database error creating wallet: ${walletError.message}`;
    }

  } catch (error: any) {
    const adminSupabase = createAdminClient();
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
