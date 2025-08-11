'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminRewards } from '@/hooks/use-admin-rewards';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy, Gift, Star, Crown, Zap, Users, TrendingUp, Coins, Sparkles, Award, Plus, Edit, Trash2, Calendar, Target, Settings, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CreateAchievementSchema,
  CreateDailyRewardSchema,
  REWARD_ICONS,
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_RARITIES,
  REQUIREMENT_TYPES,
  REWARD_TYPES,
  getRarityColor,
  getCategoryColor,
  type CreateAchievementData,
  type CreateDailyRewardData,
  type Achievement,
  type DailyReward
} from '@/lib/rewards';

const iconOptions = REWARD_ICONS.map(icon => ({
  value: icon.value,
  label: icon.label,
  icon: getIconComponent(icon.value)
}));

function getIconComponent(iconName: string) {
  const iconMap: Record<string, any> = {
    Trophy, Gift, Star, Crown, Zap, Users, TrendingUp, Coins, Sparkles, Award, Target
  };
  return iconMap[iconName] || Trophy;
}

export function RewardsManager() {
  const { toast } = useToast();
  const [achievements, setAchievements] = React.useState<Achievement[]>(mockAchievements);
  const [dailyRewards, setDailyRewards] = React.useState<DailyReward[]>(mockDailyRewards);
  const [editingAchievement, setEditingAchievement] = React.useState<Achievement | null>(null);
  const [editingDailyReward, setEditingDailyReward] = React.useState<DailyReward | null>(null);
  const [isAddingAchievement, setIsAddingAchievement] = React.useState(false);
  const [isAddingDailyReward, setIsAddingDailyReward] = React.useState(false);

  const achievementForm = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      description: '',
      reward: 0,
      category: 'milestone',
      rarity: 'common',
      requirementType: 'balance',
      requirementTarget: 1,
      icon: 'Trophy',
      isActive: true
    }
  });

  const dailyRewardForm = useForm<DailyRewardFormData>({
    resolver: zodResolver(dailyRewardSchema),
    defaultValues: {
      day: 1,
      reward: 0,
      type: 'USDT',
      isActive: true
    }
  });

  const handleCreateAchievement = async (data: AchievementFormData) => {
    try {
      const newAchievement: Achievement = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        reward: data.reward,
        icon: data.icon,
        category: data.category,
        rarity: data.rarity,
        requirement: {
          type: data.requirementType,
          target: data.requirementTarget
        },
        isActive: data.isActive,
        createdAt: new Date().toISOString(),
        claimedCount: 0
      };

      setAchievements(prev => [...prev, newAchievement]);
      achievementForm.reset();
      setIsAddingAchievement(false);

      toast({
        title: 'Achievement Created',
        description: `"${data.title}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create achievement.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateAchievement = async (data: AchievementFormData) => {
    if (!editingAchievement) return;

    try {
      setAchievements(prev => prev.map(achievement => 
        achievement.id === editingAchievement.id 
          ? {
              ...achievement,
              title: data.title,
              description: data.description,
              reward: data.reward,
              icon: data.icon,
              category: data.category,
              rarity: data.rarity,
              requirement: {
                type: data.requirementType,
                target: data.requirementTarget
              },
              isActive: data.isActive
            }
          : achievement
      ));

      setEditingAchievement(null);
      achievementForm.reset();

      toast({
        title: 'Achievement Updated',
        description: `"${data.title}" has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update achievement.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      setAchievements(prev => prev.filter(achievement => achievement.id !== id));
      
      toast({
        title: 'Achievement Deleted',
        description: 'Achievement has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete achievement.',
        variant: 'destructive'
      });
    }
  };

  const handleCreateDailyReward = async (data: DailyRewardFormData) => {
    try {
      const newDailyReward: DailyReward = {
        id: Date.now().toString(),
        day: data.day,
        reward: data.reward,
        type: data.type,
        isActive: data.isActive,
        claimedToday: 0
      };

      setDailyRewards(prev => [...prev, newDailyReward].sort((a, b) => a.day - b.day));
      dailyRewardForm.reset();
      setIsAddingDailyReward(false);

      toast({
        title: 'Daily Reward Created',
        description: `Day ${data.day} reward has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create daily reward.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateDailyReward = async (data: DailyRewardFormData) => {
    if (!editingDailyReward) return;

    try {
      setDailyRewards(prev => prev.map(reward => 
        reward.id === editingDailyReward.id 
          ? {
              ...reward,
              day: data.day,
              reward: data.reward,
              type: data.type,
              isActive: data.isActive
            }
          : reward
      ).sort((a, b) => a.day - b.day));

      setEditingDailyReward(null);
      dailyRewardForm.reset();

      toast({
        title: 'Daily Reward Updated',
        description: `Day ${data.day} reward has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update daily reward.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDailyReward = async (id: string) => {
    try {
      setDailyRewards(prev => prev.filter(reward => reward.id !== id));
      
      toast({
        title: 'Daily Reward Deleted',
        description: 'Daily reward has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete daily reward.',
        variant: 'destructive'
      });
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'trading': return 'text-green-600 bg-green-100';
      case 'referral': return 'text-blue-600 bg-blue-100';
      case 'milestone': return 'text-purple-600 bg-purple-100';
      case 'special': return 'text-orange-600 bg-orange-100';
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption?.icon || Trophy;
  };

  const startEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    achievementForm.reset({
      title: achievement.title,
      description: achievement.description,
      reward: achievement.reward,
      category: achievement.category,
      rarity: achievement.rarity,
      requirementType: achievement.requirement.type,
      requirementTarget: achievement.requirement.target,
      icon: achievement.icon,
      isActive: achievement.isActive
    });
  };

  const startEditDailyReward = (reward: DailyReward) => {
    setEditingDailyReward(reward);
    dailyRewardForm.reset({
      day: reward.day,
      reward: reward.reward,
      type: reward.type,
      isActive: reward.isActive
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Management</h2>
          <p className="text-muted-foreground">Manage achievements and daily rewards for users</p>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1">
          <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
          <TabsTrigger value="daily-rewards" className="text-xs sm:text-sm">Daily Rewards</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Achievements ({achievements.length})</h3>
            <Dialog open={isAddingAchievement} onOpenChange={setIsAddingAchievement}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Achievement</DialogTitle>
                  <DialogDescription>Add a new achievement for users to unlock</DialogDescription>
                </DialogHeader>
                
                <Form {...achievementForm}>
                  <form onSubmit={achievementForm.handleSubmit(handleCreateAchievement)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={achievementForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Achievement title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={achievementForm.control}
                        name="reward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reward (USDT)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={achievementForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Achievement description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={achievementForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="trading">Trading</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                                <SelectItem value="milestone">Milestone</SelectItem>
                                <SelectItem value="special">Special</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={achievementForm.control}
                        name="rarity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rarity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rarity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="common">Common</SelectItem>
                                <SelectItem value="rare">Rare</SelectItem>
                                <SelectItem value="epic">Epic</SelectItem>
                                <SelectItem value="legendary">Legendary</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={achievementForm.control}
                        name="requirementType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirement Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select requirement" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="balance">Balance</SelectItem>
                                <SelectItem value="referrals">Referrals</SelectItem>
                                <SelectItem value="trades">Trades</SelectItem>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="deposits">Deposits</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={achievementForm.control}
                        name="requirementTarget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Value</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="1" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={achievementForm.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {iconOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingAchievement(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Achievement</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              
              return (
                <Card key={achievement.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            <Badge className={getCategoryColor(achievement.category)}>
                              {achievement.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditAchievement(achievement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{achievement.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAchievement(achievement.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-green-600">${achievement.reward} USDT</div>
                      <Badge variant={achievement.isActive ? "default" : "secondary"}>
                        {achievement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Target: {achievement.requirement.target} {achievement.requirement.type} • 
                      Claimed: {achievement.claimedCount} times
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Edit Achievement Dialog */}
          <Dialog open={!!editingAchievement} onOpenChange={() => setEditingAchievement(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Achievement</DialogTitle>
                <DialogDescription>Update achievement details</DialogDescription>
              </DialogHeader>
              
              <Form {...achievementForm}>
                <form onSubmit={achievementForm.handleSubmit(handleUpdateAchievement)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={achievementForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Achievement title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={achievementForm.control}
                      name="reward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reward (USDT)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={achievementForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Achievement description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={achievementForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="trading">Trading</SelectItem>
                              <SelectItem value="referral">Referral</SelectItem>
                              <SelectItem value="milestone">Milestone</SelectItem>
                              <SelectItem value="special">Special</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={achievementForm.control}
                      name="rarity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rarity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rarity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="common">Common</SelectItem>
                              <SelectItem value="rare">Rare</SelectItem>
                              <SelectItem value="epic">Epic</SelectItem>
                              <SelectItem value="legendary">Legendary</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={achievementForm.control}
                      name="requirementType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirement Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select requirement" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="balance">Balance</SelectItem>
                              <SelectItem value="referrals">Referrals</SelectItem>
                              <SelectItem value="trades">Trades</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="deposits">Deposits</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={achievementForm.control}
                      name="requirementTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Value</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditingAchievement(null)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Achievement</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="daily-rewards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Daily Rewards ({dailyRewards.length})</h3>
            <Dialog open={isAddingDailyReward} onOpenChange={setIsAddingDailyReward}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Daily Reward
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Daily Reward</DialogTitle>
                  <DialogDescription>Add a new daily login reward</DialogDescription>
                </DialogHeader>
                
                <Form {...dailyRewardForm}>
                  <form onSubmit={dailyRewardForm.handleSubmit(handleCreateDailyReward)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={dailyRewardForm.control}
                        name="day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="30" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={dailyRewardForm.control}
                        name="reward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reward Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={dailyRewardForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reward Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USDT">USDT</SelectItem>
                              <SelectItem value="bonus">Bonus</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingDailyReward(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Reward</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dailyRewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Day {reward.day}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditDailyReward(reward)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Daily Reward</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete Day {reward.day} reward? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteDailyReward(reward.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {reward.day === 7 ? "🎁" : "💰"}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${reward.reward} {reward.type}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={reward.isActive ? "default" : "secondary"}>
                      {reward.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Claimed: {reward.claimedToday} today
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Daily Reward Dialog */}
          <Dialog open={!!editingDailyReward} onOpenChange={() => setEditingDailyReward(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Daily Reward</DialogTitle>
                <DialogDescription>Update daily reward details</DialogDescription>
              </DialogHeader>
              
              <Form {...dailyRewardForm}>
                <form onSubmit={dailyRewardForm.handleSubmit(handleUpdateDailyReward)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={dailyRewardForm.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Day</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="30" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={dailyRewardForm.control}
                      name="reward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reward Amount</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={dailyRewardForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USDT">USDT</SelectItem>
                            <SelectItem value="bonus">Bonus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setEditingDailyReward(null)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Reward</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{achievements.length}</div>
                <p className="text-xs text-muted-foreground">
                  {achievements.filter(a => a.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {achievements.reduce((sum, a) => sum + a.claimedCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time claims
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Daily Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailyRewards.length}</div>
                <p className="text-xs text-muted-foreground">
                  {dailyRewards.filter(r => r.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyRewards.reduce((sum, r) => sum + r.claimedToday, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Daily rewards claimed
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Performance</CardTitle>
              <CardDescription>Most claimed achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements
                  .sort((a, b) => b.claimedCount - a.claimedCount)
                  .slice(0, 5)
                  .map((achievement) => {
                    const IconComponent = getIconComponent(achievement.icon);
                    return (
                      <div key={achievement.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-muted-foreground">${achievement.reward} USDT</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{achievement.claimedCount}</p>
                          <p className="text-sm text-muted-foreground">claims</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
