// Client-safe squad-clans module - uses static/mock data
import { getAllWallets, getWalletByUserId } from './wallet';
import { type Rank } from './ranks';
import { type TierSetting } from './tiers';
import { getBotTierSettings } from './tiers';

export type Clan = {
    id: string;
    name: string;
    avatarUrl: string;
    leaderId: string;
    members: string[]; // array of user IDs
};

export type ClanChatMessage = {
    id: string;
    clanId: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    text: string;
    timestamp: number;
    rank: Rank;
    tier: TierSetting | null;
};

// Mock data storage
let mockClans: Record<string, Clan> = {};
let mockChats: Record<string, ClanChatMessage[]> = {};

const MIN_CLAN_CREATE_BALANCE = 100;

export async function createClan(leaderId: string, name: string, avatarUrl: string): Promise<Clan | null> {
    const leaderWallet = await getWalletByUserId(leaderId);
    if (!leaderWallet) return null;

    const allWallets = await getAllWallets();
    const squadMembers = leaderWallet.squad?.members || [];
    
    // Check if the leader already has a clan
    const existingClan = Object.values(mockClans).find(c => c.leaderId === leaderId);
    if (existingClan) {
        throw new Error("Leader has already created a clan.");
    }

    // Check minimum balance
    if ((leaderWallet.balances?.usdt || 0) < MIN_CLAN_CREATE_BALANCE) {
        throw new Error(`Minimum ${MIN_CLAN_CREATE_BALANCE} USDT required to create a clan.`);
    }

    // Check if leader has at least 3 members
    if (squadMembers.length < 3) {
        throw new Error("Leader must have at least 3 squad members to create a clan.");
    }

    // Create clan
    const newClan: Clan = {
        id: `clan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        avatarUrl,
        leaderId,
        members: [leaderId, ...squadMembers]
    };

    mockClans[newClan.id] = newClan;
    return newClan;
}

export async function getClanForUser(userId: string): Promise<Clan | null> {
    const clan = Object.values(mockClans).find(c => c.members.includes(userId));
    return clan || null;
}

export async function getClanById(clanId: string): Promise<Clan | null> {
    return mockClans[clanId] || null;
}

export async function addClanMessage(clanId: string, message: Omit<ClanChatMessage, 'id' | 'clanId' | 'timestamp'>): Promise<void> {
    const newMessage: ClanChatMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        clanId,
        timestamp: Date.now()
    };

    if (!mockChats[clanId]) {
        mockChats[clanId] = [];
    }

    mockChats[clanId].push(newMessage);
    
    // Keep only last 100 messages
    mockChats[clanId] = mockChats[clanId].slice(-100);
}

export async function getClanMessages(clanId: string): Promise<ClanChatMessage[]> {
    return mockChats[clanId] || [];
}
