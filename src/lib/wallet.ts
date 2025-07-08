
'use client';

import { supabase } from '@/lib/supabase';
import { getBotTierSettings } from './settings';
import { sendSystemNotification } from './chat';

const generateAddress = (prefix: string, length: number, chars: string): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + result;
};

const generateReferralCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export type WalletAddresses = {
    usdt: string;
};

export type WithdrawalAddresses = {
    usdt?: string;
};


export type WalletData = {
    addresses: WalletAddresses;
    balances: {
        usdt: number;
        btc: number;
        eth: number;
    };
    pendingWithdrawals: {
        id: string;
        amount: number;
        asset: 'usdt';
        address: string;
        timestamp: number;
    }[];
    growth: {
        clicksLeft: number;
        lastReset: number; // timestamp
        dailyEarnings: number;
        earningsHistory: { amount: number; timestamp: number }[];
    };
    squad: {
        referralCode: string;
        squadLeader?: { id: string, username: string };
        members: string[];
    };
    profile: {
        username: string;
        fullName: string;
        idCardNo: string;
        contactNumber: string;
        country: string;
        avatarUrl?: string;
    };
    security: {
        withdrawalAddresses: WithdrawalAddresses;
    };
};


// Helper to create a complete, new wallet data object with all required fields.
const createNewWalletDataObject = (): WalletData => {
    const trc20Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    return {
        addresses: {
            usdt: generateAddress('T', 33, trc20Chars),
        },
        balances: {
            usdt: 0,
            btc: 0,
            eth: 0,
        },
        pendingWithdrawals: [],
        growth: {
            clicksLeft: 4,
            lastReset: Date.now(),
            dailyEarnings: 0,
            earningsHistory: [],
        },
        squad: {
            referralCode: generateReferralCode(),
            members: [],
        },
        profile: {
            username: '',
            fullName: '',
            idCardNo: '',
            contactNumber: '',
            country: '',
            avatarUrl: '',
        },
        security: {
            withdrawalAddresses: {},
        },
    };
}


// Called after a new user signs up.
export async function createWallet(
    userId: string,
    email: string,
    username: string,
    contactNumber: string,
    country: string,
    referralCode?: string
): Promise<WalletData> {
    
    let newWalletData = createNewWalletDataObject();
    
    newWalletData.profile.username = username;
    newWalletData.profile.contactNumber = contactNumber;
    newWalletData.profile.country = country;

    // The new public wallet object to be inserted
    const publicWalletData: any = {
        id: userId,
        username: username,
        referral_code: newWalletData.squad.referralCode,
    };

    // Handle referral logic
    if (referralCode) {
        // Find the leader by their referral code
        const { data: leaderData, error: leaderError } = await supabase
            .from('wallets_public')
            .select('id, username')
            .eq('referral_code', referralCode.toUpperCase())
            .single();

        if (leaderData && !leaderError) {
            // Set the squad leader for the new user, this will be picked up by the trigger
            publicWalletData.squad_leader_id = leaderData.id;
            // Send a system notification to the new user's chat log, visible only to admin
            await sendSystemNotification(userId, `User registered with squad code ${referralCode} from leader ${leaderData.username} (${leaderData.id}).`);
        }
    }
    
    // Insert into public table, which triggers the DB function for rewards
    const { error: publicInsertError } = await supabase
        .from('wallets_public')
        .insert(publicWalletData);

    if (publicInsertError) {
        console.error("Error creating public wallet:", publicInsertError.message);
        throw new Error("Could not create public wallet for new user.");
    }

    // Fetch the updated balances from the public table after the trigger has run
    const { data: updatedPublicWallet, error: fetchError } = await supabase
        .from('wallets_public')
        .select('balances')
        .eq('id', userId)
        .single();
    
    if(fetchError || !updatedPublicWallet) {
        console.error("Error fetching updated wallet after trigger:", fetchError);
    } else {
        // Sync balances from public table to private JSONB
        newWalletData.balances = updatedPublicWallet.balances as WalletData['balances'];
    }

    // Create the private wallet data in the 'wallets' table
    const { error: privateInsertError } = await supabase.from('wallets').insert({
        id: userId,
        data: newWalletData as any,
    });

    if (privateInsertError) {
        console.error("Error creating private wallet:", privateInsertError.message);
        // Attempt to clean up public wallet if private fails
        await supabase.from('wallets_public').delete().eq('id', userId);
        throw new Error("Could not create private wallet for new user.");
    }
    
    return newWalletData;
}


