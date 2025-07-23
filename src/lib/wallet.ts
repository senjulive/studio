
'use server';

import { getBotTierSettings } from './tiers';
import { getCurrentTier } from './ranks';
import initialWallets from '../../data/wallets.json';

let mockWallets: Record<string, any> = initialWallets;
const MOCK_USER_ID = 'mock-user-123';

export type WalletData = any;
export type ProfileData = any;
export type WithdrawalAddresses = any;

export async function getAllWallets(): Promise<Record<string, WalletData>> {
    return mockWallets;
}

export async function getWalletByUserId(userId: string): Promise<WalletData | null> {
    return mockWallets[userId] || null;
}

export async function updateWalletByUserId(userId: string, newData: Partial<WalletData>): Promise<WalletData | null> {
    if (!mockWallets[userId]) {
        return null;
    }
    const updatedWallet = { ...mockWallets[userId], ...newData };
    mockWallets[userId] = updatedWallet;
    return updatedWallet;
}

export async function getOrCreateWallet(userId?: string): Promise<WalletData> {
    const currentUserId = userId || MOCK_USER_ID;

    if (!currentUserId) {
        throw new Error("User not authenticated.");
    }
    
    let wallet = mockWallets[currentUserId];

    if (wallet && wallet.profile) {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const growthData = wallet.growth as any;
        const lastReset = growthData?.lastReset ? new Date(growthData.lastReset).getTime() : 0;

        if (now - lastReset > oneDay) {
            const settings = await getBotTierSettings();
            const balance = wallet.balances?.usdt || 0;
            const currentTier = getCurrentTier(balance, settings);
            
            if(currentTier) {
                wallet.growth.clicksLeft = currentTier.clicks;
                wallet.growth.lastReset = new Date().toISOString();
                wallet.growth.dailyEarnings = 0;
            }
        }
        return wallet;
    }

    // Fallback to default user if no user is found. In a real app, this might create a new wallet.
    return initialWallets[MOCK_USER_ID];
}

export async function updateWallet(newData: Partial<WalletData>): Promise<WalletData | null> {
    const user = { id: MOCK_USER_ID };
    if (!user) throw new Error("User not authenticated.");

    const currentWallet = await getOrCreateWallet(user.id);
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
