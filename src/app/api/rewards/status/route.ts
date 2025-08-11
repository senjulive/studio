import { NextRequest, NextResponse } from 'next/server';

// Mock user data
const mockUserStats = {
  userId: 'user123',
  totalEarned: 85.50,
  totalClaimed: 12,
  currentStreak: 4,
  longestStreak: 15,
  achievementsCompleted: 5,
  totalAchievements: 15,
  weeklyEarnings: 23.50,
  monthlyEarnings: 85.50,
  referralEarnings: 45.00,
  tradingEarnings: 25.50,
  dailyEarnings: 15.00,
  lastClaimDate: '2024-01-15T10:30:00Z',
  nextDailyReward: {
    day: 5,
    amount: 6,
    type: 'USDT',
    availableAt: '2024-01-16T00:00:00Z'
  },
  recentClaims: [
    {
      id: '1',
      type: 'achievement',
      title: 'Welcome Aboard',
      amount: 5,
      claimedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '2',
      type: 'daily',
      title: 'Day 3 Reward',
      amount: 4,
      claimedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'High Roller',
      amount: 25,
      claimedAt: '2024-01-12T16:45:00Z'
    }
  ],
  upcomingRewards: [
    {
      id: '4',
      type: 'achievement',
      title: 'Squad Builder',
      amount: 20,
      requirement: 'Refer 2 more members',
      progress: 60
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Active Trader',
      amount: 30,
      requirement: 'Complete 25 more trades',
      progress: 50
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || 'user123';
    const period = url.searchParams.get('period') || 'all'; // all, week, month, year

    // Calculate period-specific stats
    let periodStats = {
      earned: mockUserStats.totalEarned,
      claimed: mockUserStats.totalClaimed
    };

    switch (period) {
      case 'week':
        periodStats = {
          earned: mockUserStats.weeklyEarnings,
          claimed: 3
        };
        break;
      case 'month':
        periodStats = {
          earned: mockUserStats.monthlyEarnings,
          claimed: mockUserStats.totalClaimed
        };
        break;
    }

    // Check if daily reward is available
    const now = new Date();
    const nextRewardTime = new Date(mockUserStats.nextDailyReward.availableAt);
    const isDailyAvailable = now >= nextRewardTime;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalEarned: periodStats.earned,
          totalClaimed: periodStats.claimed,
          currentStreak: mockUserStats.currentStreak,
          longestStreak: mockUserStats.longestStreak,
          achievementProgress: {
            completed: mockUserStats.achievementsCompleted,
            total: mockUserStats.totalAchievements,
            percentage: Math.round((mockUserStats.achievementsCompleted / mockUserStats.totalAchievements) * 100)
          }
        },
        earnings: {
          referral: mockUserStats.referralEarnings,
          trading: mockUserStats.tradingEarnings,
          daily: mockUserStats.dailyEarnings,
          breakdown: [
            { category: 'Referrals', amount: mockUserStats.referralEarnings, percentage: 53 },
            { category: 'Trading', amount: mockUserStats.tradingEarnings, percentage: 30 },
            { category: 'Daily Rewards', amount: mockUserStats.dailyEarnings, percentage: 17 }
          ]
        },
        dailyReward: {
          ...mockUserStats.nextDailyReward,
          isAvailable: isDailyAvailable,
          timeUntilNext: isDailyAvailable ? null : nextRewardTime.getTime() - now.getTime()
        },
        recentActivity: mockUserStats.recentClaims,
        upcomingRewards: mockUserStats.upcomingRewards,
        streakInfo: {
          current: mockUserStats.currentStreak,
          longest: mockUserStats.longestStreak,
          nextMilestone: 7,
          nextMilestoneReward: 15,
          daysUntilMilestone: 7 - mockUserStats.currentStreak
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reward status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId = 'user123' } = body;

    switch (action) {
      case 'reset-streak':
        // Admin action to reset user's streak
        return NextResponse.json({
          success: true,
          data: {
            message: 'Streak reset successfully',
            newStreak: 0
          }
        });

      case 'bonus-reward':
        // Admin action to give bonus reward
        const { amount, reason } = body;
        
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { success: false, error: 'Invalid bonus amount' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            message: `Bonus reward of $${amount} USDT added`,
            reason: reason || 'Admin bonus',
            amount
          }
        });

      case 'check-eligibility':
        // Check if user is eligible for any new rewards
        const eligibleRewards = mockUserStats.upcomingRewards.filter(r => r.progress >= 100);
        
        return NextResponse.json({
          success: true,
          data: {
            eligible: eligibleRewards.length > 0,
            rewards: eligibleRewards,
            count: eligibleRewards.length
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing reward action:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
