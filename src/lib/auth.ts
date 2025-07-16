

'use server';

import { createClient } from './supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createAdminClient } from './supabase/admin';
import sql from './db';

export async function login(credentials: { email?: string; password?: string; }) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email!,
    password: credentials.password!,
  });
  
  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function register(credentials: { email?: string; password?: string, options?: any }) {
    const adminSupabase = createAdminClient();
    const { username, email, password, contact_number, country, referral_code: squad_referral_code } = credentials.options.data;

    try {
        // Use a transaction to ensure all or nothing
        const result = await sql.begin(async (sql) => {
            // 1. Check if username exists
            const existingUsers = await sql`SELECT user_id FROM public.profiles WHERE username = ${username}`;
            if (existingUsers.count > 0) {
                throw new Error('Registration failed: Username is already taken.');
            }

            // 2. Create the auth user
            const { data: { user }, error: signUpError } = await adminSupabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true, // Auto-confirm user
                user_metadata: {
                    username: username,
                    country: country,
                }
            });

            if (signUpError) {
                // Check for a specific "User already registered" message
                if (signUpError.message.includes('already registered')) {
                     throw new Error('Registration failed: This email is already in use.');
                }
                throw new Error(`Auth error: ${signUpError.message}`);
            }

            if (!user) {
                throw new Error('Auth error: User not created.');
            }

            // 3. Determine squad leader
            let squad_leader_id_val: string | null = null;
            if (squad_referral_code) {
                const leaderProfile = await sql`SELECT user_id FROM public.profiles WHERE referral_code = ${squad_referral_code}`;
                if (leaderProfile.count > 0) {
                    squad_leader_id_val = leaderProfile[0].user_id;
                }
            }

            // 4. Generate a unique referral code
            let generated_referral_code;
            let isUnique = false;
            while (!isUnique) {
                generated_referral_code = Math.random().toString(36).substring(2, 10).toUpperCase();
                const existingCode = await sql`SELECT user_id FROM public.profiles WHERE referral_code = ${generated_referral_code}`;
                if (existingCode.count === 0) {
                    isUnique = true;
                }
            }

            // 5. Create the profile
            await sql`
                INSERT INTO public.profiles (user_id, username, full_name, contact_number, country, squad_leader_id, referral_code)
                VALUES (${user.id}, ${username}, ${username}, ${contact_number}, ${country}, ${squad_leader_id_val}, ${generated_referral_code})
            `;
            
            // 6. Create the wallet
            await sql`
                INSERT INTO public.wallets (user_id) VALUES (${user.id})
            `;

            return { user_id: user.id };
        });

        return null; // Success
    } catch (error: any) {
        // The transaction will automatically rollback on error.
        // Return a user-friendly message.
        console.error("Registration transaction failed:", error.message);
        return error.message;
    }
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
