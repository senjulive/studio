import { z } from 'zod';

// Base schemas for validation
export const AchievementCategorySchema = z.enum(['trading', 'referral', 'milestone', 'special']);
export const AchievementRaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);
export const RequirementTypeSchema = z.enum(['balance', 'referrals', 'trades', 'days', 'deposits']);
export const RewardTypeSchema = z.enum(['USDT', 'bonus']);

// Achievement requirement schema
export const AchievementRequirementSchema = z.object({
  type: RequirementTypeSchema,
  target: z.number().min(1, 'Target must be at least 1'),
  current: z.number().optional()
});

// Achievement schema for creation/update
export const CreateAchievementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  reward: z.number().min(0, 'Reward must be positive').max(10000, 'Reward too high'),
  category: AchievementCategorySchema,
  rarity: AchievementRaritySchema,
  requirementType: RequirementTypeSchema,
  requirementTarget: z.number().min(1, 'Target must be positive'),
  icon: z.string().min(1, 'Icon is required'),
  isActive: z.boolean().default(true)
});

export const UpdateAchievementSchema = CreateAchievementSchema.partial();

// Full achievement schema (includes generated fields)
export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  reward: z.number(),
  icon: z.string(),
  category: AchievementCategorySchema,
  rarity: AchievementRaritySchema,
  requirement: AchievementRequirementSchema,
  isActive: z.boolean(),
  createdAt: z.string(),
  claimedCount: z.number(),
  isEligible: z.boolean().optional(),
  isClaimed: z.boolean().optional(),
  canClaim: z.boolean().optional()
});

// Daily reward schemas
export const CreateDailyRewardSchema = z.object({
  day: z.number().min(1, 'Day must be at least 1').max(30, 'Day cannot exceed 30'),
  reward: z.number().min(0, 'Reward must be positive').max(1000, 'Reward too high'),
  type: RewardTypeSchema,
  isActive: z.boolean().default(true)
});

export const UpdateDailyRewardSchema = CreateDailyRewardSchema.partial();

export const DailyRewardSchema = z.object({
  id: z.string(),
  day: z.number(),
  reward: z.number(),
  type: RewardTypeSchema,
  isActive: z.boolean(),
  claimedToday: z.number(),
  streak: z.number().optional(),
  canClaim: z.boolean().optional()
});

// User reward progress schema
export const UserRewardProgressSchema = z.object({
  userId: z.string(),
  balance: z.number().default(0),
  referrals: z.number().default(0),
  trades: z.number().default(0),
  deposits: z.number().default(0),
  accountDays: z.number().default(0),
  dailyStreak: z.number().default(0),
  lastClaimDate: z.string().optional(),
  claimedAchievements: z.array(z.string()).default([]),
  claimedDailyRewards: z.array(z.string()).default([])
});

// Reward claim schemas
export const ClaimAchievementSchema = z.object({
  type: z.literal('achievement'),
  achievementId: z.string().min(1, 'Achievement ID is required'),
  userId: z.string().optional()
});

export const ClaimDailyRewardSchema = z.object({
  type: z.literal('daily'),
  userId: z.string().optional()
});

export const ClaimRewardSchema = z.discriminatedUnion('type', [
  ClaimAchievementSchema,
  ClaimDailyRewardSchema
]);

// Rewards summary schema
export const RewardsSummarySchema = z.object({
  claimableAchievements: z.number(),
  claimableRewardsValue: z.number(),
  totalEarned: z.number(),
  dailyStreak: z.number()
});

// Earnings breakdown schema
export const EarningsBreakdownSchema = z.object({
  category: z.string(),
  amount: z.number(),
  percentage: z.number()
});

// Reward status schema
export const RewardStatusSchema = z.object({
  summary: z.object({
    totalEarned: z.number(),
    totalClaimed: z.number(),
    currentStreak: z.number(),
    longestStreak: z.number(),
    achievementProgress: z.object({
      completed: z.number(),
      total: z.number(),
      percentage: z.number()
    })
  }),
  earnings: z.object({
    referral: z.number(),
    trading: z.number(),
    daily: z.number(),
    breakdown: z.array(EarningsBreakdownSchema)
  }),
  dailyReward: z.object({
    day: z.number(),
    amount: z.number(),
    type: z.string(),
    isAvailable: z.boolean(),
    timeUntilNext: z.number().nullable()
  }),
  recentActivity: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    amount: z.number(),
    claimedAt: z.string()
  })),
  upcomingRewards: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    amount: z.number(),
    requirement: z.string(),
    progress: z.number()
  }))
});

// Type exports
export type AchievementCategory = z.infer<typeof AchievementCategorySchema>;
export type AchievementRarity = z.infer<typeof AchievementRaritySchema>;
export type RequirementType = z.infer<typeof RequirementTypeSchema>;
export type RewardType = z.infer<typeof RewardTypeSchema>;

export type AchievementRequirement = z.infer<typeof AchievementRequirementSchema>;
export type CreateAchievementData = z.infer<typeof CreateAchievementSchema>;
export type UpdateAchievementData = z.infer<typeof UpdateAchievementSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;

export type CreateDailyRewardData = z.infer<typeof CreateDailyRewardSchema>;
export type UpdateDailyRewardData = z.infer<typeof UpdateDailyRewardSchema>;
export type DailyReward = z.infer<typeof DailyRewardSchema>;

