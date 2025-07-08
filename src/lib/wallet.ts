
'use client';

import { supabase } from '@/lib/supabase';
import { sendSystemNotification } from '@/lib/chat';
import { getBotTierSettings } from './settings';

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
        squadLeader?: string;
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


// Admin Function: Fetches all wallets. Requires RLS policy for admins in Supabase.
export async function getAllWallets(): Promise<Record<string, WalletData>> {
    const { data, error } = await supabase
      .from('wallets')
      .select('id, data');
  
    if (error) {
      console.error("Error fetching all wallets:", error);
      // Depending on RLS, this might fail for non-admins. Return empty for now.
      return {};
    }
  
    const wallets: Record<string, WalletData> = {};
    for (const row of data) {
      wallets[row.id] = row.data as WalletData;
    }
    return wallets;
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

    // Handle referral logic
    if (referralCode) {
        // Find the leader by their referral code
        const { data: leaderData, error: leaderError } = await supabase
            .from('wallets')
            .select('id, data')
            // Using a permissive policy for this lookup. In production, this should be a secure RPC call.
            .eq('data->squad->>referralCode', referralCode.toUpperCase())
            .single();

        if (leaderData && !leaderError) {
            const leaderId = leaderData.id;
            const leaderWallet = leaderData.data as WalletData;
            
            // Set the squad leader for the new user
            newWalletData.squad.squadLeader = leaderId;
            // New member gets a $5 bonus for using a code
            newWalletData.balances.usdt += 5; 
            
            // The logic to update the leader's wallet is correctly removed.
            // Now, we just notify the admin so they can handle the leader's bonus manually.
            const leaderUsername = leaderWallet.profile.username || leaderId;
            await sendSystemNotification(
                userId, // Log this in the new user's chat for context
                `Referral successful. User '${email}' was referred by '${leaderUsername}'. Admin action required to credit leader's bonus.`
            );
        }
    }

    const { error } = await supabase.from('wallets').insert({
        id: userId,
        data: newWalletData as any,
    });

    if (error) {
        console.error("Error creating wallet:", error.message);
        throw new Error("Could not create wallet for new user.");
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
      // This path is for users who registered before the wallets table existed.
      // It uses the user's email and provides default values for other profile info.
      const newWallet = await createWallet(user.id, user.email!, "User", "N/A", "N/A");
      return newWallet;
    }
    
    console.error("Error in getOrCreateWallet:", error);
    throw new Error("Could not fetch or create wallet.");
}


// Updates a user's wallet data.
export async function updateWallet(userId: string, newData: WalletData): Promise<void> {
    const { error } = await supabase
        .from('wallets')
        .update({ data: newData as any })
        .eq('id', userId);

    if (error) {
        console.error("Error updating wallet:", error);
        throw new Error("Failed to update wallet data.");
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

export async function resetWithdrawalAddressForUser(userId: string): Promise<void> {
    const wallet = await getOrCreateWallet(userId);
    wallet.security.withdrawalAddresses = {};
    await updateWallet(userId, wallet);
}
