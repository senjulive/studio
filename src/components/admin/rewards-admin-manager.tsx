'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Gift, 
  Users, 
  Star, 
  Crown, 
  Zap, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  Award,
  Coins,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface RewardItem {
  id: string;
  title: string;
  description: string;
  type: 'rank' | 'tier' | 'referral' | 'achievement' | 'daily' | 'special';
  amount: number;
  currency: 'USDT' | 'BTC' | 'ETH' | 'points';
  icon: string;
  isActive: boolean;
  requirements?: {
    minBalance?: number;
    minReferrals?: number;
    minTrades?: number;
    rankRequired?: string;
    tierRequired?: string;
  };
  cooldown?: number; // in hours
  maxClaims?: number;
  createdAt: string;
  updatedAt: string;
}

interface RewardSettings {
  globalMultiplier: number;
  dailyResetTime: string;
  maxRewardsPerDay: number;
  vipBonusMultiplier: number;
  referralLevels: {
    level: number;
    percentage: number;
    maxDepth: number;
  }[];
}

export function RewardsAdminManager() {
  const { toast } = useToast();
  const [rewards, setRewards] = React.useState<RewardItem[]>([]);
  const [settings, setSettings] = React.useState<RewardSettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingReward, setEditingReward] = React.useState<RewardItem | null>(null);
  const [newReward, setNewReward] = React.useState<Partial<RewardItem>>({
    type: 'achievement',
    currency: 'USDT',
    isActive: true,
    amount: 0
  });

  // Load rewards and settings
  React.useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    try {
      const [rewardsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/rewards'),
        fetch('/api/admin/rewards/settings')
      ]);
      
      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json();
        setRewards(rewardsData.rewards || []);
      }
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings || getDefaultSettings());
      }
    } catch (error) {
      console.error('Failed to load rewards data:', error);
      setSettings(getDefaultSettings());
    }
  };

  const getDefaultSettings = (): RewardSettings => ({
    globalMultiplier: 1.0,
    dailyResetTime: '00:00',
    maxRewardsPerDay: 10,
    vipBonusMultiplier: 1.5,
    referralLevels: [
      { level: 1, percentage: 5, maxDepth: 3 },
      { level: 2, percentage: 2, maxDepth: 2 },
      { level: 3, percentage: 1, maxDepth: 1 }
    ]
  });

  const saveReward = async (reward: RewardItem) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward })
      });

      if (response.ok) {
        await loadRewardsData();
        setEditingReward(null);
        setNewReward({ type: 'achievement', currency: 'USDT', isActive: true, amount: 0 });
        toast({
          title: 'Success',
          description: 'Reward saved successfully.'
        });
      } else {
        throw new Error('Failed to save reward');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save reward.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReward = async (rewardId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rewards/${rewardId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadRewardsData();
        toast({
          title: 'Success',
          description: 'Reward deleted successfully.'
        });
      } else {
        throw new Error('Failed to delete reward');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete reward.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/rewards/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Reward settings updated successfully.'
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'rank': return Crown;
      case 'tier': return Star;
      case 'referral': return Users;
      case 'achievement': return Trophy;
      case 'daily': return Zap;
      case 'special': return Gift;
      default: return Award;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rank': return 'bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-300';
      case 'tier': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-300';
      case 'referral': return 'bg-green-500/10 text-green-700 border-green-200 dark:text-green-300';
      case 'achievement': return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-300';
      case 'daily': return 'bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-300';
      case 'special': return 'bg-pink-500/10 text-pink-700 border-pink-200 dark:text-pink-300';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-300';
    }
  };

  const createReward = () => {
    if (!newReward.title || !newReward.description || !newReward.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const reward: RewardItem = {
      id: `reward-${Date.now()}`,
      title: newReward.title!,
      description: newReward.description!,
      type: newReward.type!,
      amount: newReward.amount!,
      currency: newReward.currency!,
      icon: newReward.icon || '🏆',
      isActive: newReward.isActive!,
      requirements: newReward.requirements,
      cooldown: newReward.cooldown,
      maxClaims: newReward.maxClaims,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveReward(reward);
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Rewards Management System
          </CardTitle>
          <CardDescription>
            Configure and manage all reward types, settings, and user achievements.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        {/* Rewards List */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Rewards</h3>
            <Badge variant="secondary">{rewards.length} total rewards</Badge>
          </div>

          <div className="grid gap-4">
            {rewards.map((reward) => {
              const IconComponent = getRewardIcon(reward.type);
              return (
                <Card key={reward.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{reward.title}</h4>
                            <Badge className={getTypeColor(reward.type)}>
                              {reward.type}
                            </Badge>
                            {!reward.isActive && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {reward.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center space-x-1">
                              <Coins className="h-4 w-4" />
                              <span>{reward.amount} {reward.currency}</span>
                            </span>
                            {reward.cooldown && (
                              <span className="text-muted-foreground">
                                Cooldown: {reward.cooldown}h
                              </span>
                            )}
                            {reward.maxClaims && (
                              <span className="text-muted-foreground">
                                Max: {reward.maxClaims} claims
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReward(reward)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Reward</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{reward.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteReward(reward.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Reward Settings</CardTitle>
              <CardDescription>
                Configure platform-wide reward parameters and multipliers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="globalMultiplier">Global Multiplier</Label>
                  <Input
                    id="globalMultiplier"
                    type="number"
                    step="0.1"
                    value={settings.globalMultiplier}
                    onChange={(e) => setSettings({
                      ...settings,
                      globalMultiplier: parseFloat(e.target.value) || 1
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vipBonus">VIP Bonus Multiplier</Label>
                  <Input
                    id="vipBonus"
                    type="number"
                    step="0.1"
                    value={settings.vipBonusMultiplier}
                    onChange={(e) => setSettings({
                      ...settings,
                      vipBonusMultiplier: parseFloat(e.target.value) || 1
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resetTime">Daily Reset Time</Label>
                  <Input
                    id="resetTime"
                    type="time"
                    value={settings.dailyResetTime}
                    onChange={(e) => setSettings({
                      ...settings,
                      dailyResetTime: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDaily">Max Rewards Per Day</Label>
                  <Input
                    id="maxDaily"
                    type="number"
                    value={settings.maxRewardsPerDay}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxRewardsPerDay: parseInt(e.target.value) || 10
                    })}
                  />
                </div>
              </div>

              <Button onClick={saveSettings} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-sm text-muted-foreground">Total Claims</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Coins className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">$12,450</p>
                    <p className="text-sm text-muted-foreground">Total Distributed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">342</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Create New Reward */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Reward</CardTitle>
              <CardDescription>
                Add a new reward type to the platform reward system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Reward Title *</Label>
                  <Input
                    id="title"
                    placeholder="Welcome Bonus"
                    value={newReward.title || ''}
                    onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Reward Type *</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newReward.type}
                    onChange={(e) => setNewReward({ ...newReward, type: e.target.value as any })}
                  >
                    <option value="achievement">Achievement</option>
                    <option value="rank">Rank Upgrade</option>
                    <option value="tier">Tier Unlock</option>
                    <option value="referral">Referral</option>
                    <option value="daily">Daily</option>
                    <option value="special">Special Event</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what users need to do to earn this reward..."
                  value={newReward.description || ''}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="10.00"
                    value={newReward.amount || ''}
                    onChange={(e) => setNewReward({ ...newReward, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <select
                    id="currency"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newReward.currency}
                    onChange={(e) => setNewReward({ ...newReward, currency: e.target.value as any })}
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="points">Points</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    placeholder="🏆"
                    value={newReward.icon || ''}
                    onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newReward.isActive}
                  onCheckedChange={(checked) => setNewReward({ ...newReward, isActive: checked })}
                />
                <Label htmlFor="isActive">Active immediately</Label>
              </div>

              <Button onClick={createReward} disabled={isLoading} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Reward
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
