import { NextRequest, NextResponse } from 'next/server';

// Mock user data - In production, this would come from your database
const mockUserProgress = {
  userId: 'user123',
  balance: 750,
  referrals: 3,
  trades: 25,
  deposits: 5,
  accountDays: 15,
  dailyStreak: 4,
  lastClaimDate: '2024-01-15',
  claimedAchievements: ['1'],
  claimedDailyRewards: ['2024-01-15']
};

// Mock achievements (same as admin but with user progress)
const mockAchievements = [
  {
    id: '1',
    title: 'Welcome Aboard',
    description: 'Make your first deposit to start trading',
    reward: 5,
    requirement: { type: 'deposits', target: 1 },
    isActive: true
  },
  {
    id: '2',
    title: 'High Roller',
    description: 'Reach $500 total balance',
    reward: 25,
    requirement: { type: 'balance', target: 500 },
    isActive: true
  },
  {
    id: '3',
    title: 'Squad Builder',
    description: 'Refer 5 new members',
    reward: 20,
    requirement: { type: 'referrals', target: 5 },
    isActive: true
  },
  {
    id: '4',
    title: 'Active Trader',
    description: 'Complete 50 trades',
    reward: 30,
    requirement: { type: 'trades', target: 50 },
    isActive: true
  },
  {
    id: '5',
    title: 'Veteran',
    description: 'Account active for 30 days',
    reward: 40,
    requirement: { type: 'days', target: 30 },
    isActive: true
  }
];

const mockDailyRewards = [
  { day: 1, reward: 2, type: 'USDT' },
  { day: 2, reward: 3, type: 'USDT' },
  { day: 3, reward: 4, type: 'USDT' },
  { day: 4, reward: 5, type: 'USDT' },
  { day: 5, reward: 6, type: 'USDT' },
  { day: 6, reward: 8, type: 'USDT' },
  { day: 7, reward: 15, type: 'bonus' }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || 'user123';

    // Calculate achievement progress
    const achievementsWithProgress = mockAchievements.map(achievement => {
      let current = 0;
      
      switch (achievement.requirement.type) {
        case 'balance':
          current = mockUserProgress.balance;
          break;
        case 'referrals':
          current = mockUserProgress.referrals;
          break;
        case 'trades':
          current = mockUserProgress.trades;
          break;
        case 'deposits':
          current = mockUserProgress.deposits;
          break;
        case 'days':
          current = mockUserProgress.accountDays;
          break;
      }

      const isEligible = current >= achievement.requirement.target;
      const isClaimed = mockUserProgress.claimedAchievements.includes(achievement.id);

      return {
        ...achievement,
        requirement: {
          ...achievement.requirement,
          current
        },
        isEligible,
        isClaimed,
        canClaim: isEligible && !isClaimed
      };
    });

    // Check daily reward eligibility
    const today = new Date().toISOString().split('T')[0];
    const canClaimDaily = !mockUserProgress.claimedDailyRewards.includes(today);
    const currentDailyReward = mockDailyRewards[Math.min(mockUserProgress.dailyStreak, 6)];

    return NextResponse.json({
      success: true,
      data: {
        achievements: achievementsWithProgress,
        dailyReward: {
          ...currentDailyReward,
          streak: mockUserProgress.dailyStreak + 1,
          canClaim: canClaimDaily
        },
        summary: {
          claimableAchievements: achievementsWithProgress.filter(a => a.canClaim).length,
          claimableRewardsValue: achievementsWithProgress
            .filter(a => a.canClaim)
            .reduce((sum, a) => sum + a.reward, 0),
          totalEarned: mockUserProgress.claimedAchievements.length * 10, // Mock calculation
          dailyStreak: mockUserProgress.dailyStreak
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, achievementId, userId = 'user123' } = body;

    switch (type) {
      case 'achievement':
        if (!achievementId) {
          return NextResponse.json(
            { success: false, error: 'Achievement ID is required' },
            { status: 400 }
          );
        }

        const achievement = mockAchievements.find(a => a.id === achievementId);
        if (!achievement) {
          return NextResponse.json(
            { success: false, error: 'Achievement not found' },
            { status: 404 }
          );
        }

        // Check if already claimed
        if (mockUserProgress.claimedAchievements.includes(achievementId)) {
          return NextResponse.json(
            { success: false, error: 'Achievement already claimed' },
            { status: 400 }
          );
        }

        // Check eligibility
        let current = 0;
        switch (achievement.requirement.type) {
          case 'balance':
            current = mockUserProgress.balance;
            break;
          case 'referrals':
            current = mockUserProgress.referrals;
            break;
          case 'trades':
            current = mockUserProgress.trades;
            break;
          case 'deposits':
            current = mockUserProgress.deposits;
            break;
          case 'days':
            current = mockUserProgress.accountDays;
            break;
        }

        if (current < achievement.requirement.target) {
          return NextResponse.json(
            { success: false, error: 'Achievement requirements not met' },
            { status: 400 }
          );
        }

        // Claim achievement (in production, update database)
        mockUserProgress.claimedAchievements.push(achievementId);

        return NextResponse.json({
          success: true,
          data: {
            achievement,
            reward: achievement.reward,
            message: `Successfully claimed "${achievement.title}" and earned $${achievement.reward} USDT!`
          }
        });

      case 'daily':
        const today = new Date().toISOString().split('T')[0];
        
        // Check if already claimed today
        if (mockUserProgress.claimedDailyRewards.includes(today)) {
          return NextResponse.json(
            { success: false, error: 'Daily reward already claimed today' },
            { status: 400 }
          );
        }

        const dailyReward = mockDailyRewards[Math.min(mockUserProgress.dailyStreak, 6)];
        
        // Claim daily reward (in production, update database)
        mockUserProgress.claimedDailyRewards.push(today);
        mockUserProgress.dailyStreak += 1;

        return NextResponse.json({
          success: true,
          data: {
            reward: dailyReward,
            newStreak: mockUserProgress.dailyStreak,
            message: `Daily reward claimed! You earned $${dailyReward.reward} ${dailyReward.type}. Streak: ${mockUserProgress.dailyStreak} days!`
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid claim type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
