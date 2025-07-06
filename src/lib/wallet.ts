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
    squad: {
        referralCode: string;
        squadLeader?: string; // email of the leader
        members: string[]; // emails of members
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

// Helper to create a complete, new wallet data object
const createNewWalletObject = (): WalletData => {
    const trc20Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ethChars = '0123456789abcdef';

    return {
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
        },
        squad: {
            referralCode: generateReferralCode(),
            members: [],
        },
    };
}


// Simulates creating a wallet for a new user on a backend server.
export async function createWallet(email: string, referralCode?: string): Promise<WalletData> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    const newWalletData = createNewWalletObject();

    if (typeof window !== 'undefined') {
        const allWallets = await getAllWallets();
        
        // Handle referral logic
        if (referralCode) {
            const leaderEmail = Object.keys(allWallets).find(
                (key) => allWallets[key]?.squad?.referralCode.toUpperCase() === referralCode.toUpperCase()
            );

            if (leaderEmail && allWallets[leaderEmail]?.squad) {
                const leaderWallet = allWallets[leaderEmail];
                // Ensure members array exists before pushing
                if (!leaderWallet.squad.members) {
                    leaderWallet.squad.members = [];
                }
                leaderWallet.squad.members.push(email);
                leaderWallet.balances.usdt = (leaderWallet.balances.usdt || 0) + 5; // Leader gets a $5 bonus
                allWallets[leaderEmail] = leaderWallet; // Update leader's wallet
                
                newWalletData.squad.squadLeader = leaderEmail;
                newWalletData.balances.usdt += 5; // New member also gets a $5 bonus
            }
        }
        
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

// This function now robustly handles wallet creation, patching, and daily resets.
export async function getOrCreateWallet(email: string): Promise<WalletData> {
    const existingWallet = await getWallet(email);

    if (!existingWallet) {
        return createWallet(email);
    }

    // Create a default wallet structure to safely merge with.
    // This generates new addresses/codes, but they will be overwritten by existing data.
    const defaultWallet = createNewWalletObject(); 

    // Deep merge existing wallet data onto the default structure.
    // This ensures any missing properties are gracefully added.
    const patchedWallet: WalletData = {
      ...defaultWallet,
      ...existingWallet,
      addresses: {
        ...defaultWallet.addresses,
        ...(existingWallet.addresses || {}),
      },
      balances: {
        ...defaultWallet.balances,
        ...(existingWallet.balances || {}),
      },
      growth: {
        ...defaultWallet.growth,
        ...(existingWallet.growth || {}),
      },
      squad: {
        ...defaultWallet.squad,
        ...(existingWallet.squad || {}),
      },
    };

    let needsUpdate = false;

    // Check for daily reset of the growth engine.
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - patchedWallet.growth.lastReset > oneDay) {
        patchedWallet.growth.clicksLeft = 4;
        patchedWallet.growth.lastReset = now;
        needsUpdate = true;
    }

    // If any patching or updates occurred, save the wallet back to storage.
    // This check prevents unnecessary writes.
    if (needsUpdate || JSON.stringify(existingWallet) !== JSON.stringify(patchedWallet)) {
        await updateWallet(email, patchedWallet);
    }
    
    return patchedWallet;
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
