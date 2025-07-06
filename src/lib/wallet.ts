
'use client';

const WALLET_STORAGE_KEY = 'astral-wallet';

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

export function createWallet(): WalletAddresses {
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

export function getWallet(): WalletAddresses | null {
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

export function getOrCreateWallet(): WalletAddresses {
    let wallet = getWallet();
    if (!wallet) {
        wallet = createWallet();
    }
    return wallet;
}
