'use client';

// This file now simulates async operations, as if it were talking to a server.
// This makes it easier to replace with a real backend later.

const WALLET_STORAGE_KEY = 'astral-wallet';
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

export type WithdrawalAddresses = {
    usdt?: string;
    eth?: string;
};

// Simulates creating a wallet on a backend server.
export async function createWallet(): Promise<WalletAddresses> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const trc20Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ethChars = '0123456789abcdef';

    const addresses: WalletAddresses = {
        usdt: generateAddress('T', 33, trc20Chars),
        eth: generateAddress('0x', 40, ethChars),
    };

    if (typeof window !== 'undefined') {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(addresses));
    }

    return addresses;
}

// Simulates fetching a wallet from a backend server.
export async function getWallet(): Promise<WalletAddresses | null> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (typeof window === 'undefined') {
        return null;
    }
    const storedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
    if (storedWallet) {
        try {
            return JSON.parse(storedWallet);
        } catch (e) {
            console.error("Failed to parse wallet from localStorage", e);
            return null;
        }
    }
    return null;
}

// Simulates the logic of getting a wallet or creating one if it doesn't exist.
export async function getOrCreateWallet(): Promise<WalletAddresses> {
    let wallet = await getWallet();
    if (!wallet) {
        wallet = await createWallet();
    }
    return wallet;
}

// Simulates fetching withdrawal addresses from a backend.
export async function getWithdrawalAddresses(): Promise<WithdrawalAddresses | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (typeof window === 'undefined') {
        return null;
    }
    const storedAddresses = localStorage.getItem(WITHDRAWAL_ADDRESSES_STORAGE_KEY);
    if (storedAddresses) {
        try {
            return JSON.parse(storedAddresses);
        } catch (e) {
            console.error("Failed to parse withdrawal addresses from localStorage", e);
            return null;
        }
    }
    return {};
}

// Simulates saving a withdrawal address to a backend.
export async function saveWithdrawalAddress(asset: string, address: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentAddresses = await getWithdrawalAddresses() || {};
    const newAddresses: WithdrawalAddresses = {
        ...currentAddresses,
        [asset]: address,
    };
    if (typeof window !== 'undefined') {
        localStorage.setItem(WITHDRAWAL_ADDRESSES_STORAGE_KEY, JSON.stringify(newAddresses));
    }
}
