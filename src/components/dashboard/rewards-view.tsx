'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Trophy, Gift, Star, Crown, Zap, Users, TrendingUp, CheckCircle, Clock, Coins, Sparkles, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  rarity: "common" | "rare" | "epic" | "legendary";
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
    title: "Welcome Aboard",
    description: "Make your first deposit to start your trading journey",
    reward: 5,
    icon: Coins,
    category: "milestone",
    requirement: { type: "deposits", target: 1, current: 0 },
    claimed: false,
    rarity: "common"
  },
  {
    id: "balance_100",
    title: "Centurion", 
    description: "Reach $100 total balance",
    reward: 10,
    icon: Trophy,
    category: "trading",
    requirement: { type: "balance", target: 100, current: 0 },
    claimed: false,
    rarity: "common"
  },
  {
    id: "balance_500",
    title: "High Roller",
    description: "Reach $500 total balance", 
    reward: 25,
    icon: Crown,
    category: "trading",
    requirement: { type: "balance", target: 500, current: 0 },
    claimed: false,
    rarity: "rare"
  },
  {
    id: "balance_1000",
    title: "Whale Status",
    description: "Reach $1,000 total balance",
    reward: 50,
    icon: Star,
    category: "trading", 
    requirement: { type: "balance", target: 1000, current: 0 },
    claimed: false,
    rarity: "epic"
  },
  {
    id: "balance_5000",
    title: "Elite Trader",
    description: "Reach $5,000 total balance",
    reward: 100,
    icon: Crown,
    category: "trading", 
    requirement: { type: "balance", target: 5000, current: 0 },
    claimed: false,
    rarity: "legendary"
  },
  {
    id: "referral_5",
    title: "Squad Builder",
    description: "Refer 5 new members",
    reward: 20,
    icon: Users,
    category: "referral",
    requirement: { type: "referrals", target: 5, current: 0 },
    claimed: false,
    rarity: "common"
  },
  {
    id: "referral_10", 
    title: "Community Leader",
    description: "Refer 10 new members",
    reward: 50,
    icon: Crown,
    category: "referral",
    requirement: { type: "referrals", target: 10, current: 0 },
    claimed: false,
    rarity: "rare"
  },
  {
    id: "referral_25", 
    title: "Network Master",
    description: "Refer 25 new members",
    reward: 150,
    icon: Sparkles,
    category: "referral",
    requirement: { type: "referrals", target: 25, current: 0 },
    claimed: false,
    rarity: "epic"
  },
  {
    id: "trading_streak",
    title: "Consistent Trader",
    description: "Trade for 7 consecutive days",
    reward: 15,
    icon: TrendingUp,
    category: "trading",
    requirement: { type: "days", target: 7, current: 0 },
    claimed: false,
    rarity: "common"
  },
  {
    id: "early_adopter",
    title: "Pioneer",
    description: "Special reward for early AstralCore adopters",
    reward: 100,
    icon: Zap,
    category: "special",
    requirement: { type: "days", target: 1, current: 1 },
    claimed: false,
    rarity: "legendary"
  }
];

const dailyRewards: DailyReward[] = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  reward: i === 6 ? 15 : [2, 3, 4, 5, 6, 8][i],
  claimed: i < 3,
  type: i === 6 ? "bonus" : "USDT"
}));

