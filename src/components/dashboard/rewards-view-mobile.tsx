'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Gift, 
  Users, 
  Calendar,
  Coins,
  Star,
  Target,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const dailyTasks = [
  {
    id: 'login',
    title: 'Daily Login',
    description: 'Login to AstralCore',
    reward: 5,
    progress: 1,
    target: 1,
    completed: true,
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: 'trade',
    title: 'Complete a Trade',
    description: 'Execute any trading order',
    reward: 10,
    progress: 0,
    target: 1,
    completed: false,
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'invite',
    title: 'Invite a Friend',
    description: 'Share your referral link',
    reward: 25,
    progress: 0,
    target: 1,
    completed: false,
    icon: <Users className="w-5 h-5" />
  }
];

const achievements = [
  {
    id: 'first_trade',
    title: 'First Trade',
    description: 'Complete your first trade',
    reward: 50,
    unlocked: true,
    claimed: true,
    icon: <Target className="w-6 h-6" />
  },
  {
    id: 'week_streak',
    title: '7-Day Streak',
    description: 'Login for 7 consecutive days',
    reward: 100,
    unlocked: true,
    claimed: false,
    icon: <Calendar className="w-6 h-6" />
  },
  {
    id: 'profit_master',
    title: 'Profit Master',
    description: 'Earn $1000 in total profits',
    reward: 200,
    unlocked: false,
    claimed: false,
    icon: <Trophy className="w-6 h-6" />
  }
];

const referralRewards = [
  {
    id: 'bronze',
    title: 'Bronze Referrer',
    description: 'Refer 5 friends',
    reward: 100,
    progress: 2,
    target: 5,
    unlocked: false
  },
  {
    id: 'silver',
    title: 'Silver Referrer',
    description: 'Refer 15 friends',
    reward: 300,
    progress: 2,
    target: 15,
    unlocked: false
  },
  {
    id: 'gold',
    title: 'Gold Referrer',
    description: 'Refer 50 friends',
    reward: 1000,
    progress: 2,
    target: 50,
    unlocked: false
  }
];

export function RewardsViewMobile() {
  const { wallet } = useUser();
  const { toast } = useToast();

  const totalRewards = 347; // Mock data
  const todayRewards = 15; // Mock data
  const claimableRewards = 100; // Mock data

  const claimReward = (id: string, amount: number) => {
    toast({
      title: "Reward Claimed!",
      description: `You earned ${amount} USDT!`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Rewards Overview */}
      <div className="mobile-card">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-4 flex items-center justify-center electric-glow">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Rewards Center</h1>
          <p className="text-muted-foreground mb-6">
            Earn rewards for trading, referring friends, and completing tasks
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Total Earned</p>
              <p className="font-bold text-yellow-400">{totalRewards} USDT</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Calendar className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="font-bold text-green-400">+{todayRewards} USDT</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Gift className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Claimable</p>
              <p className="font-bold text-primary">{claimableRewards} USDT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Daily Tasks</h2>
          </div>
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div key={task.id} className="p-4 bg-background/50 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      task.completed ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                    )}>
                      {task.completed ? <CheckCircle className="w-5 h-5" /> : task.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <Badge variant={task.completed ? "default" : "secondary"} className={cn(
                    task.completed && "bg-green-500/20 text-green-400"
                  )}>
                    +{task.reward} USDT
                  </Badge>
                </div>
                {!task.completed && (
                  <div className="space-y-2">
                    <Progress value={(task.progress / task.target) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{task.progress}/{task.target}</span>
                      <span>{Math.round((task.progress / task.target) * 100)}% complete</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="font-bold text-lg">Achievements</h2>
          </div>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={cn(
                "p-4 rounded-xl border transition-all",
                achievement.unlocked 
                  ? "bg-background/50 border-primary/10" 
                  : "bg-muted/20 border-muted/30 opacity-60"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      achievement.unlocked 
                        ? achievement.claimed 
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                        : "bg-muted/50 text-muted-foreground"
                    )}>
                      {achievement.claimed ? <CheckCircle className="w-6 h-6" /> : achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {achievement.claimed ? (
                      <Badge variant="default" className="bg-green-500/20 text-green-400">
                        Claimed
                      </Badge>
                    ) : achievement.unlocked ? (
                      <Button
                        size="sm"
                        onClick={() => claimReward(achievement.id, achievement.reward)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500"
                      >
                        Claim {achievement.reward} USDT
                      </Button>
                    ) : (
                      <Badge variant="secondary">
                        {achievement.reward} USDT
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Program */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-lg">Referral Program</h2>
          </div>
          
          {/* Referral Stats */}
          <div className="p-4 bg-secondary/10 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Friends Referred</span>
              <span className="font-bold">2</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Referral Earnings</span>
              <span className="font-bold text-secondary">125 USDT</span>
            </div>
            <Button variant="outline" className="w-full mt-3">
              Share Referral Link
            </Button>
          </div>

          {/* Referral Milestones */}
          <div className="space-y-3">
            {referralRewards.map((reward) => (
              <div key={reward.id} className="p-4 bg-background/50 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <Badge variant="outline">
                    +{reward.reward} USDT
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={(reward.progress / reward.target) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{reward.progress}/{reward.target} referrals</span>
                    <span>{Math.round((reward.progress / reward.target) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-lg">Special Offers</h2>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold">Weekend Bonus</h3>
                <p className="text-sm text-muted-foreground">Double rewards for all activities</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ends in 2 days</span>
              </div>
              <Badge variant="outline" className="text-accent border-accent/50">
                2x Rewards
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
