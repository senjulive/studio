import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const REWARDS_DATA_FILE = path.join(process.cwd(), 'data', 'rewards.json');

interface RewardItem {
  id: string;
  title: string;
  description: string;
  type: 'rank' | 'tier' | 'referral' | 'achievement' | 'daily' | 'special';
  amount: number;
  currency: 'USDT' | 'BTC' | 'ETH' | 'points';
  icon: string;
  isActive: boolean;
  requirements?: {
    minBalance?: number;
    minReferrals?: number;
    minTrades?: number;
    rankRequired?: string;
    tierRequired?: string;
  };
  cooldown?: number;
  maxClaims?: number;
  createdAt: string;
  updatedAt: string;
}

interface RewardsData {
  rewards: RewardItem[];
}

const DEFAULT_REWARDS: RewardItem[] = [
  {
    id: 'reward-welcome',
    title: 'Welcome Bonus',
    description: 'Welcome to AstralCore! Claim your initial bonus.',
    type: 'achievement',
    amount: 10,
    currency: 'USDT',
    icon: '🎉',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'reward-daily',
    title: 'Daily Login',
    description: 'Login daily to claim this reward.',
    type: 'daily',
    amount: 5,
    currency: 'USDT',
    icon: '📅',
    isActive: true,
    cooldown: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function ensureRewardsFile() {
  try {
    await fs.access(REWARDS_DATA_FILE);
  } catch {
    const dataDir = path.dirname(REWARDS_DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(REWARDS_DATA_FILE, JSON.stringify({ rewards: DEFAULT_REWARDS }, null, 2));
  }
}

async function readRewardsData(): Promise<RewardsData> {
  await ensureRewardsFile();
  try {
    const data = await fs.readFile(REWARDS_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { rewards: DEFAULT_REWARDS };
  }
}

async function writeRewardsData(data: RewardsData): Promise<void> {
  await ensureRewardsFile();
  await fs.writeFile(REWARDS_DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readRewardsData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load rewards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reward } = body;

    if (!reward || !reward.id) {
      return NextResponse.json(
        { error: 'Invalid reward data' },
        { status: 400 }
      );
    }

    const data = await readRewardsData();
    const existingIndex = data.rewards.findIndex(r => r.id === reward.id);

    if (existingIndex >= 0) {
      data.rewards[existingIndex] = { ...reward, updatedAt: new Date().toISOString() };
    } else {
      data.rewards.push({ ...reward, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    await writeRewardsData(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save reward' },
      { status: 500 }
    );
  }
}