export function RewardsView() {
  const { wallet, tier } = useUser();
  const { toast } = useToast();
  const [userAchievements, setUserAchievements] = React.useState<Achievement[]>(achievements);
  const [dailyStreak, setDailyStreak] = React.useState(3);
  const [lastClaimDate, setLastClaimDate] = React.useState<Date>(new Date());

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

      setUserAchievements(prev => 
        prev.map(a => 
          a.id === achievementId ? { ...a, claimed: true } : a
        )
      );

      toast({
        title: "🎉 Reward Claimed!",
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

      if (hoursSinceLastClaim < 20) {
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
        title: "🔥 Daily Reward Claimed!",
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

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case "common": return "text-gray-600 border-gray-200 bg-gray-50";
      case "rare": return "text-blue-600 border-blue-200 bg-blue-50";
      case "epic": return "text-purple-600 border-purple-200 bg-purple-50";
      case "legendary": return "text-yellow-600 border-yellow-200 bg-yellow-50";
      default: return "text-gray-600 border-gray-200 bg-gray-50";
    }
  };

  const getRarityGradient = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case "common": return "from-gray-500/10 to-gray-600/10";
      case "rare": return "from-blue-500/10 to-blue-600/10";
      case "epic": return "from-purple-500/10 to-purple-600/10";
      case "legendary": return "from-yellow-500/10 to-yellow-600/10";
      default: return "from-gray-500/10 to-gray-600/10";
    }
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

  const canClaimDaily = () => {
    const now = new Date();
    const hoursSinceLastClaim = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastClaim >= 20;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Rewards Center</h1>
                  <p className="text-muted-foreground">Claim achievements and earn daily bonuses</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                  <Gift className="h-3 w-3 mr-1" />
                  Daily Rewards
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400">
                  <Award className="h-3 w-3 mr-1" />
                  Achievements
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Target className="h-3 w-3 mr-1" />
                  Milestones
                </Badge>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">${claimableRewardsValue}</div>
              <div className="text-sm text-muted-foreground">Available to Claim</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Daily Rewards
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-green-600/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <Gift className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">${claimableRewardsValue}</div>
                    <p className="text-sm text-muted-foreground">Ready to Claim</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {userAchievements.filter(a => a.claimed).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-br from-orange-500/5 to-orange-600/5 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-orange-500/20">
                    <Target className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {availableRewards.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {userAchievements.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Claim Section */}
          {availableRewards.length > 0 && (
            <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Sparkles className="h-5 w-5" />
                  🎉 Rewards Available!
                </CardTitle>
                <CardDescription>
                  You have {availableRewards.length} achievement{availableRewards.length !== 1 ? 's' : ''} ready to claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {availableRewards.map((achievement) => (
                    <Button
                      key={achievement.id}
                      onClick={() => handleClaimAchievement(achievement.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userAchievements.map((achievement) => {
              const progress = getProgressPercentage(achievement);
              const CategoryIcon = getCategoryIcon(achievement.category);
              const isCompleted = achievement.requirement.current >= achievement.requirement.target;
              const canClaim = isCompleted && !achievement.claimed;

              return (
                <Card key={achievement.id} className={cn(
                  "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                  achievement.claimed && "opacity-75",
                  canClaim && "border-green-500/50 shadow-green-500/20",
                  `bg-gradient-to-br ${getRarityGradient(achievement.rarity)}`
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-3 rounded-xl transition-colors",
                          achievement.claimed ? "bg-gray-100 dark:bg-gray-800" : "bg-primary/10"
                        )}>
                          <achievement.icon className={cn(
                            "h-6 w-6",
                            achievement.claimed ? "text-gray-500" : "text-primary"
                          )} />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {achievement.title}
                            {achievement.claimed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            <Badge variant="outline">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {achievement.category}
                            </Badge>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              ${achievement.reward} USDT
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{achievement.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {achievement.requirement.current}/{achievement.requirement.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    {canClaim ? (
                      <Button 
                        onClick={() => handleClaimAchievement(achievement.id)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
                        {Math.round(progress)}% Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          {/* Daily Streak Header */}
          <Card className="overflow-hidden bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
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
                        "relative text-center p-4 border rounded-xl transition-all duration-300",
                        isPast && "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30",
                        isToday && "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 ring-2 ring-blue-500/20",
                        isFuture && "bg-muted/50 border-border"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="text-lg font-bold">Day {reward.day}</div>
                        <div className="text-3xl">
                          {reward.day === 7 ? "🎁" : "💰"}
                        </div>
                        <div className="font-medium text-primary">
                          ${reward.reward} {reward.type}
                        </div>
                        {isPast && (
                          <Badge variant="default" className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Claimed
                          </Badge>
                        )}
                        {isToday && (
                          <Badge variant="default" className="bg-blue-500 text-white animate-pulse">
                            Today
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {canClaimDaily() && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleClaimDailyReward} 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Claim Today's Reward
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Rewards Info */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>How Daily Rewards Work</CardTitle>
              <CardDescription>Maximize your earnings with consistent daily logins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/20 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Daily Login</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit the platform each day to maintain your streak
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-500/5 to-green-600/5 border border-green-500/20 rounded-xl">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Claim Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Rewards increase each day, with a special bonus on day 7
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/5 to-purple-600/5 border border-purple-500/20 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Cycle Repeats</h4>
                  <p className="text-sm text-muted-foreground">
                    After day 7, the cycle starts over with increasing base rewards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Reward History
              </CardTitle>
              <CardDescription>
                Track your claimed rewards and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userAchievements
                  .filter(a => a.claimed)
                  .map((achievement) => (
                    <div key={achievement.id} className="group relative overflow-hidden rounded-xl border p-4 hover:border-primary/50 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                            <achievement.icon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{achievement.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-bold text-green-600">+${achievement.reward} USDT</div>
                          <Badge variant="default" className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Claimed
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {userAchievements.filter(a => a.claimed).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Rewards Yet</h3>
                    <p className="text-muted-foreground">Complete achievements to start earning!</p>
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
