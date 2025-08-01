'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Gift, 
  Star, 
  Crown, 
  Users, 
  Zap, 
  Target, 
  Calendar, 
  Coins,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  Flame
} from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'rank' | 'tier' | 'referral' | 'achievement' | 'daily' | 'special';
  amount: number;
  currency: 'USDT' | 'BTC' | 'ETH' | 'points';
  icon: string;
  isClaimable: boolean;
  isClaimed: boolean;
  progress?: number;
  maxProgress?: number;
  expiresAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function ModernRewardsView() {
  const { wallet, rank, tier } = useUser();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = React.useState('available');

  // Mock rewards data
  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Welcome Bonus',
      description: 'Complete your first deposit to unlock this reward',
      type: 'achievement',
      amount: 10,
      currency: 'USDT',
      icon: '🎉',
      isClaimable: true,
      isClaimed: false,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Squad Leader',
      description: 'Invite 5 members to your squad',
      type: 'referral',
      amount: 50,
      currency: 'USDT',
      icon: '👥',
      isClaimable: false,
      isClaimed: false,
      progress: 2,
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Rank Advancement',
      description: 'Reach Silver rank status',
      type: 'rank',
      amount: 25,
      currency: 'USDT',
      icon: '🥈',
      isClaimable: false,
      isClaimed: false,
      progress: 750,
      maxProgress: 1000,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Daily Login Streak',
      description: 'Login for 7 consecutive days',
      type: 'daily',
      amount: 5,
      currency: 'USDT',
      icon: '📅',
      isClaimable: true,
      isClaimed: false,
      progress: 7,
      maxProgress: 7,
      rarity: 'common',
      expiresAt: '2024-12-31'
    },
    {
      id: '5',
      title: 'VIP Core Unlock',
      description: 'Unlock VIP Core II tier',
      type: 'tier',
      amount: 100,
      currency: 'USDT',
      icon: '⭐',
      isClaimable: false,
      isClaimed: false,
      progress: 300,
      maxProgress: 500,
      rarity: 'legendary'
    },
    {
      id: '6',
      title: 'Trading Master',
      description: 'Complete 100 successful trades',
      type: 'achievement',
      amount: 75,
      currency: 'USDT',
      icon: '🏆',
      isClaimable: false,
      isClaimed: false,
      progress: 43,
      maxProgress: 100,
      rarity: 'epic'
    }
  ];

  const claimedRewards = rewards.filter(r => r.isClaimed);
  const availableRewards = rewards.filter(r => !r.isClaimed);
  const claimableRewards = rewards.filter(r => r.isClaimable && !r.isClaimed);

  const totalEarned = claimedRewards.reduce((sum, reward) => sum + reward.amount, 0);
  const pendingRewards = claimableRewards.reduce((sum, reward) => sum + reward.amount, 0);

  const handleClaimReward = async (rewardId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reward Claimed!",
        description: "Your reward has been added to your balance.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50';
      case 'rare': return 'border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-800/50';
      case 'epic': return 'border-purple-200 bg-purple-50/50 dark:border-purple-700 dark:bg-purple-800/50';
      case 'legendary': return 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-700 dark:bg-yellow-800/50';
      default: return 'border-border bg-card';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rank': return Crown;
      case 'tier': return Star;
      case 'referral': return Users;
      case 'achievement': return Trophy;
      case 'daily': return Calendar;
      case 'special': return Gift;
      default: return Award;
    }
  };

  const stats = [
    {
      label: 'Total Earned',
      value: `$${totalEarned.toLocaleString()}`,
      icon: Coins,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Pending Claims',
      value: `$${pendingRewards.toLocaleString()}`,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Total Rewards',
      value: rewards.length,
      icon: Trophy,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Completion Rate',
      value: `${Math.round((claimedRewards.length / rewards.length) * 100)}%`,
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  Rewards Center
                </CardTitle>
                <CardDescription>
                  Complete achievements, climb ranks, and earn rewards for your trading journey.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-bold">{claimableRewards.length}</span>
                <span className="text-sm text-muted-foreground">claimable</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Rewards Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available" className="relative">
              Available
              {claimableRewards.length > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500">{claimableRewards.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
            <TabsTrigger value="claimed">Claimed</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid gap-4">
              {availableRewards.map((reward, index) => {
                const TypeIcon = getTypeIcon(reward.type);
                const isClaimable = reward.isClaimable && !reward.isClaimed;
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
                      getRarityColor(reward.rarity),
                      isClaimable && "ring-2 ring-primary/50 shadow-lg shadow-primary/20"
                    )}>
                      {isClaimable && (
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center space-x-1">
                            <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                            <span className="text-xs font-medium text-orange-500">Ready!</span>
                          </div>
                        </div>
                      )}
                      
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="text-3xl">{reward.icon}</div>
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold">{reward.title}</h4>
                                <Badge className={getRarityBadgeColor(reward.rarity)}>
                                  {reward.rarity}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {reward.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {reward.description}
                              </p>
                              
                              {/* Progress Bar */}
                              {reward.progress !== undefined && reward.maxProgress && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Progress</span>
                                    <span>{reward.progress}/{reward.maxProgress}</span>
                                  </div>
                                  <Progress 
                                    value={(reward.progress / reward.maxProgress) * 100} 
                                    className="h-2"
                                  />
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center space-x-1 font-medium">
                                  <Coins className="h-4 w-4 text-yellow-500" />
                                  <span>{reward.amount} {reward.currency}</span>
                                </span>
                                {reward.expiresAt && (
                                  <span className="text-muted-foreground flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Expires {new Date(reward.expiresAt).toLocaleDateString()}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleClaimReward(reward.id)}
                            disabled={!isClaimable}
                            className={cn(
                              "shrink-0",
                              isClaimable && "bg-primary hover:bg-primary/90 shadow-lg"
                            )}
                          >
                            {isClaimable ? (
                              <>
                                <Trophy className="h-4 w-4 mr-2" />
                                Claim
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid gap-4">
              {availableRewards.filter(r => r.progress !== undefined && !r.isClaimable).map((reward, index) => {
                const TypeIcon = getTypeIcon(reward.type);
                const progressPercent = reward.maxProgress ? (reward.progress! / reward.maxProgress) * 100 : 0;
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={cn("border-border/50", getRarityColor(reward.rarity))}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{reward.icon}</div>
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{reward.title}</h4>
                              <Badge className={getRarityBadgeColor(reward.rarity)}>
                                {reward.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {reward.description}
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-medium">
                                  {reward.progress}/{reward.maxProgress} ({Math.round(progressPercent)}%)
                                </span>
                              </div>
                              <Progress value={progressPercent} className="h-3" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="flex items-center space-x-1 font-medium text-sm">
                                <Coins className="h-4 w-4 text-yellow-500" />
                                <span>{reward.amount} {reward.currency}</span>
                              </span>
                              <Badge variant="outline">
                                {Math.round(progressPercent)}% Complete
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="claimed" className="space-y-4">
            <div className="grid gap-4">
              {claimedRewards.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="pt-6 text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No rewards claimed yet.</p>
                    <p className="text-sm text-muted-foreground">Complete achievements to start earning rewards!</p>
                  </CardContent>
                </Card>
              ) : (
                claimedRewards.map((reward, index) => {
                  const TypeIcon = getTypeIcon(reward.type);
                  
                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className={cn("border-border/50 opacity-75", getRarityColor(reward.rarity))}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="text-3xl grayscale">{reward.icon}</div>
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold">{reward.title}</h4>
                                  <Badge className={getRarityBadgeColor(reward.rarity)}>
                                    {reward.rarity}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    Claimed
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {reward.description}
                                </p>
                                <span className="flex items-center space-x-1 font-medium text-sm">
                                  <Coins className="h-4 w-4 text-yellow-500" />
                                  <span>{reward.amount} {reward.currency}</span>
                                </span>
                              </div>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
