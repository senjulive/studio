'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Gift, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RewardsManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const mockAchievements = [
    {
      id: '1',
      title: 'Welcome Aboard',
      description: 'Make your first deposit to start trading',
      reward: 5,
      category: 'milestone',
      rarity: 'common',
      isActive: true,
      claimedCount: 247
    },
    {
      id: '2',
      title: 'High Roller',
      description: 'Reach $500 total balance',
      reward: 25,
      category: 'trading',
      rarity: 'rare',
      isActive: true,
      claimedCount: 89
    }
  ];

  const mockDailyRewards = [
    { id: '1', day: 1, reward: 2, type: 'USDT', isActive: true, claimedToday: 89 },
    { id: '2', day: 2, reward: 3, type: 'USDT', isActive: true, claimedToday: 67 },
    { id: '3', day: 3, reward: 4, type: 'USDT', isActive: true, claimedToday: 45 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Management</h2>
          <p className="text-muted-foreground">Manage achievements and daily rewards for users</p>
        </div>
        {isLoading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </div>
        )}
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1">
          <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
          <TabsTrigger value="daily-rewards" className="text-xs sm:text-sm">Daily Rewards</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Achievements ({mockAchievements.length})</h3>
            <Button>
              Add Achievement
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{achievement.rarity}</Badge>
                          <Badge variant="outline">{achievement.category}</Badge>
                        </div>
                      </div>
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
                    Claimed: {achievement.claimedCount} times
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily-rewards" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Daily Rewards ({mockDailyRewards.length})</h3>
            <Button>
              Add Daily Reward
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDailyRewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Day {reward.day}</CardTitle>
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAchievements.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockAchievements.filter(a => a.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockAchievements.reduce((sum, a) => sum + a.claimedCount, 0)}
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
                <div className="text-2xl font-bold">{mockDailyRewards.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockDailyRewards.filter(r => r.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockDailyRewards.reduce((sum, r) => sum + r.claimedToday, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Daily rewards claimed
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
