
'use server';

// This is a mock implementation of the wallet logic since Supabase has been removed.
// It uses a simple JSON file to simulate a database.

import { getBotTierSettings } from './settings';
import initialWallets from '../../data/wallets.json';

// Define the structure of our mock data
let mockWallets: Record<string, any> = initialWallets;

export type WalletData = any; // Simplified type
export type ProfileData = any;
export type WithdrawalAddresses = any;

// A mock user ID to use throughout the app since there's no real login
const MOCK_USER_ID = 'mock-user-123';

export async function getOrCreateWallet(): Promise<WalletData> {
    const user = { id: MOCK_USER_ID }; // Simulate a logged-in user

    if (!user) {
        throw new Error("User not authenticated.");
    }
    
    let wallet = mockWallets[user.id];

    if (wallet && wallet.profile) {
        // Daily reset logic for the mock wallet
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const growthData = wallet.growth as any;
        const lastReset = growthData?.lastReset ? new Date(growthData.lastReset).getTime() : 0;

        if (now - lastReset > oneDay) {
            const settings = await getBotTierSettings();
            const balance = wallet.balances?.usdt || 0;
            const currentTier = [...settings].reverse().find(tier => balance >= tier.balanceThreshold) || settings[0];
            
            wallet.growth.clicksLeft = currentTier.clicks;
            wallet.growth.lastReset = new Date().toISOString();
            wallet.growth.dailyEarnings = 0;
        }
        return wallet;
    }

    // If wallet doesn't exist, return the default mock wallet
    return initialWallets['mock-user-123'];
}


export async function updateWallet(newData: Partial<WalletData>): Promise<WalletData | null> {
    const user = { id: MOCK_USER_ID };
    if (!user) throw new Error("User not authenticated.");

    const currentWallet = mockWallets[user.id] || {};
    const updatedWallet = { ...currentWallet, ...newData };
    mockWallets[user.id] = updatedWallet;
    
    return updatedWallet;
}

export async function saveWithdrawalAddress(asset: string, address: string): Promise<void> {
    const wallet = await getOrCreateWallet();
    const currentSecurity = wallet.security || {};
    const newAddresses = {
        ...(currentSecurity.withdrawalAddresses || {}),
        [asset]: address,
    };
    wallet.security.withdrawalAddresses = newAddresses;
}

export async function getWithdrawalAddresses(): Promise<WithdrawalAddresses> {
    const wallet = await getOrCreateWallet();
    return wallet.security?.withdrawalAddresses || {};
}
