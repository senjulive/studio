'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Trophy, Gift, Star, Crown, Zap, Users, TrendingUp, CheckCircle, Clock, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

type Achievement = {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ElementType;
  category: "trading" | "referral" | "milestone" | "special";
  requirement: {
    type: "balance" | "referrals" | "trades" | "days" | "deposits";
    target: number;
    current?: number;
  };
  claimed: boolean;
};

type DailyReward = {
  day: number;
  reward: number;
  claimed: boolean;
  type: "USDT" | "bonus";
};

const achievements: Achievement[] = [
  {
    id: "first_deposit",
    title: "First Deposit",
    description: "Make your first deposit to start trading",
    reward: 5,
    icon: Coins,
    category: "milestone",
    requirement: { type: "deposits", target: 1, current: 0 },
    claimed: false
  },
  {
    id: "balance_100",
    title: "Centurion", 
    description: "Reach $100 total balance",
    reward: 10,
    icon: Trophy,
    category: "trading",
    requirement: { type: "balance", target: 100, current: 0 },
    claimed: false
  },
  {
    id: "balance_500",
    title: "High Roller",
    description: "Reach $500 total balance", 
    reward: 25,
    icon: Crown,
    category: "trading",
    requirement: { type: "balance", target: 500, current: 0 },
    claimed: false
  },
  {
    id: "balance_1000",
    title: "Whale Status",
    description: "Reach $1,000 total balance",
    reward: 50,
    icon: Star,
    category: "trading", 
    requirement: { type: "balance", target: 1000, current: 0 },
    claimed: false
  },
  {
    id: "referral_5",
    title: "Squad Builder",
    description: "Refer 5 new members",
    reward: 20,
    icon: Users,
    category: "referral",
    requirement: { type: "referrals", target: 5, current: 0 },
    claimed: false
  },
  {
    id: "referral_10", 
    title: "Community Leader",
    description: "Refer 10 new members",
    reward: 50,
    icon: Crown,
    category: "referral",
    requirement: { type: "referrals", target: 10, current: 0 },
    claimed: false
  },
  {
    id: "trading_streak",
    title: "Consistent Trader",
    description: "Trade for 7 consecutive days",
    reward: 15,
    icon: TrendingUp,
    category: "trading",
    requirement: { type: "days", target: 7, current: 0 },
    claimed: false
  },
  {
    id: "early_adopter",
    title: "Early Adopter",
    description: "Special reward for joining AstralCore",
    reward: 100,
    icon: Zap,
    category: "special",
    requirement: { type: "days", target: 1, current: 1 },
    claimed: false
  }
];

const dailyRewards: DailyReward[] = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  reward: i === 6 ? 10 : [1, 1.5, 2, 2.5, 3, 5][i],
  claimed: i < 3, // Mock: first 3 days claimed
  type: i === 6 ? "bonus" : "USDT"
}));

