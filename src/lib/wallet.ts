'use client';

import { addNotification } from '@/lib/notifications';

// Simulates a robust, async, multi-user wallet system with data patching.

const WALLETS_STORAGE_KEY = 'astral-wallets';
const WITHDRAWAL_ADDRESSES_STORAGE_KEY = 'astral-withdrawal-addresses';

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

const getTierSettings = (balance: number): { clicks: number } => {
    if (balance >= 15000) return { clicks: 10 };
    if (balance >= 10000) return { clicks: 8 };
    if (balance >= 5000) return { clicks: 7 };
    if (balance >= 1000) return { clicks: 6 };
    if (balance >= 500) return { clicks: 5 };
    return { clicks: 4 };
};

export type WalletAddresses = {
    usdt: string;
};

export type WalletData = {
    addresses: WalletAddresses;
    balances: {
        usdt: number;
        btc: number;
        eth: number;
    };
    growth: {
        clicksLeft: number;
        lastReset: number; // timestamp
        dailyEarnings: number;
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
};

export type WithdrawalAddresses = {
    usdt?: string;
};

// --- Multi-User Wallet Functions ---

// Simulates fetching all wallets from a database. For admin use.
export async function getAllWallets(): Promise<Record<string, WalletData>> {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (typeof window === 'undefined') return {};
    const storedWallets = localStorage.getItem(WALLETS_STORAGE_KEY);
    return storedWallets ? JSON.parse(storedWallets) : {};
}

// Helper to create a complete, new wallet data object with all required fields.
const createNewWalletObject = (): WalletData => {
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
        growth: {
            clicksLeft: 4,
            lastReset: Date.now(),
            dailyEarnings: 0,
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
    };
}

// Simulates creating a wallet for a new user on a backend server.
export async function createWallet(
    email: string,
    username: string,
    contactNumber: string,
    country: string,
    referralCode?: string
): Promise<WalletData> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (typeof window === 'undefined') {
        throw new Error("Local storage is not available.");
    }

    const allWallets = await getAllWallets();
    
    if (allWallets[email]) {
        throw new Error("User with this email already exists.");
    }

    const newWalletData = createNewWalletObject();
    
    newWalletData.profile.username = username;
    newWalletData.profile.contactNumber = contactNumber;
    newWalletData.profile.country = country;

    // Handle referral logic
    if (referralCode) {
        const leaderEmail = Object.keys(allWallets).find(
            (key) => allWallets[key]?.squad?.referralCode.toUpperCase() === referralCode.toUpperCase()
        );

        if (leaderEmail && allWallets[leaderEmail]) {
            const leaderWallet = allWallets[leaderEmail];
            leaderWallet.squad.members.push(email);
            leaderWallet.balances.usdt += 5; // Leader gets a $5 bonus
            allWallets[leaderEmail] = leaderWallet;
            
            newWalletData.squad.squadLeader = leaderEmail;
            newWalletData.balances.usdt += 5; // New member also gets a $5 bonus
            
            // Notify the squad leader
            addNotification(leaderEmail, {
              title: "New Squad Member!",
              content: `${username} (${email}) has joined your squad. You've both earned a $5 bonus!`,
              href: "/dashboard/squad"
            });
        }
    }
    
    allWallets[email] = newWalletData;
    localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(allWallets));

    return newWalletData;
}

// Simulates fetching a specific user's wallet from a backend server.
async function getWallet(email: string): Promise<WalletData | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const allWallets = await getAllWallets();
    return allWallets[email] || null;
}

// This function robustly handles wallet creation, patching for backward compatibility, and daily resets.
export async function getOrCreateWallet(email: string): Promise<WalletData> {
    const existingWallet = await getWallet(email);

    if (!existingWallet) {
        // If no wallet exists, create a fresh one and return it.
        return createWallet(email, '', '', '');
    }

    // Create a default wallet structure to safely merge with existing data.
    const defaultWallet = createNewWalletObject(); 

    // Deep merge existing wallet data onto the default structure.
    // This ensures any missing properties from older wallet versions are gracefully added.
    const patchedWallet: WalletData = {
      ...defaultWallet,
      ...existingWallet,
      addresses: { ...defaultWallet.addresses, ...(existingWallet.addresses || {}) },
      balances: { ...defaultWallet.balances, ...(existingWallet.balances || {}) },
      growth: { ...defaultWallet.growth, ...(existingWallet.growth || {}) },
      squad: { ...defaultWallet.squad, ...(existingWallet.squad || {}) },
      profile: { ...defaultWallet.profile, ...(existingWallet.profile || {}) },
    };
    
    // Ensure `members` is an array if it's missing from older data
    if (!Array.isArray(patchedWallet.squad.members)) {
      patchedWallet.squad.members = [];
    }

    // Check for daily reset of the growth engine.
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - patchedWallet.growth.lastReset > oneDay) {
        const tierSettings = getTierSettings(patchedWallet.balances.usdt);
        patchedWallet.growth.clicksLeft = tierSettings.clicks;
        patchedWallet.growth.lastReset = now;
        patchedWallet.growth.dailyEarnings = 0;
        await updateWallet(email, patchedWallet);
    }
    
    return patchedWallet;
}

// Simulates updating a specific user's wallet on a backend server.
export async function updateWallet(email: string, data: WalletData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (typeof window !== 'undefined') {
        const allWallets = await getAllWallets();
        allWallets[email] = data;
        localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(allWallets));
    }
}

// --- Multi-User Withdrawal Address Functions ---

async function getAllWithdrawalAddresses(): Promise<Record<string, WithdrawalAddresses>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(WITHDRAWAL_ADDRESSES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

export async function getWithdrawalAddresses(email: string): Promise<WithdrawalAddresses> {
    const allAddresses = await getAllWithdrawalAddresses();
    return allAddresses[email] || {};
}

export async function saveWithdrawalAddress(email: string, asset: string, address: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const allAddresses = await getAllWithdrawalAddresses();
    if (!allAddresses[email]) {
        allAddresses[email] = {};
    }
    allAddresses[email][asset as keyof WithdrawalAddresses] = address;
    
    if (typeof window !== 'undefined') {
        localStorage.setItem(WITHDRAWAL_ADDRESSES_STORAGE_KEY, JSON.stringify(allAddresses));
    }
}
