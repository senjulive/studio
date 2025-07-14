
'use client';

import { getBotTierSettings } from './settings';
import { sendSystemNotification } from './chat';
import { readDb, writeDb } from './db';

const DB_FILE = 'wallets.json';

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
            username: 'DefaultUser',
            fullName: 'Default User',
            idCardNo: '000000000',
            contactNumber: '+0000000000',
            country: 'Default',
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
    
    const allWallets = await readDb(DB_FILE, {});
    
    const newWallet = createNewWalletDataObject();
    newWallet.profile.username = username;
    newWallet.profile.contactNumber = contactNumber;
    newWallet.profile.country = country;
    
    newWallet.balances.usdt += 5;

    if (referralCode) {
        newWallet.squad.squadLeader = { id: 'mock-leader-id', username: 'MockLeader' };
        newWallet.balances.usdt += 5;
    }
    
    allWallets[userId] = newWallet;
    await writeDb(DB_FILE, allWallets);

    if (referralCode) {
         await sendSystemNotification(userId, `User registered with squad code ${referralCode} from leader MockLeader. A bonus of $5.00 USDT has been applied.`);
    }

    return newWallet;
}


// Fetches the current user's wallet, creating it if it doesn't exist.
export async function getOrCreateWallet(userId: string): Promise<WalletData> {
    const allWallets = await readDb(DB_FILE, {});
    let userWallet = allWallets[userId];

    if (!userWallet) {
        userWallet = createNewWalletDataObject();
        allWallets[userId] = userWallet;
    }
    
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - (userWallet.growth?.lastReset ?? 0) > oneDay) {
        const settings = await getBotTierSettings();
        const currentTier = [...settings].reverse().find(tier => userWallet.balances.usdt >= tier.balanceThreshold) || settings[0];
        
        userWallet.growth.clicksLeft = currentTier.clicks;
        userWallet.growth.lastReset = now;
        userWallet.growth.dailyEarnings = 0;
    }

    await writeDb(DB_FILE, allWallets);

    return userWallet;
}

export async function getAllWallets(): Promise<Record<string, WalletData>> {
    const defaultWallets = {
        "mock-user-123": createNewWalletDataObject(),
        "mock-user-456": {
            ...createNewWalletDataObject(),
            profile: {
                ...createNewWalletDataObject().profile,
                username: 'Another User',
            },
            balances: {
                usdt: 1234.56,
                btc: 0.05,
                eth: 1.2
            }
        }
    };
    return readDb(DB_FILE, defaultWallets);
}


// Updates a user's own wallet data.
export async function updateWallet(userId: string, newData: WalletData): Promise<void> {
    const allWallets = await readDb(DB_FILE, {});
    allWallets[userId] = newData;
    await writeDb(DB_FILE, allWallets);
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
