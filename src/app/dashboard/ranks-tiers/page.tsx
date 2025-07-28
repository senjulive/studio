'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { getBotTierSettings } from '@/lib/tiers';
import { ranks } from '@/lib/ranks';
import { 
  Star,
  Crown,
  Award,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Zap,
  Gift,
  Target,
  Trophy,
  Sparkles,
  ArrowUp,
  Lock,
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

// Import tier icons
import { RecruitTierIcon } from '@/components/icons/tiers/recruit-tier-icon';
import { BronzeTierIcon } from '@/components/icons/tiers/bronze-tier-icon';
import { SilverTierIcon } from '@/components/icons/tiers/silver-tier-icon';
import { GoldTierIcon } from '@/components/icons/tiers/gold-tier-icon';
import { PlatinumTierIcon } from '@/components/icons/tiers/platinum-tier-icon';
import { DiamondTierIcon } from '@/components/icons/tiers/diamond-tier-icon';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ranks & Tiers - AstralCore",
  description: "Explore trading ranks, VIP tiers, and unlock premium benefits.",
};

const tierIcons = {
  'tier-1': RecruitTierIcon,
  'tier-2': BronzeTierIcon,
  'tier-3': SilverTierIcon,
  'tier-4': GoldTierIcon,
  'tier-5': PlatinumTierIcon,
  'tier-6': DiamondTierIcon,
};

const rankIcons = {
  'Recruit': RecruitRankIcon,
  'Bronze': BronzeRankIcon,
  'Silver': SilverRankIcon,
  'Gold': GoldRankIcon,
  'Platinum': PlatinumRankIcon,
  'Diamond': DiamondRankIcon,
};

interface RankBenefit {
  icon: any;
  title: string;
  description: string;
}

interface TierBenefit {
  icon: any;
  title: string;
  description: string;
  value: string;
}