export function RewardsView() {
  const { wallet, tier } = useUser();
  const { toast } = useToast();
  const [userAchievements, setUserAchievements] = React.useState<Achievement[]>(achievements);
  const [dailyStreak, setDailyStreak] = React.useState(3); // Mock current streak
  const [lastClaimDate, setLastClaimDate] = React.useState<Date>(new Date());

  // Update achievements with current user data
  React.useEffect(() => {
    if (wallet) {
      const totalBalance = wallet.balances?.usdt || 0;
      const referralCount = wallet.squad?.members?.length || 0;
      const depositCount = wallet.deposit_history?.length || 0;

      setUserAchievements(prev => prev.map(achievement => {
        let current = 0;
        switch (achievement.requirement.type) {
          case "balance":
            current = totalBalance;
            break;
          case "referrals":
            current = referralCount;
            break;
          case "deposits":
            current = depositCount;
            break;
          case "days":
          case "trades":
            current = achievement.requirement.current || 0;
            break;
        }

        return {
          ...achievement,
          requirement: { ...achievement.requirement, current },
          claimed: wallet.claimed_achievements?.achievements?.includes(achievement.id) || false
        };
      }));
    }
  }, [wallet]);

  const availableRewards = userAchievements.filter(a => 
    a.requirement.current >= a.requirement.target && !a.claimed
  );

  const claimableRewardsValue = availableRewards.reduce((sum, reward) => sum + reward.reward, 0);

  const handleClaimAchievement = async (achievementId: string) => {
    try {
      const achievement = userAchievements.find(a => a.id === achievementId);
      if (!achievement || achievement.claimed) return;

      // Here you would normally make an API call to claim the reward
      console.log(`Claiming achievement: ${achievementId}`);

      setUserAchievements(prev => 
        prev.map(a => 
          a.id === achievementId ? { ...a, claimed: true } : a
        )
      );

      toast({
        title: "Reward Claimed!",
        description: `You earned $${achievement.reward} USDT for "${achievement.title}"`,
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClaimDailyReward = async () => {
    try {
      const today = new Date();
      const lastClaim = lastClaimDate;
      const hoursSinceLastClaim = (today.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastClaim < 20) { // Allow claim every 20 hours
        toast({
          title: "Already Claimed",
          description: "You can claim your next daily reward in a few hours.",
          variant: "destructive"
        });
        return;
      }

      const nextDay = dailyStreak + 1;
      const reward = dailyRewards[Math.min(nextDay - 1, 6)];

      setDailyStreak(prev => Math.min(prev + 1, 7));
      setLastClaimDate(today);

      toast({
        title: "Daily Reward Claimed!",
        description: `You earned $${reward.reward} USDT! Day ${nextDay} streak.`,
      });
    } catch (error) {
      toast({
        title: "Claim Failed", 
        description: "Failed to claim daily reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    const { current = 0, target } = achievement.requirement;
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case "trading": return TrendingUp;
      case "referral": return Users;
      case "milestone": return Trophy;
      case "special": return Star;
      default: return Gift;
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case "trading": return "text-blue-600";
      case "referral": return "text-green-600";
      case "milestone": return "text-yellow-600";
      case "special": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const canClaimDaily = () => {
    const now = new Date();
    const hoursSinceLastClaim = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastClaim >= 20;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Rewards Center
          </CardTitle>
          <CardDescription>
            Claim achievements and daily rewards to boost your earnings
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="daily">Daily Rewards</TabsTrigger>
          <TabsTrigger value="history">Reward History</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">${claimableRewardsValue}</div>
                <p className="text-sm text-muted-foreground">Ready to claim</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {userAchievements.filter(a => a.claimed).length}
                </div>
                <p className="text-sm text-muted-foreground">Achievements unlocked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {userAchievements.filter(a => a.requirement.current >= a.requirement.target && !a.claimed).length}
                </div>
                <p className="text-sm text-muted-foreground">Ready to claim</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Claim */}
          {availableRewards.length > 0 && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">
                  🎉 Rewards Available!
                </CardTitle>
                <CardDescription>
                  You have {availableRewards.length} achievement{availableRewards.length !== 1 ? 's' : ''} ready to claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableRewards.map((achievement) => (
                    <Button
                      key={achievement.id}
                      size="sm"
                      onClick={() => handleClaimAchievement(achievement.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Claim ${achievement.reward} - {achievement.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievement Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {userAchievements.map((achievement) => {
              const progress = getProgressPercentage(achievement);
              const CategoryIcon = getCategoryIcon(achievement.category);
              const isCompleted = achievement.requirement.current >= achievement.requirement.target;
              const canClaim = isCompleted && !achievement.claimed;

              return (
                <Card key={achievement.id} className={cn(
                  "relative overflow-hidden",
                  achievement.claimed && "opacity-75",
                  canClaim && "border-green-200 dark:border-green-800"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          achievement.claimed ? "bg-gray-100 dark:bg-gray-800" : "bg-primary/10"
                        )}>
                          <achievement.icon className={cn(
                            "h-5 w-5",
                            achievement.claimed ? "text-gray-500" : "text-primary"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {achievement.title}
                            {achievement.claimed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {achievement.category}
                            </Badge>
                            <Badge variant="secondary">
                              ${achievement.reward} USDT
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {achievement.requirement.current}/{achievement.requirement.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    {canClaim ? (
                      <Button 
                        onClick={() => handleClaimAchievement(achievement.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Claim ${achievement.reward} USDT
                      </Button>
                    ) : achievement.claimed ? (
                      <Button variant="outline" disabled className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Claimed
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="w-full">
                        <Clock className="h-4 w-4 mr-2" />
                        In Progress
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          {/* Daily Streak Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Daily Login Streak: {dailyStreak} days
              </CardTitle>
              <CardDescription>
                Login daily to maintain your streak and earn increasing rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-7">
                {dailyRewards.map((reward) => {
                  const isToday = reward.day === dailyStreak + 1;
                  const isPast = reward.day <= dailyStreak;
                  const isFuture = reward.day > dailyStreak + 1;

                  return (
                    <div
                      key={reward.day}
                      className={cn(
                        "text-center p-4 border rounded-lg",
                        isPast && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                        isToday && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                        isFuture && "bg-muted/50"
                      )}
                    >
                      <div className="text-lg font-bold mb-2">Day {reward.day}</div>
                      <div className="text-2xl mb-2">
                        {reward.day === 7 ? "🎁" : "💰"}
                      </div>
                      <div className="font-medium">
                        ${reward.reward} {reward.type}
                      </div>
                      {isPast && (
                        <Badge variant="default" className="mt-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Claimed
                        </Badge>
                      )}
                      {isToday && (
                        <Badge variant="secondary" className="mt-2">
                          Today
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {canClaimDaily() && (
                <div className="mt-6 text-center">
                  <Button onClick={handleClaimDailyReward} size="lg">
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Today's Reward
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Reward Info */}
          <Card>
            <CardHeader>
              <CardTitle>How Daily Rewards Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Login Daily</h4>
                    <p className="text-sm text-muted-foreground">
                      Visit the platform each day to maintain your streak
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Claim Rewards</h4>
                    <p className="text-sm text-muted-foreground">
                      Rewards increase each day, with a special bonus on day 7
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Cycle Repeats</h4>
                    <p className="text-sm text-muted-foreground">
                      After day 7, the cycle starts over with increasing base rewards
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rewards</CardTitle>
              <CardDescription>
                Your reward claim history and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userAchievements
                  .filter(a => a.claimed)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <achievement.icon className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+${achievement.reward} USDT</div>
                        <div className="text-xs text-muted-foreground">Claimed</div>
                      </div>
                    </div>
                  ))}
                
                {userAchievements.filter(a => a.claimed).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No rewards claimed yet</p>
                    <p className="text-sm">Complete achievements to start earning!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
