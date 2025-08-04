"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Activity,
  DollarSign,
  BarChart3
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TradingUser = {
  id: string;
  username: string;
  email: string;
  balance: number;
  tier: string;
  dailyEarnings: number;
  botStatus: 'online' | 'offline' | 'paused';
  verification: 'verified' | 'pending' | 'unverified';
  lastActivity: string;
};

type BotStats = {
  totalUsers: number;
  activeBots: number;
  totalVolume: number;
  totalEarnings: number;
  averageProfit: number;
};

const mockTradingUsers: TradingUser[] = [
  {
    id: '1',
    username: 'CryptoTrader',
    email: 'trader@example.com',
    balance: 5000,
    tier: 'VIP CORE IV',
    dailyEarnings: 275,
    botStatus: 'online',
    verification: 'verified',
    lastActivity: '2 minutes ago'
  },
  {
    id: '2',
    username: 'InvestorPro',
    email: 'investor@example.com',
    balance: 1500,
    tier: 'VIP CORE III',
    dailyEarnings: 60,
    botStatus: 'offline',
    verification: 'verified',
    lastActivity: '1 hour ago'
  },
  {
    id: '3',
    username: 'NewTrader',
    email: 'new@example.com',
    balance: 200,
    tier: 'VIP CORE I',
    dailyEarnings: 4,
    botStatus: 'paused',
    verification: 'pending',
    lastActivity: '3 hours ago'
  }
];

const mockBotStats: BotStats = {
  totalUsers: 1247,
  activeBots: 892,
  totalVolume: 2450000,
  totalEarnings: 125000,
  averageProfit: 2.3
};

export function BotManagement() {
  const { toast } = useToast();
  const [botStats, setBotStats] = React.useState<BotStats>(mockBotStats);
  const [tradingUsers, setTradingUsers] = React.useState<TradingUser[]>(mockTradingUsers);
  const [isLoading, setIsLoading] = React.useState(false);
  const [globalBotEnabled, setGlobalBotEnabled] = React.useState(true);
  const [minBalance, setMinBalance] = React.useState(100);
  const [maxDailyTrades, setMaxDailyTrades] = React.useState(10);

  const handleToggleUserBot = async (userId: string, currentStatus: string) => {
    setTradingUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            botStatus: currentStatus === 'online' ? 'offline' : 'online'
          }
        : user
    ));
    
    toast({
      title: "Bot Status Updated",
      description: `User bot ${currentStatus === 'online' ? 'stopped' : 'started'} successfully.`
    });
  };

  const handlePauseAllBots = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setTradingUsers(prev => prev.map(user => ({ ...user, botStatus: 'paused' as const })));
      setBotStats(prev => ({ ...prev, activeBots: 0 }));
      setIsLoading(false);
      
      toast({
        title: "All Bots Paused",
        description: "All trading bots have been paused successfully.",
        variant: "destructive"
      });
    }, 1000);
  };

  const handleResumeAllBots = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setTradingUsers(prev => prev.map(user => 
        user.verification === 'verified' 
          ? { ...user, botStatus: 'online' as const }
          : user
      ));
      setBotStats(prev => ({ ...prev, activeBots: tradingUsers.filter(u => u.verification === 'verified').length }));
      setIsLoading(false);
      
      toast({
        title: "Bots Resumed",
        description: "All verified user bots have been resumed.",
      });
    }, 1000);
  };

  const handleUpdateGlobalSettings = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Updated",
        description: "Global bot settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{botStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered traders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{botStats.activeBots.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently trading</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(botStats.totalVolume / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Trading volume today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${botStats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Platform earnings today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{botStats.averageProfit}%</div>
            <p className="text-xs text-muted-foreground">Average daily return</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Trading Users</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
          <TabsTrigger value="controls">Bot Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Users</CardTitle>
              <CardDescription>
                Monitor and manage individual user trading bots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Daily Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">${user.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.tier}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-green-600">
                        +${user.dailyEarnings.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.botStatus === 'online' ? 'default' :
                            user.botStatus === 'paused' ? 'secondary' : 'outline'
                          }
                          className={cn(
                            user.botStatus === 'online' && 'bg-green-600 hover:bg-green-700',
                            user.botStatus === 'paused' && 'bg-yellow-600 hover:bg-yellow-700'
                          )}
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full mr-2",
                            user.botStatus === 'online' ? 'bg-white animate-pulse' :
                            user.botStatus === 'paused' ? 'bg-white' : 'bg-gray-400'
                          )} />
                          {user.botStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.verification === 'verified' ? 'default' : 'secondary'}
                          className={user.verification === 'verified' ? 'bg-green-600' : ''}
                        >
                          {user.verification === 'verified' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : user.verification === 'pending' ? (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {user.verification}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActivity}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserBot(user.id, user.botStatus)}
                          disabled={user.verification !== 'verified'}
                        >
                          {user.botStatus === 'online' ? (
                            <Pause className="h-3 w-3 mr-1" />
                          ) : (
                            <Play className="h-3 w-3 mr-1" />
                          )}
                          {user.botStatus === 'online' ? 'Stop' : 'Start'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Bot Settings</CardTitle>
              <CardDescription>
                Configure platform-wide trading bot parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Global Bot System</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the entire trading bot system
                  </p>
                </div>
                <Switch
                  checked={globalBotEnabled}
                  onCheckedChange={setGlobalBotEnabled}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minBalance">Minimum Balance ($)</Label>
                  <Input
                    id="minBalance"
                    type="number"
                    value={minBalance}
                    onChange={(e) => setMinBalance(Number(e.target.value))}
                    placeholder="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum balance required to start trading
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTrades">Max Daily Trades</Label>
                  <Input
                    id="maxTrades"
                    type="number"
                    value={maxDailyTrades}
                    onChange={(e) => setMaxDailyTrades(Number(e.target.value))}
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum trades per user per day
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleUpdateGlobalSettings}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Update Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Bot Controls</CardTitle>
              <CardDescription>
                System-wide bot control and emergency actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pause className="h-5 w-5 text-yellow-600" />
                      Emergency Pause
                    </CardTitle>
                    <CardDescription>
                      Immediately pause all trading bots across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      onClick={handlePauseAllBots}
                      disabled={isLoading}
                      className="w-full border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Pause className="h-4 w-4 mr-2" />
                      )}
                      Pause All Bots
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Play className="h-5 w-5 text-green-600" />
                      Resume All
                    </CardTitle>
                    <CardDescription>
                      Resume all paused bots for verified users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      onClick={handleResumeAllBots}
                      disabled={isLoading}
                      className="w-full border-green-500/50 text-green-600 hover:bg-green-500/10"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Resume All Bots
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          globalBotEnabled ? "bg-green-500 animate-pulse" : "bg-red-500"
                        )} />
                        <span className="font-medium">Global Bot System</span>
                      </div>
                      <Badge variant={globalBotEnabled ? "default" : "destructive"}>
                        {globalBotEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="font-medium">Trading Engine</span>
                      </div>
                      <Badge variant="default" className="bg-blue-600">
                        Operational
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-medium">Risk Management</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
