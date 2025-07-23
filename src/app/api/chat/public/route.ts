
'use server';

import { NextResponse } from 'next/server';
import initialChat from '../../../../data/public-chat.json';
import type { Rank } from '@/lib/ranks';
import type { TierSetting } from '@/lib/tiers';

type ChatMessage = {
    id: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    text: string;
    timestamp: number;
    rank: Rank;
    tier: TierSetting | null;
    isAdmin?: boolean;
};

// In-memory store for chat messages
let chatMessages: ChatMessage[] = initialChat;

export async function GET(request: Request) {
    // Return messages sorted by timestamp
    const sortedMessages = chatMessages.sort((a, b) => a.timestamp - b.timestamp);
    return NextResponse.json(sortedMessages);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, text, rank, tier } = body;
        
        if (!userId || !text || !rank) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        // This is a mock implementation, so we'll generate some details
        const displayName = `User_${userId.slice(0, 4)}`;

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random()}`,
            userId,
            displayName,
            text,
            timestamp: Date.now(),
            rank,
            tier,
            isAdmin: false
        };

        chatMessages.push(newMessage);
        
        // Keep the chat history to a reasonable size in memory
        if (chatMessages.length > 100) {
            chatMessages = chatMessages.slice(-100);
        }

        return NextResponse.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { messageId } = await request.json();
        if (!messageId) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        chatMessages = chatMessages.filter(msg => msg.id !== messageId);

        return NextResponse.json({ success: true, message: 'Message deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
