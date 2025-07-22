import { NextResponse } from 'next/server';
import initialMessages from '@/data/public-chat.json';
import { getWalletByUserId } from '@/lib/wallet';
import { getUserRank } from '@/lib/ranks';
import { getBotTierSettings, getCurrentTier } from '@/lib/tiers';

let mockMessages: any[] = initialMessages;

export async function GET() {
  return NextResponse.json(mockMessages.slice(-50)); // Return last 50 messages
}

export async function POST(request: Request) {
  try {
    const { userId, text } = await request.json();
    if (!userId || !text) {
      return NextResponse.json({ error: 'Missing userId or text' }, { status: 400 });
    }

    const [wallet, tierSettings] = await Promise.all([
      getWalletByUserId(userId),
      getBotTierSettings()
    ]);

    if (!wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (!wallet.profile?.displayName) {
        return NextResponse.json({ error: 'User must set a display name before chatting.' }, { status: 403 });
    }

    const balance = wallet.balances?.usdt ?? 0;
    const rank = getUserRank(balance);
    const tier = await getCurrentTier(balance, tierSettings);
    const isAdmin = userId === 'admin-astralcore' || wallet.profile.email === 'admin@astralcore.io';

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      userId,
      displayName: isAdmin ? "AstralCore" : wallet.profile.displayName,
      avatarUrl: wallet.profile.avatarUrl,
      text,
      timestamp: Date.now(),
      rank,
      tier,
      isAdmin
    };

    mockMessages.push(newMessage);
    // Keep the chat history from getting too large in this mock environment
    if (mockMessages.length > 100) {
      mockMessages = mockMessages.slice(-100);
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