export type UserRewardProgress = z.infer<typeof UserRewardProgressSchema>;
export type ClaimRewardData = z.infer<typeof ClaimRewardSchema>;
export type RewardsSummary = z.infer<typeof RewardsSummarySchema>;
export type EarningsBreakdown = z.infer<typeof EarningsBreakdownSchema>;
export type RewardStatus = z.infer<typeof RewardStatusSchema>;

// Utility functions
export function validateAchievement(data: unknown): Achievement {
  return AchievementSchema.parse(data);
}

export function validateCreateAchievement(data: unknown): CreateAchievementData {
  return CreateAchievementSchema.parse(data);
}

export function validateUpdateAchievement(data: unknown): UpdateAchievementData {
  return UpdateAchievementSchema.parse(data);
}

export function validateDailyReward(data: unknown): DailyReward {
  return DailyRewardSchema.parse(data);
}

export function validateCreateDailyReward(data: unknown): CreateDailyRewardData {
  return CreateDailyRewardSchema.parse(data);
}

export function validateUpdateDailyReward(data: unknown): UpdateDailyRewardData {
  return UpdateDailyRewardSchema.parse(data);
}

export function validateClaimReward(data: unknown): ClaimRewardData {
  return ClaimRewardSchema.parse(data);
}

export function validateUserProgress(data: unknown): UserRewardProgress {
  return UserRewardProgressSchema.parse(data);
}

// Helper functions for reward calculations
export function calculateAchievementProgress(
  requirement: AchievementRequirement,
  userProgress: UserRewardProgress
): number {
  const { type, target } = requirement;
  let current = 0;

  switch (type) {
    case 'balance':
      current = userProgress.balance;
      break;
    case 'referrals':
      current = userProgress.referrals;
      break;
    case 'trades':
      current = userProgress.trades;
      break;
    case 'deposits':
      current = userProgress.deposits;
      break;
    case 'days':
      current = userProgress.accountDays;
      break;
  }

  return Math.min(current, target);
}

export function isAchievementEligible(
  achievement: Achievement,
  userProgress: UserRewardProgress
): boolean {
  const progress = calculateAchievementProgress(achievement.requirement, userProgress);
  return progress >= achievement.requirement.target;
}

export function isAchievementClaimable(
  achievement: Achievement,
  userProgress: UserRewardProgress
): boolean {
  return (
    isAchievementEligible(achievement, userProgress) &&
    !userProgress.claimedAchievements.includes(achievement.id) &&
    achievement.isActive
  );
}

export function canClaimDailyReward(
  userProgress: UserRewardProgress,
  today: string = new Date().toISOString().split('T')[0]
): boolean {
  return !userProgress.claimedDailyRewards.includes(today);
}

export function getCurrentDailyReward(
  dailyRewards: DailyReward[],
  streak: number
): DailyReward | null {
  const day = Math.min(streak + 1, 7);
  return dailyRewards.find(r => r.day === day) || null;
}

export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-600 bg-gray-100';
    case 'rare':
      return 'text-blue-600 bg-blue-100';
    case 'epic':
      return 'text-purple-600 bg-purple-100';
    case 'legendary':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getCategoryColor(category: AchievementCategory): string {
  switch (category) {
    case 'trading':
      return 'text-green-600 bg-green-100';
    case 'referral':
      return 'text-blue-600 bg-blue-100';
    case 'milestone':
      return 'text-purple-600 bg-purple-100';
    case 'special':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function formatRewardAmount(amount: number, type: RewardType = 'USDT'): string {
  return `$${amount.toFixed(2)} ${type}`;
}

export function calculateTotalRewardsValue(achievements: Achievement[], dailyRewards: DailyReward[]): number {
  const achievementValue = achievements.reduce((sum, a) => sum + a.reward, 0);
  const dailyValue = dailyRewards.reduce((sum, r) => sum + r.reward, 0);
  return achievementValue + dailyValue;
}

// Constants for rewards system
export const REWARD_ICONS = [
  { value: 'Trophy', label: '🏆 Trophy' },
  { value: 'Gift', label: '🎁 Gift' },
  { value: 'Star', label: '⭐ Star' },
  { value: 'Crown', label: '👑 Crown' },
  { value: 'Zap', label: '⚡ Zap' },
  { value: 'Users', label: '👥 Users' },
  { value: 'TrendingUp', label: '📈 Trending Up' },
  { value: 'Coins', label: '🪙 Coins' },
  { value: 'Sparkles', label: '✨ Sparkles' },
  { value: 'Award', label: '🥇 Award' },
  { value: 'Target', label: '🎯 Target' }
] as const;

export const ACHIEVEMENT_CATEGORIES = [
  { value: 'trading', label: 'Trading' },
  { value: 'referral', label: 'Referral' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'special', label: 'Special' }
] as const;

export const ACHIEVEMENT_RARITIES = [
  { value: 'common', label: 'Common' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' }
] as const;

export const REQUIREMENT_TYPES = [
  { value: 'balance', label: 'Balance' },
  { value: 'referrals', label: 'Referrals' },
  { value: 'trades', label: 'Trades' },
  { value: 'days', label: 'Days' },
  { value: 'deposits', label: 'Deposits' }
] as const;

export const REWARD_TYPES = [
  { value: 'USDT', label: 'USDT' },
  { value: 'bonus', label: 'Bonus' }
] as const;
