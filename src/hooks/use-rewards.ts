'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Achievement, DailyReward } from '@/lib/rewards';

import type { RewardsSummary } from '@/lib/rewards';

export interface RewardsStatus {
  summary: {
    totalEarned: number;
    totalClaimed: number;
    currentStreak: number;
    longestStreak: number;
    achievementProgress: {
      completed: number;
      total: number;
      percentage: number;
    };
  };
  earnings: {
    referral: number;
    trading: number;
    daily: number;
    breakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  };
  dailyReward: {
    day: number;
    amount: number;
    type: string;
    isAvailable: boolean;
    timeUntilNext: number | null;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    amount: number;
    claimedAt: string;
  }>;
  upcomingRewards: Array<{
    id: string;
    type: string;
    title: string;
    amount: number;
    requirement: string;
    progress: number;
  }>;
}

export function useRewards(userId?: string) {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyReward, setDailyReward] = useState<DailyReward | null>(null);
  const [summary, setSummary] = useState<RewardsSummary | null>(null);
  const [status, setStatus] = useState<RewardsStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      
      const response = await fetch(`/api/rewards/claim?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch rewards');
      }
      
      if (data.success) {
        setAchievements(data.data.achievements || []);
        setDailyReward(data.data.dailyReward || null);
        setSummary(data.data.summary || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const fetchStatus = useCallback(async (period: 'all' | 'week' | 'month' = 'all') => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      params.append('period', period);
      
      const response = await fetch(`/api/rewards/status?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch status');
      }
      
      if (data.success) {
        setStatus(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching reward status:', errorMessage);
    }
  }, [userId]);

  const claimAchievement = useCallback(async (achievementId: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'achievement',
          achievementId,
          userId
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim achievement');
      }
      
      if (data.success) {
        toast({
          title: 'Achievement Claimed!',
          description: data.data.message,
        });
        
        // Refresh rewards data
        await fetchRewards();
        await fetchStatus();
        
        return data.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Claim Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, fetchRewards, fetchStatus]);

  const claimDailyReward = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'daily',
          userId
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim daily reward');
      }
      
      if (data.success) {
        toast({
          title: 'Daily Reward Claimed!',
          description: data.data.message,
        });
        
        // Refresh rewards data
        await fetchRewards();
        await fetchStatus();
        
        return data.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Claim Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, fetchRewards, fetchStatus]);

  const claimAllAvailable = useCallback(async () => {
    const claimableAchievements = achievements.filter(a => a.canClaim);
    const canClaimDaily = dailyReward?.canClaim;
    
    if (claimableAchievements.length === 0 && !canClaimDaily) {
      toast({
        title: 'No Rewards Available',
        description: 'You have no rewards available to claim right now.',
        variant: 'default'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const results = [];
      
      // Claim all available achievements
      for (const achievement of claimableAchievements) {
        try {
          const result = await claimAchievement(achievement.id);
          results.push(result);
        } catch (error) {
          console.error(`Failed to claim achievement ${achievement.id}:`, error);
        }
      }
      
      // Claim daily reward if available
      if (canClaimDaily) {
        try {
          const result = await claimDailyReward();
          results.push(result);
        } catch (error) {
          console.error('Failed to claim daily reward:', error);
        }
      }
      
      if (results.length > 0) {
        const totalClaimed = results.reduce((sum, r) => sum + (r.reward?.reward || r.reward?.amount || 0), 0);
        toast({
          title: 'Bulk Claim Complete!',
          description: `Successfully claimed ${results.length} reward${results.length > 1 ? 's' : ''} totaling $${totalClaimed} USDT!`,
        });
      }
    } catch (err) {
      console.error('Error in bulk claim:', err);
    } finally {
      setIsLoading(false);
    }
  }, [achievements, dailyReward, claimAchievement, claimDailyReward, toast]);

  const checkEligibility = useCallback(async () => {
    try {
      const response = await fetch('/api/rewards/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check-eligibility',
          userId
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.data.eligible) {
        toast({
          title: 'New Rewards Available!',
          description: `You have ${data.data.count} new reward${data.data.count > 1 ? 's' : ''} to claim!`,
        });
        
        // Refresh rewards data
        await fetchRewards();
      }
      
      return data.data;
    } catch (err) {
      console.error('Error checking eligibility:', err);
    }
  }, [userId, toast, fetchRewards]);

  useEffect(() => {
    fetchRewards();
    fetchStatus();
  }, [fetchRewards, fetchStatus]);

  return {
    // Data
    achievements,
    dailyReward,
    summary,
    status,
    
    // State
    isLoading,
    error,
    
    // Actions
    claimAchievement,
    claimDailyReward,
    claimAllAvailable,
    checkEligibility,
    fetchRewards,
    fetchStatus,
    
    // Computed values
    claimableAchievements: achievements.filter(a => a.canClaim),
    claimableRewardsValue: achievements.filter(a => a.canClaim).reduce((sum, a) => sum + a.reward, 0),
    hasClaimableRewards: achievements.some(a => a.canClaim) || dailyReward?.canClaim,
    completedAchievements: achievements.filter(a => a.isClaimed),
    totalProgress: achievements.length > 0 ? 
      (achievements.filter(a => a.isClaimed).length / achievements.length) * 100 : 0
  };
}
