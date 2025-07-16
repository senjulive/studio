
'use server';

import { getBotTierSettings } from './settings';
import { createClient } from './supabase/server';
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
        .select('*, profile:profiles!inner(*), squad:profiles!inner(squad_leader:profiles(username))')
        .eq('user_id', user.id)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
    }

    if (wallet) {
        // Check if daily reset is needed
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const lastReset = wallet.growth?.last_reset ? new Date(wallet.growth.last_reset).getTime() : 0;

        if (now - lastReset > oneDay) {
            const settings = await getBotTierSettings();
            const balance = wallet.balances?.usdt || 0;
            const currentTier = [...settings].reverse().find(tier => balance >= tier.balanceThreshold) || settings[0];
            
            const updatedGrowth = {
                ...wallet.growth,
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

    // If no wallet, a trigger in Supabase should have created one.
    // We try fetching again after a short delay.
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { data: newWallet, error: newWalletError } = await supabase
        .from('wallets')
        .select('*, profile:profiles!inner(*), squad:profiles!inner(squad_leader:profiles(username))')
        .eq('user_id', user.id)
        .single();

    if (newWalletError) {
        throw new Error("Failed to create or find wallet for user.");
    }

    return newWallet as WalletData;
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
    const newAddresses = {
        ...(wallet.security?.withdrawalAddresses || {}),
        [asset]: address,
    };
    await updateWallet({ 
        security: {
            ...(wallet.security || {}),
            withdrawalAddresses: newAddresses
        } 
    });
}

export async function getWithdrawalAddresses(): Promise<WithdrawalAddresses> {
    const wallet = await getOrCreateWallet();
    return wallet.security?.withdrawalAddresses || {};
}
