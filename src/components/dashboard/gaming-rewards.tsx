"use client";

import * as React from "react";
import { Gift, Trophy, Users, MessageSquare, Award, Star, Crown, Target } from "lucide-react";
import { FeatureCard, GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GamingRewardsProps {
  className?: string;
}

export function GamingRewards({ className }: GamingRewardsProps) {
  const features = [
    {
      title: "Play and Earn",
      description: "Earn Rewards",
      icon: Gift,
      badge: "Active",
      variant: "gaming" as const,
      action: (
        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          Play Now
        </Button>
      ),
    },
    {
      title: "Messages",
      description: "0 messages",
      icon: MessageSquare,
      variant: "success" as const,
      action: <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">0</Badge>,
    },
  ];

  const stats = [
    { label: "Total Gifts", value: "0", icon: "🎁" },
    { label: "Total Referrals", value: "0", icon: "👥" },
    { label: "Tasks Completed", value: "0/16", icon: "✅" },
    { label: "AVEUM Earned", value: "0", icon: "🪙" },
  ];

  const topRankings = [
    { name: "CryptoKing", avatar: "/api/placeholder/32/32", rank: 1, points: "2,450" },
    { name: "TradeWizard", avatar: "/api/placeholder/32/32", rank: 2, points: "2,230" },
    { name: "BlockMaster", avatar: "/api/placeholder/32/32", rank: 3, points: "1,890" },
  ];

  const badges = [
    { name: "First Trade", icon: "⭐", earned: true },
    { name: "Profit Master", icon: "💎", earned: false },
    { name: "Squad Leader", icon: "👑", earned: true },
    { name: "Daily Trader", icon: "🔥", earned: false },
    { name: "Risk Taker", icon: "⚡", earned: true },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Hero Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            badge={feature.badge}
            action={feature.action}
            variant={feature.variant}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div />
          </FeatureCard>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <GlassCard
            key={stat.label}
            variant="gaming"
            glow="subtle"
            size="sm"
            className="text-center animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-2">
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Statistics */}
        <GlassCard variant="gaming" glow="subtle" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Referral Statistics
              </h3>
              <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
                0 AVEUM
              </Badge>
            </div>
            
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-purple-400 mb-2">0</div>
              <p className="text-muted-foreground">Total Referrals</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress to next reward</span>
                  <span>0/10</span>
                </div>
                <Progress value={0} className="h-2 bg-background/50" />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Top Rankings */}
        <GlassCard variant="gradient" glow="subtle" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Top Rankings
              </h3>
              <Crown className="h-5 w-5 text-yellow-400" />
            </div>
            
            <div className="space-y-3">
              {topRankings.map((user, index) => (
                <div
                  key={user.name}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                    index === 0 
                      ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30" 
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400/10 to-gray-300/10 border-gray-400/30"
                      : "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      index === 0 ? "bg-yellow-500 text-black" : 
                      index === 1 ? "bg-gray-400 text-black" : "bg-orange-500 text-white"
                    )}>
                      {user.rank}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                    {user.points} pts
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View Full Leaderboard
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Tasks and Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <GlassCard variant="success" glow="subtle" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Tasks
              </h3>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                0/16 Completed
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Daily Progress</span>
                <span>0/16</span>
              </div>
              <Progress value={0} className="h-2 bg-background/50" />
            </div>
            
            <div className="text-center py-4 text-muted-foreground">
              Complete tasks to earn rewards and level up your account
            </div>
            
            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              View Available Tasks
            </Button>
          </div>
        </GlassCard>

        {/* Badges */}
        <GlassCard variant="crypto" glow="subtle" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-cyan-400" />
                Badges
              </h3>
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                Collect Badges
              </Badge>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {badges.map((badge, index) => (
                <div
                  key={badge.name}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 border transition-all",
                    badge.earned 
                      ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-lg shadow-yellow-500/20" 
                      : "bg-background/30 border-border/30 opacity-50"
                  )}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs text-center leading-tight">{badge.name}</div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < 3 ? "text-yellow-400 fill-current" : "text-muted-foreground"
                    )}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">+5</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
