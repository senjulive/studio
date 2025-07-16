
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
    
    const { data: wallet, error } = await supabase
        .from('wallets')
        .select('*, profile:profiles(*), squad:profiles(squad_leader:profiles(username))')
        .eq('user_id', user.id)
        .maybeSingle();

    if (error) {
        console.error(`Error fetching wallet for user ${user.id}:`, error.message);
        throw error;
    }

    if (wallet && wallet.profile) {
        // Daily reset logic if wallet exists
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

    // If wallet or profile doesn't exist, it means this is a new user or there's an issue.
    // We will attempt a robust creation/retrieval.
    console.log(`Wallet or profile not found for user ${user.id}. Attempting to create/verify.`);
    const supabaseAdmin = createAdminClient();
    const { error: rpcError } = await supabaseAdmin.rpc('handle_new_user_by_id', { user_id_param: user.id });

    if (rpcError) {
        console.error(`RPC handle_new_user_by_id failed for ${user.id}:`, rpcError.message);
        throw new Error(`Failed to initialize user data: ${rpcError.message}`);
    }
    
    // After manually invoking the trigger, try fetching one more time.
    await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for replication
    
    const { data: finalWallet, error: finalError } = await supabase
        .from('wallets')
        .select('*, profile:profiles(*), squad:profiles(squad_leader:profiles(username))')
        .eq('user_id', user.id)
        .single();
    
    if (finalError || !finalWallet) {
        console.error(`FATAL: Could not retrieve wallet for user ${user.id} even after manual creation.`, finalError);
        throw new Error(`Failed to retrieve wallet for user ${user.id}.`);
    }

    return finalWallet as WalletData;
}


// Updates a user's own wallet data.
export async function updateWallet(newData: Partial<WalletData>): Promise<WalletData | null> {
    const supabase = createClient();
     const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    const { profile, squad, ...walletData } = newData;

    const { data, error } = await supabase
        .from('wallets')
        .update(walletData)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating wallet:", error);
        throw error;
    }
    return data;
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
