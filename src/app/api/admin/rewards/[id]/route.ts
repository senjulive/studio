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
  requirements?: any;
  cooldown?: number;
  maxClaims?: number;
  createdAt: string;
  updatedAt: string;
}

interface RewardsData {
  rewards: RewardItem[];
}

async function readRewardsData(): Promise<RewardsData> {
  try {
    const data = await fs.readFile(REWARDS_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { rewards: [] };
  }
}

async function writeRewardsData(data: RewardsData): Promise<void> {
  await fs.writeFile(REWARDS_DATA_FILE, JSON.stringify(data, null, 2));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Reward ID is required' },
        { status: 400 }
      );
    }

    const data = await readRewardsData();
    const rewardIndex = data.rewards.findIndex(r => r.id === id);

    if (rewardIndex === -1) {
      return NextResponse.json(
        { error: 'Reward not found' },
        { status: 404 }
      );
    }

    data.rewards.splice(rewardIndex, 1);
    await writeRewardsData(data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete reward' },
      { status: 500 }
    );
  }
}
