'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type {
  Achievement,
  DailyReward,
  CreateAchievementData,
  CreateDailyRewardData
} from '@/lib/rewards';

export interface AdminRewardsData {
  achievements: Achievement[];
  dailyRewards: DailyReward[];
}

export function useAdminRewards() {
  const { toast } = useToast();
  const [data, setData] = useState<AdminRewardsData>({ achievements: [], dailyRewards: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async (type?: 'achievements' | 'daily-rewards') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      
      const response = await fetch(`/api/admin/rewards?${params}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch rewards');
      }
      
      if (result.success) {
        if (type === 'achievements') {
          setData(prev => ({ ...prev, achievements: result.data }));
        } else if (type === 'daily-rewards') {
          setData(prev => ({ ...prev, dailyRewards: result.data }));
        } else {
          setData({
            achievements: result.data.achievements || [],
            dailyRewards: result.data.dailyRewards || []
          });
        }
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
  }, [toast]);

  const createAchievement = useCallback(async (achievementData: CreateAchievementData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'achievement',
          data: {
            title: achievementData.title,
            description: achievementData.description,
            reward: achievementData.reward,
            category: achievementData.category,
            rarity: achievementData.rarity,
            requirement: {
              type: achievementData.requirementType,
              target: achievementData.requirementTarget
            },
            icon: achievementData.icon,
            isActive: achievementData.isActive
          }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create achievement');
      }
      
      if (result.success) {
        toast({
          title: 'Achievement Created',
          description: result.message,
        });
        
        // Add to local state
        setData(prev => ({
          ...prev,
          achievements: [...prev.achievements, result.data]
        }));
        
        return result.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Creation Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateAchievement = useCallback(async (id: string, achievementData: Partial<CreateAchievementData>) => {
    setIsLoading(true);
    
    try {
      const updateData: any = { ...achievementData };
      
      // Transform the data format for the API
      if (achievementData.requirementType && achievementData.requirementTarget) {
        updateData.requirement = {
          type: achievementData.requirementType,
          target: achievementData.requirementTarget
        };
        delete updateData.requirementType;
        delete updateData.requirementTarget;
      }
      
      const response = await fetch('/api/admin/rewards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'achievement',
          id,
          data: updateData
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update achievement');
      }
      
      if (result.success) {
        toast({
          title: 'Achievement Updated',
          description: result.message,
        });
        
        // Update local state
        setData(prev => ({
          ...prev,
          achievements: prev.achievements.map(achievement => 
            achievement.id === id ? result.data : achievement
          )
        }));
        
        return result.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteAchievement = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/rewards?type=achievement&id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete achievement');
      }
      
      if (result.success) {
        toast({
          title: 'Achievement Deleted',
          description: result.message,
        });
        
        // Remove from local state
        setData(prev => ({
          ...prev,
          achievements: prev.achievements.filter(achievement => achievement.id !== id)
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Deletion Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createDailyReward = useCallback(async (rewardData: CreateDailyRewardData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'daily-reward',
          data: rewardData
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create daily reward');
      }
      
      if (result.success) {
        toast({
          title: 'Daily Reward Created',
          description: result.message,
        });
        
        // Add to local state and sort by day
        setData(prev => ({
          ...prev,
          dailyRewards: [...prev.dailyRewards, result.data].sort((a, b) => a.day - b.day)
        }));
        
        return result.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Creation Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateDailyReward = useCallback(async (id: string, rewardData: Partial<CreateDailyRewardData>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/rewards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'daily-reward',
          id,
          data: rewardData
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update daily reward');
      }
      
      if (result.success) {
        toast({
          title: 'Daily Reward Updated',
          description: result.message,
        });
        
        // Update local state and maintain sort order
        setData(prev => ({
          ...prev,
          dailyRewards: prev.dailyRewards
            .map(reward => reward.id === id ? result.data : reward)
            .sort((a, b) => a.day - b.day)
        }));
        
        return result.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteDailyReward = useCallback(async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/rewards?type=daily-reward&id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete daily reward');
      }
      
      if (result.success) {
        toast({
          title: 'Daily Reward Deleted',
          description: result.message,
        });
        
        // Remove from local state
        setData(prev => ({
          ...prev,
          dailyRewards: prev.dailyRewards.filter(reward => reward.id !== id)
        }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Deletion Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    // Data
    achievements: data.achievements,
    dailyRewards: data.dailyRewards,
    
    // State
    isLoading,
    error,
    
    // Actions
    fetchRewards,
    
    // Achievement management
    createAchievement,
    updateAchievement,
    deleteAchievement,
    
    // Daily reward management
    createDailyReward,
    updateDailyReward,
    deleteDailyReward,
    
    // Computed values
    totalAchievements: data.achievements.length,
    activeAchievements: data.achievements.filter(a => a.isActive).length,
    totalDailyRewards: data.dailyRewards.length,
    activeDailyRewards: data.dailyRewards.filter(r => r.isActive).length,
    totalRewardValue: data.achievements.reduce((sum, a) => sum + a.reward, 0) + 
                     data.dailyRewards.reduce((sum, r) => sum + r.reward, 0)
  };
}