const rankBenefits: Record<string, RankBenefit[]> = {
  'Recruit': [
    { icon: Star, title: 'Welcome Bonus', description: 'Get started with basic trading features' },
    { icon: Shield, title: 'Basic Support', description: 'Email support during business hours' }
  ],
  'Bronze': [
    { icon: TrendingUp, title: 'Enhanced Features', description: 'Access to advanced trading tools' },
    { icon: Gift, title: 'Monthly Rewards', description: 'Earn monthly trading bonuses' },
    { icon: Users, title: 'Community Access', description: 'Join exclusive Bronze trader groups' }
  ],
  'Silver': [
    { icon: Zap, title: 'Priority Execution', description: 'Faster trade execution speed' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Detailed performance insights' },
    { icon: Calendar, title: 'Priority Support', description: '24/7 priority customer support' }
  ],
  'Gold': [
    { icon: Crown, title: 'VIP Treatment', description: 'Dedicated account manager' },
    { icon: Target, title: 'Custom Strategies', description: 'Personalized trading strategies' },
    { icon: Trophy, title: 'Exclusive Events', description: 'Invitation to exclusive trader events' }
  ],
  'Platinum': [
    { icon: Sparkles, title: 'Premium Features', description: 'Access to all platform features' },
    { icon: Shield, title: 'Enhanced Security', description: 'Additional security features' },
    { icon: Users, title: 'Direct Access', description: 'Direct line to trading experts' }
  ],
  'Diamond': [
    { icon: Award, title: 'Elite Status', description: 'Highest tier benefits and recognition' },
    { icon: Crown, title: 'White Glove Service', description: 'Personalized concierge service' },
    { icon: Sparkles, title: 'Beta Features', description: 'Early access to new features' }
  ]
};

const tierBenefits: TierBenefit[] = [
  { icon: DollarSign, title: 'Daily Profit Rate', description: 'Higher profit rates for your investments', value: 'Up to 8.5%' },
  { icon: Target, title: 'Grid Levels', description: 'More sophisticated trading grids', value: 'Up to 15 levels' },
  { icon: Zap, title: 'Execution Speed', description: 'Lightning-fast trade execution', value: 'Sub-millisecond' },
  { icon: Users, title: 'Dedicated Support', description: 'Personal trading assistants', value: '24/7 Available' },
  { icon: Trophy, title: 'Exclusive Features', description: 'Access to premium trading tools', value: 'All unlocked' },
  { icon: Gift, title: 'Special Bonuses', description: 'Additional rewards and incentives', value: 'Monthly bonuses' }
];

export default function RanksTiersPage() {
  const { user, wallet, rank, tier, tierSettings } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock current stats
  const currentBalance = wallet?.balances?.usdt || 1500;
  const currentRank = rank || { name: 'Silver', minBalance: 1000, className: 'text-slate-400' };
  const currentTier = tier || { id: 'tier-3', name: 'VIP CORE III', balanceThreshold: 1000 };
  
  // Calculate progress to next rank
  const getNextRank = () => {
    const currentRankIndex = ranks.findIndex(r => r.name === currentRank.name);
    return currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;
  };

  const nextRank = getNextRank();
  const rankProgress = nextRank 
    ? ((currentBalance - currentRank.minBalance) / (nextRank.minBalance - currentRank.minBalance)) * 100
    : 100;

  // Calculate progress to next tier
  const getNextTier = () => {
    const allTiers = getBotTierSettings();
    const currentTierIndex = allTiers.findIndex(t => t.id === currentTier.id);
    return currentTierIndex < allTiers.length - 1 ? allTiers[currentTierIndex + 1] : null;
  };

  const nextTier = getNextTier();
  const tierProgress = nextTier 
    ? ((currentBalance - currentTier.balanceThreshold) / (nextTier.balanceThreshold - currentTier.balanceThreshold)) * 100
    : 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (rankName: string) => {
    const IconComponent = rankIcons[rankName as keyof typeof rankIcons] || RecruitRankIcon;
    return IconComponent;
  };

  const getTierIcon = (tierId: string) => {
    const IconComponent = tierIcons[tierId as keyof typeof tierIcons] || RecruitTierIcon;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ranks & Tiers</h1>
          <p className="text-muted-foreground">
            Advance your trading status and unlock exclusive benefits
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${currentRank.className} flex items-center gap-1`}>
            {React.createElement(getRankIcon(currentRank.name), { className: "h-4 w-4" })}
            {currentRank.name} Rank
          </Badge>
          <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
            {React.createElement(getTierIcon(currentTier.id), { className: "h-4 w-4" })}
            {currentTier.name}
          </Badge>
        </div>
      </div>

      {/* Current Status Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Current Rank: {currentRank.name}
            </CardTitle>
            <CardDescription>
              Your trading rank based on portfolio balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              {React.createElement(getRankIcon(currentRank.name), { 
                className: `h-20 w-20 ${currentRank.className}` 
              })}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
            </div>

            {nextRank && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextRank.name}</span>
                  <span>{Math.min(100, rankProgress).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(100, rankProgress)} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {formatCurrency(nextRank.minBalance - currentBalance)} more needed
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-blue-500" />
              Current Tier: {currentTier.name}
            </CardTitle>
            <CardDescription>
              Your VIP tier determines trading benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              {React.createElement(getTierIcon(currentTier.id), { 
                className: "h-20 w-20 text-blue-500" 
              })}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentTier.name}</div>
              <div className="text-sm text-muted-foreground">VIP Trading Tier</div>
            </div>

            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextTier.name}</span>
                  <span>{Math.min(100, tierProgress).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(100, tierProgress)} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {formatCurrency(nextTier.balanceThreshold - currentBalance)} more needed
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ranks">Ranks</TabsTrigger>
          <TabsTrigger value="tiers">VIP Tiers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How Rankings Work</CardTitle>
              <CardDescription>
                Understanding the difference between Ranks and VIP Tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Trading Ranks</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your total portfolio balance
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground pl-11">
                    <li>• Determines your status in the community</li>
                    <li>• Unlocks social features and rewards</li>
                    <li>• Provides access to exclusive events</li>
                    <li>• Increases with portfolio growth</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Crown className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">VIP Tiers</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your investment and activity level
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground pl-11">
                    <li>• Affects your trading bot performance</li>
                    <li>• Determines profit rates and fees</li>
                    <li>• Controls access to advanced features</li>
                    <li>• Provides priority support levels</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Benefits</CardTitle>
              <CardDescription>
                Benefits you're currently enjoying with your {currentRank.name} rank and {currentTier.name} tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    {currentRank.name} Rank Benefits
                  </h3>
                  <div className="space-y-3">
                    {rankBenefits[currentRank.name]?.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <benefit.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{benefit.title}</p>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-blue-500" />
                    {currentTier.name} Benefits
                  </h3>
                  <div className="space-y-3">
                    {tierBenefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <benefit.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{benefit.title}</p>
                              <p className="text-xs text-muted-foreground">{benefit.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {benefit.value}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranks Tab */}
        <TabsContent value="ranks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading Ranks</CardTitle>
              <CardDescription>
                Advance through ranks by growing your portfolio balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ranks.filter(rank => rank.Icon !== 'Lock').map((rank, index) => {
                  const RankIcon = getRankIcon(rank.name);
                  const isCurrentRank = rank.name === currentRank.name;
                  const isUnlocked = currentBalance >= rank.minBalance;
                  
                  return (
                    <div key={rank.name} className={`relative p-4 rounded-lg border ${
                      isCurrentRank ? 'border-primary bg-primary/5' : 
                      isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${
                            isCurrentRank ? 'bg-primary/10' : 
                            isUnlocked ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <RankIcon className={`h-8 w-8 ${
                              isCurrentRank ? 'text-primary' : 
                              isUnlocked ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-bold text-lg ${rank.className}`}>
                                {rank.name}
                              </h3>
                              {isCurrentRank && (
                                <Badge className="bg-primary text-primary-foreground">
                                  Current
                                </Badge>
                              )}
                              {isUnlocked && !isCurrentRank && (
                                <Badge className="bg-green-500 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Unlocked
                                </Badge>
                              )}
                              {!isUnlocked && (
                                <Badge variant="outline">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Locked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Minimum balance: {formatCurrency(rank.minBalance)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Benefits</div>
                          <div className="text-lg font-semibold">
                            {rankBenefits[rank.name]?.length || 0} features
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mt-4 grid md:grid-cols-3 gap-3">
                        {rankBenefits[rank.name]?.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <benefit.icon className={`h-4 w-4 ${
                              isUnlocked ? 'text-green-500' : 'text-gray-400'
                            }`} />
                            <span className={`text-sm ${
                              isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {benefit.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {isCurrentRank && nextRank && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress to {nextRank.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.min(100, rankProgress).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={Math.min(100, rankProgress)} className="w-full" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(nextRank.minBalance - currentBalance)} more needed
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIP Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VIP Trading Tiers</CardTitle>
              <CardDescription>
                Higher tiers provide better trading conditions and exclusive features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getBotTierSettings().filter(tier => !tier.locked).map((tier, index) => {
                  const TierIcon = getTierIcon(tier.id);
                  const isCurrentTier = tier.id === currentTier.id;
                  const isUnlocked = currentBalance >= tier.balanceThreshold;
                  
                  return (
                    <div key={tier.id} className={`relative p-4 rounded-lg border ${
                      isCurrentTier ? 'border-blue-500 bg-blue-50' : 
                      isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${
                            isCurrentTier ? 'bg-blue-100' : 
                            isUnlocked ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <TierIcon className={`h-8 w-8 ${
                              isCurrentTier ? 'text-blue-600' : 
                              isUnlocked ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-lg text-blue-600">
                                {tier.name}
                              </h3>
                              {isCurrentTier && (
                                <Badge className="bg-blue-500 text-white">
                                  Current
                                </Badge>
                              )}
                              {isUnlocked && !isCurrentTier && (
                                <Badge className="bg-green-500 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Unlocked
                                </Badge>
                              )}
                              {!isUnlocked && (
                                <Badge variant="outline">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Locked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Minimum balance: {formatCurrency(tier.balanceThreshold)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Daily Profit</div>
                          <div className="text-lg font-semibold text-green-600">
                            {(tier.dailyProfit * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Tier Stats */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <DollarSign className={`h-5 w-5 mx-auto mb-1 ${
                            isUnlocked ? 'text-green-500' : 'text-gray-400'
                          }`} />
                          <div className="text-sm font-medium">Daily Profit</div>
                          <div className="text-xs text-muted-foreground">
                            {(tier.dailyProfit * 100).toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg">
                          <Target className={`h-5 w-5 mx-auto mb-1 ${
                            isUnlocked ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                          <div className="text-sm font-medium">Daily Clicks</div>
                          <div className="text-xs text-muted-foreground">
                            {tier.clicks} times
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg">
                          <Zap className={`h-5 w-5 mx-auto mb-1 ${
                            isUnlocked ? 'text-yellow-500' : 'text-gray-400'
                          }`} />
                          <div className="text-sm font-medium">Execution</div>
                          <div className="text-xs text-muted-foreground">
                            Priority
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg">
                          <Users className={`h-5 w-5 mx-auto mb-1 ${
                            isUnlocked ? 'text-purple-500' : 'text-gray-400'
                          }`} />
                          <div className="text-sm font-medium">Support</div>
                          <div className="text-xs text-muted-foreground">
                            Enhanced
                          </div>
                        </div>
                      </div>

                      {isCurrentTier && nextTier && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress to {nextTier.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.min(100, tierProgress).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={Math.min(100, tierProgress)} className="w-full" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(nextTier.balanceThreshold - currentBalance)} more needed
                          </div>
                        </div>
                      )}
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
