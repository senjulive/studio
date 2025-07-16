
'use server';

import { getBotTierSettings } from './settings';
import { createClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import type { Database } from './database.types';

export type WalletData = Database['public']['Tables']['wallets']['Row'] & { profile: ProfileData } & { squad: { squad_leader: { username: string } | null, members: any[] } };
export type ProfileData = Database['public']['Tables']['profiles']['Row'];
export type WithdrawalAddresses = WalletData['security']['withdrawalAddresses'];

// Called only from a server component or API route
export async function getOrCreateWallet(): Promise<WalletData> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated.");
    }
    
    // Retry mechanism to handle replication delay from the trigger
    for (let i = 0; i < 3; i++) {
        const { data: wallet, error } = await supabase
            .from('wallets')
            .select('*, profile:profiles!inner(*), squad:profiles!inner(squad_leader:profiles(username))')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            console.error(`Attempt ${i+1} to fetch wallet failed:`, error.message);
            // Don't throw immediately, allow retries
        }

        if (wallet) {
            // Check if daily reset is needed
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            const lastReset = (wallet.growth as any)?.last_reset ? new Date((wallet.growth as any).last_reset).getTime() : 0;

            if (now - lastReset > oneDay) {
                const settings = await getBotTierSettings();
                const balance = (wallet.balances as any)?.usdt || 0;
                const currentTier = [...settings].reverse().find(tier => balance >= tier.balanceThreshold) || settings[0];
                
                const updatedGrowth = {
                    ...(wallet.growth as any),
                    clicks_left: currentTier.clicks,
                    last_reset: new Date().toISOString(),
                    daily_earnings: 0,
                };

                const { data: updatedWallet, error: updateError } = await supabase
                    .from('wallets')
                    .update({ growth: updatedGrowth })
                    .eq('user_id', user.id)
                    .select('*, profile:profiles!inner(*), squad:profiles!inner(squad_leader:profiles(username))')
                    .single();
                
                if (updateError) throw updateError;
                return updatedWallet as WalletData;
            }
            return wallet as WalletData;
        }
        
        // If no wallet after a short delay, try to create it manually as a fallback.
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // If wallet is still not found after retries, create it manually.
    // This is a fallback for the database trigger.
    console.warn(`Wallet not found for user ${user.id} after retries. Manually creating.`);
    const supabaseAdmin = createAdminClient();
    const { data: newWallet, error: creationError } = await supabaseAdmin.rpc('handle_new_user');
    
    if (creationError) {
        throw new Error(`Failed to create wallet for user ${user.id}: ${creationError.message}`);
    }

    // Fetch the newly created wallet one last time
    const { data: finalWallet, error: finalError } = await supabase
        .from('wallets')
        .select('*, profile:profiles!inner(*), squad:profiles!inner(squad_leader:profiles(username))')
        .eq('user_id', user.id)
        .single();
    
    if (finalError || !finalWallet) {
        throw new Error("Failed to retrieve wallet even after manual creation.");
    }
    
    return finalWallet as WalletData;
}


// Updates a user's own wallet data.
export async function updateWallet(newData: Partial<WalletData>): Promise<void> {
    const supabase = createClient();
     const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    const { profile, squad, ...walletData } = newData;

    const { error } = await supabase
        .from('wallets')
        .update(walletData)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error updating wallet:", error);
        throw error;
    }
}

export async function saveWithdrawalAddress(asset: string, address: string): Promise<void> {
    const wallet = await getOrCreateWallet();
    const currentSecurity = wallet.security as any || {};
    const newAddresses = {
        ...(currentSecurity.withdrawalAddresses || {}),
        [asset]: address,
    };
    await updateWallet({ 
        security: {
            ...currentSecurity,
            withdrawalAddresses: newAddresses
        } 
    });
}

export async function getWithdrawalAddresses(): Promise<WithdrawalAddresses> {
    const wallet = await getOrCreateWallet();
    return (wallet.security as any)?.withdrawalAddresses || {};
}
