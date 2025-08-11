import { NextRequest, NextResponse } from 'next/server';

// Mock data - In production, this would connect to your database
const mockAchievements = [
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
  }
];

const mockDailyRewards = [
  { id: '1', day: 1, reward: 2, type: 'USDT', isActive: true, claimedToday: 89 },
  { id: '2', day: 2, reward: 3, type: 'USDT', isActive: true, claimedToday: 67 },
  { id: '3', day: 3, reward: 4, type: 'USDT', isActive: true, claimedToday: 45 },
  { id: '4', day: 4, reward: 5, type: 'USDT', isActive: true, claimedToday: 34 },
  { id: '5', day: 5, reward: 6, type: 'USDT', isActive: true, claimedToday: 28 },
  { id: '6', day: 6, reward: 8, type: 'USDT', isActive: true, claimedToday: 19 },
  { id: '7', day: 7, reward: 15, type: 'bonus', isActive: true, claimedToday: 12 }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    switch (type) {
      case 'achievements':
        return NextResponse.json({ 
          success: true, 
          data: mockAchievements 
        });
      
      case 'daily-rewards':
        return NextResponse.json({ 
          success: true, 
          data: mockDailyRewards 
        });
      
      default:
        return NextResponse.json({ 
          success: true, 
          data: {
            achievements: mockAchievements,
            dailyRewards: mockDailyRewards
          }
        });
    }
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'achievement':
        // In production, save to database
        const newAchievement = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          claimedCount: 0
        };
        
        mockAchievements.push(newAchievement);
        
        return NextResponse.json({ 
          success: true, 
          data: newAchievement,
          message: 'Achievement created successfully'
        });
      
      case 'daily-reward':
        // In production, save to database
        const newDailyReward = {
          id: Date.now().toString(),
          ...data,
          claimedToday: 0
        };
        
        mockDailyRewards.push(newDailyReward);
        mockDailyRewards.sort((a, b) => a.day - b.day);
        
        return NextResponse.json({ 
          success: true, 
          data: newDailyReward,
          message: 'Daily reward created successfully'
        });
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    switch (type) {
      case 'achievement':
        const achievementIndex = mockAchievements.findIndex(a => a.id === id);
        if (achievementIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Achievement not found' },
            { status: 404 }
          );
        }
        
        mockAchievements[achievementIndex] = {
          ...mockAchievements[achievementIndex],
          ...data
        };
        
        return NextResponse.json({ 
          success: true, 
          data: mockAchievements[achievementIndex],
          message: 'Achievement updated successfully'
        });
      
      case 'daily-reward':
        const rewardIndex = mockDailyRewards.findIndex(r => r.id === id);
        if (rewardIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Daily reward not found' },
            { status: 404 }
          );
        }
        
        mockDailyRewards[rewardIndex] = {
          ...mockDailyRewards[rewardIndex],
          ...data
        };
        
        return NextResponse.json({ 
          success: true, 
          data: mockDailyRewards[rewardIndex],
          message: 'Daily reward updated successfully'
        });
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating reward:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'ID and type are required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'achievement':
        const achievementIndex = mockAchievements.findIndex(a => a.id === id);
        if (achievementIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Achievement not found' },
            { status: 404 }
          );
        }
        
        mockAchievements.splice(achievementIndex, 1);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Achievement deleted successfully'
        });
      
      case 'daily-reward':
        const rewardIndex = mockDailyRewards.findIndex(r => r.id === id);
        if (rewardIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Daily reward not found' },
            { status: 404 }
          );
        }
        
        mockDailyRewards.splice(rewardIndex, 1);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Daily reward deleted successfully'
        });
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error deleting reward:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
