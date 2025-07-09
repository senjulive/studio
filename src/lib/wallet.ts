
'use client';

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
            members: ['mock-member-1', 'mock-member-2'],
        },
        profile: {
            username: 'MockUser',
            fullName: 'Mock User',
            idCardNo: '123456789',
            contactNumber: '+1234567890',
            country: 'United States',
            avatarUrl: '',
        },
        security: {
            withdrawalAddresses: {
                usdt: 'TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x'
            },
        },
    };
}

// In-memory store for the wallet data since there is no database.
let memoryWallet: WalletData = createNewWalletDataObject();

// Called after a new user signs up.
export async function createWallet(
    userId: string,
    email: string,
    username: string,
    contactNumber: string,
    country: string,
    referralCode?: string
): Promise<WalletData> {
    
    console.log(`Mock: Creating wallet for ${username}`);
    const newWallet = createNewWalletDataObject();
    newWallet.profile.username = username;
    newWallet.profile.contactNumber = contactNumber;
    newWallet.profile.country = country;
    
    // Add a welcome bonus for all new users
    newWallet.balances.usdt += 100;
    newWallet.balances.btc += 0.005;
    newWallet.balances.eth += 0.1;

    // Simulate referral bonus if a squad code is used
    if (referralCode) {
        newWallet.squad.squadLeader = { id: 'mock-leader-id', username: 'MockLeader' };
        // Add *additional* bonuses
        newWallet.balances.usdt += 5;
        newWallet.balances.btc += 0.0001;
        newWallet.balances.eth += 0.002;
        await sendSystemNotification(userId, `User registered with squad code ${referralCode} from leader MockLeader. A bonus has been applied.`);
    }

    memoryWallet = newWallet;
    return newWallet;
}


// Fetches the current user's wallet, creating it if it doesn't exist.
export async function getOrCreateWallet(userId: string): Promise<WalletData> {
    // Daily reset logic for the mock wallet
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - (memoryWallet.growth?.lastReset ?? 0) > oneDay) {
        const tierSettings = await getBotTierSettings();
        const currentTier = [...tierSettings].reverse().find(tier => memoryWallet.balances.usdt >= tier.balanceThreshold) || tierSettings[0];
        
        memoryWallet.growth.clicksLeft = currentTier.clicks;
        memoryWallet.growth.lastReset = now;
        memoryWallet.growth.dailyEarnings = 0;
        memoryWallet.growth.earningsHistory = [];
    }
    return Promise.resolve(memoryWallet);
}


// Updates a user's own wallet data.
export async function updateWallet(userId: string, newData: WalletData): Promise<void> {
    console.log(`Mock: Updating wallet for ${userId}`);
    memoryWallet = newData;
    return Promise.resolve();
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
