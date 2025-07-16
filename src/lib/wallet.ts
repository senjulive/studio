
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
    
    const fetchWalletWithRetry = async (attempt: number): Promise<WalletData | null> => {
        const { data: wallet, error } = await supabase
            .from('wallets')
            // Use a left join (default) instead of inner to be more resilient
            .select('*, profile:profiles(*), squad:profiles(squad_leader:profiles(username))')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (error) {
            console.error(`Attempt ${attempt} to fetch wallet failed:`, error.message);
        }

        // Also check if the profile relation exists
        if (wallet && wallet.profile) {
            return wallet as WalletData;
        }

        return null;
    }

    // Retry mechanism to handle replication delay from the trigger
    let wallet = await fetchWalletWithRetry(1);
    if (!wallet) {
        await new Promise(resolve => setTimeout(resolve, 500));
        wallet = await fetchWalletWithRetry(2);
    }
    if (!wallet) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        wallet = await fetchWalletWithRetry(3);
    }

    if (!wallet) {
        console.warn(`Wallet not found for user ${user.id} after retries. Manually invoking creation logic.`);
        const supabaseAdmin = createAdminClient();
        const { error: rpcError } = await supabaseAdmin.rpc('handle_new_user_by_id', { user_id_param: user.id });

        if (rpcError) {
            throw new Error(`Manual wallet creation failed: ${rpcError.message}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500)); // wait after manual creation
        wallet = await fetchWalletWithRetry(4);

        if (!wallet) {
            throw new Error(`Failed to retrieve wallet even after manual creation for user ${user.id}.`);
        }
    }
            
    // Check if daily reset is needed
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const growthData = wallet.growth as any;
    const lastReset = growthData?.last_reset ? new Date(growthData.last_reset).getTime() : 0;

    if (now - lastReset > oneDay) {
        const settings = await getBotTierSettings();
        const balance = (wallet.balances as any)?.usdt || 0;
        const currentTier = [...settings].reverse().find(tier => balance >= tier.balanceThreshold) || settings[0];
        
        const updatedGrowth = {
            ...growthData,
            clicks_left: currentTier.clicks,
            last_reset: new Date().toISOString(),
            daily_earnings: 0,
        };

        const { data: updatedWallet, error: updateError } = await supabase
            .from('wallets')
            .update({ growth: updatedGrowth })
            .eq('user_id', user.id)
            .select('*, profile:profiles(*), squad:profiles(squad_leader:profiles(username))')
            .single();
        
        if (updateError) throw updateError;
        return updatedWallet as WalletData;
    }
    
    return wallet as WalletData;
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
