import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

const REWARDS_FILE_PATH = path.join(process.cwd(), 'data', 'rewards.json');

type Achievement = {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  category: 'trading' | 'referral' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: 'balance' | 'referrals' | 'trades' | 'days' | 'deposits';
    target: number;
  };
  isActive: boolean;
  createdAt: string;
  claimedCount: number;
};

type DailyReward = {
  id: string;
  day: number;
  reward: number;
  type: 'USDT' | 'bonus';
  isActive: boolean;
  claimedToday: number;
};

type RewardsData = {
  achievements: Achievement[];
  dailyRewards: DailyReward[];
  settings: {
    rankAchievementBonus: number;
    tierAchievementBonus: number;
    referralBonusTier1: number;
    referralBonusTier2: number;
    newUserBonus: number;
    dailyRewardMultiplier: number;
  };
};

const defaultRewardsData: RewardsData = {
  achievements: [
    {
      id: '1',
      title: 'Welcome Aboard',
      description: 'Make your first deposit to start trading',
      reward: 5,
      icon: 'Coins',
      category: 'milestone',
      rarity: 'common',
      requirement: { type: 'deposits', target: 1 },
      isActive: true,
      createdAt: '2024-01-01',
      claimedCount: 247
    },
    {
      id: '2',
      title: 'High Roller',
      description: 'Reach $500 total balance',
      reward: 25,
      icon: 'Crown',
      category: 'trading',
      rarity: 'rare',
      requirement: { type: 'balance', target: 500 },
      isActive: true,
      createdAt: '2024-01-01',
      claimedCount: 89
    },
    {
      id: '3',
      title: 'Squad Builder',
      description: 'Refer 5 new members',
      reward: 20,
      icon: 'Users',
      category: 'referral',
      rarity: 'common',
      requirement: { type: 'referrals', target: 5 },
      isActive: true,
      createdAt: '2024-01-01',
      claimedCount: 156
    }
  ],
  dailyRewards: [
    { id: '1', day: 1, reward: 2, type: 'USDT', isActive: true, claimedToday: 89 },
    { id: '2', day: 2, reward: 3, type: 'USDT', isActive: true, claimedToday: 67 },
    { id: '3', day: 3, reward: 4, type: 'USDT', isActive: true, claimedToday: 45 },
    { id: '4', day: 4, reward: 5, type: 'USDT', isActive: true, claimedToday: 34 },
    { id: '5', day: 5, reward: 6, type: 'USDT', isActive: true, claimedToday: 28 },
    { id: '6', day: 6, reward: 8, type: 'USDT', isActive: true, claimedToday: 19 },
    { id: '7', day: 7, reward: 15, type: 'bonus', isActive: true, claimedToday: 12 }
  ],
  settings: {
    rankAchievementBonus: 10,
    tierAchievementBonus: 5,
    referralBonusTier1: 5,
    referralBonusTier2: 1,
    newUserBonus: 5,
    dailyRewardMultiplier: 1.0
  }
};

async function readRewardsData(): Promise<RewardsData> {
  try {
    const data = await fs.readFile(REWARDS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with default data
    await writeRewardsData(defaultRewardsData);
    return defaultRewardsData;
  }
}

async function writeRewardsData(data: RewardsData): Promise<void> {
  // Ensure data directory exists
  const dataDir = path.dirname(REWARDS_FILE_PATH);
  await fs.mkdir(dataDir, { recursive: true });
  
  await fs.writeFile(REWARDS_FILE_PATH, JSON.stringify(data, null, 2));
}

// GET - Fetch all rewards data
export async function GET() {
  try {
    const rewardsData = await readRewardsData();
    return NextResponse.json(rewardsData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rewards data' },
      { status: 500 }
    );
  }
}

// POST - Create new achievement or daily reward
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    const rewardsData = await readRewardsData();

    if (type === 'achievement') {
      const newAchievement: Achievement = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        claimedCount: 0
      };
      rewardsData.achievements.push(newAchievement);
    } else if (type === 'dailyReward') {
      const newDailyReward: DailyReward = {
        ...data,
        id: Date.now().toString(),
        claimedToday: 0
      };
      rewardsData.dailyRewards.push(newDailyReward);
      rewardsData.dailyRewards.sort((a, b) => a.day - b.day);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "achievement" or "dailyReward"' },
        { status: 400 }
      );
    }

    await writeRewardsData(rewardsData);
    return NextResponse.json({ success: true, message: `${type} created successfully` });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create reward' },
      { status: 500 }
    );
  }
}

// PUT - Update existing achievement or daily reward
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        { error: 'Type, ID, and data are required' },
        { status: 400 }
      );
    }

    const rewardsData = await readRewardsData();

    if (type === 'achievement') {
      const index = rewardsData.achievements.findIndex(a => a.id === id);
      if (index === -1) {
        return NextResponse.json(
          { error: 'Achievement not found' },
          { status: 404 }
        );
      }
      rewardsData.achievements[index] = { ...rewardsData.achievements[index], ...data };
    } else if (type === 'dailyReward') {
      const index = rewardsData.dailyRewards.findIndex(r => r.id === id);
      if (index === -1) {
        return NextResponse.json(
          { error: 'Daily reward not found' },
          { status: 404 }
        );
      }
      rewardsData.dailyRewards[index] = { ...rewardsData.dailyRewards[index], ...data };
      rewardsData.dailyRewards.sort((a, b) => a.day - b.day);
    } else if (type === 'settings') {
      rewardsData.settings = { ...rewardsData.settings, ...data };
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "achievement", "dailyReward", or "settings"' },
        { status: 400 }
      );
    }

    await writeRewardsData(rewardsData);
    return NextResponse.json({ success: true, message: `${type} updated successfully` });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update reward' },
      { status: 500 }
    );
  }
}

// DELETE - Remove achievement or daily reward
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    const rewardsData = await readRewardsData();

    if (type === 'achievement') {
      rewardsData.achievements = rewardsData.achievements.filter(a => a.id !== id);
    } else if (type === 'dailyReward') {
      rewardsData.dailyRewards = rewardsData.dailyRewards.filter(r => r.id !== id);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "achievement" or "dailyReward"' },
        { status: 400 }
      );
    }

    await writeRewardsData(rewardsData);
    return NextResponse.json({ success: true, message: `${type} deleted successfully` });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete reward' },
      { status: 500 }
    );
  }
}
