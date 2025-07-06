'use client';

// This file now simulates async operations for a multi-user wallet system,
// as if it were talking to a server. This makes it easier to replace with a real backend later.

const WALLETS_STORAGE_KEY = 'astral-wallets';
const WITHDRAWAL_ADDRESSES_STORAGE_KEY = 'astral-withdrawal-addresses';

const generateAddress = (prefix: string, length: number, chars: string): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + result;
};

export type WalletAddresses = {
    usdt: string;
    eth: string;
};

export type WalletData = {
    addresses: WalletAddresses;
    balances: {
        usdt: number;
        eth: number;
    };
    growth: {
        clicksLeft: number;
        lastReset: number; // timestamp
    };
};

export type WithdrawalAddresses = {
    usdt?: string;
    eth?: string;
};

// --- Multi-User Wallet Functions ---

// Simulates fetching all wallets from a database. For admin use.
export async function getAllWallets(): Promise<Record<string, WalletData>> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (typeof window === 'undefined') return {};
    const storedWallets = localStorage.getItem(WALLETS_STORAGE_KEY);
    return storedWallets ? JSON.parse(storedWallets) : {};
}

// Simulates creating a wallet for a new user on a backend server.
export async function createWallet(email: string): Promise<WalletData> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const trc20Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ethChars = '0123456789abcdef';

    const newWalletData: WalletData = {
        addresses: {
            usdt: generateAddress('T', 33, trc20Chars),
            eth: generateAddress('0x', 40, ethChars),
        },
        balances: {
            usdt: 0,
            eth: 0,
        },
        growth: {
            clicksLeft: 4,
            lastReset: Date.now(),
        }
    };

    if (typeof window !== 'undefined') {
        const allWallets = await getAllWallets();
        allWallets[email] = newWalletData;
        localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(allWallets));
    }

    return newWalletData;
}

// Simulates fetching a specific user's wallet from a backend server.
export async function getWallet(email: string): Promise<WalletData | null> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const allWallets = await getAllWallets();
    return allWallets[email] || null;
}

// Simulates the logic of getting a wallet or creating one if it doesn't exist for a user.
export async function getOrCreateWallet(email: string): Promise<WalletData> {
    let wallet = await getWallet(email);
    if (!wallet) {
        wallet = await createWallet(email);
    }
    return wallet;
}

// Simulates updating a specific user's wallet on a backend server.
export async function updateWallet(email: string, data: WalletData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
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

// Simulates fetching withdrawal addresses for a specific user.
export async function getWithdrawalAddresses(email: string): Promise<WithdrawalAddresses> {
    const allAddresses = await getAllWithdrawalAddresses();
    return allAddresses[email] || {};
}

// Simulates saving a withdrawal address for a specific user.
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