// Fetches the current user's wallet, creating it if it doesn't exist.
export async function getOrCreateWallet(userId: string): Promise<WalletData> {
    const { data, error } = await supabase
        .from('wallets')
        .select('data')
        .eq('id', userId)
        .single();

    if (data) {
        const wallet = data.data as WalletData;

        // Sync balances from public table on every load to ensure consistency
        const { data: publicWallet } = await supabase.from('wallets_public').select('balances, squad_leader_id, squad_members').eq('id', userId).single();
        if (publicWallet) {
            wallet.balances = publicWallet.balances as WalletData['balances'];
            wallet.squad.members = publicWallet.squad_members as string[];
            if (publicWallet.squad_leader_id && !wallet.squad.squadLeader) {
                 const { data: leaderProfile } = await supabase.from('wallets_public').select('id, username').eq('id', publicWallet.squad_leader_id).single();
                 if (leaderProfile) {
                    wallet.squad.squadLeader = { id: leaderProfile.id, username: leaderProfile.username || 'Leader' };
                 }
            }
        }
        
        // Daily reset logic
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (now - (wallet.growth?.lastReset ?? 0) > oneDay) {
            const tierSettings = await getBotTierSettings();
            const currentTier = [...tierSettings].reverse().find(tier => wallet.balances.usdt >= tier.balanceThreshold) || tierSettings[0];
            
            wallet.growth.clicksLeft = currentTier.clicks;
            wallet.growth.lastReset = now;
            wallet.growth.dailyEarnings = 0;
            wallet.growth.earningsHistory = [];
            await updateWallet(userId, wallet);
        }
        return wallet;
    }
    
    if (error && error.code === 'PGRST116') { // "PGRST116" is the code for "exact one row not found"
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found, cannot create wallet.");

      console.log("No wallet found for user, creating a new one.");
      const newWallet = await createWallet(user.id, user.email!, "User", "N/A", "N/A");
      return newWallet;
    }
    
    console.error("Error in getOrCreateWallet:", error);
    throw new Error("Could not fetch or create wallet.");
}


// Updates a user's own wallet data.
export async function updateWallet(userId: string, newData: WalletData): Promise<void> {
    const { error: privateError } = await supabase
        .from('wallets')
        .update({ data: newData as any })
        .eq('id', userId);

    if (privateError) {
        console.error("Error updating private wallet:", privateError);
        throw new Error("Failed to update private wallet data.");
    }
    
    // Also update the public balances
    const { error: publicError } = await supabase
        .from('wallets_public')
        .update({ balances: newData.balances as any })
        .eq('id', userId);
    
    if (publicError) {
        console.error("Error updating public wallet balance:", publicError);
        // Don't throw, as private update succeeded. Log it as a potential inconsistency.
    }
}


// The functions below are now wrappers around updateWallet for specific tasks.

export async function saveWithdrawalAddress(userId: string, asset: string, address: string): Promise<void> {
    const wallet = await getOrCreateWallet(userId);
    if (!wallet.security.withdrawalAddresses) {
        wallet.security.withdrawalAddresses = {};
    }
    wallet.security.withdrawalAddresses[asset as keyof WithdrawalAddresses] = address;
    await updateWallet(userId, wallet);
}

export async function getWithdrawalAddresses(userId: string): Promise<WithdrawalAddresses> {
    const wallet = await getOrCreateWallet(userId);
    return wallet.security.withdrawalAddresses || {};
}
