'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Wallet,
  MessageCircle,
  Bell,
  Settings,
  TrendingUp,
  Shield,
  Users,
  Clock,
  DollarSign,
} from 'lucide-react';

// Mock data - replace with actual imports when data files are available
const chatsData: Record<string, any[]> = {
  'mock-user-123': [
    {
      id: 'msg_1',
      text: 'Welcome to support! This is a mock chat system.',
      timestamp: 1752503011049,
      sender: 'admin',
    },
  ],
};

const notificationsData: Record<string, any[]> = {
  'mock-user-123': [
    {
      title: '🎉 Welcome to AstralCore!',
      content: 'Welcome to the new AstralCore platform!',
      id: 'default-announcement-0',
      date: 1752192000000,
      read: true,
      href: '/dashboard/profile',
    },
  ],
};

const settingsData = {
  botSettings: {
    minGridBalance: 0,
  },
  botTierSettings: [],
};

const walletsData: Record<string, any> = {
  'mock-user-123': {
    addresses: {
      usdt: 'TgBkSNsxjUYOReLooneDs30nQoKUqpAMB1',
    },
    balances: {
      usdt: 0,
      btc: 0,
      eth: 0,
    },
    pendingWithdrawals: [],
    growth: {
      clicksLeft: 4,
      lastReset: 1752503271062,
      dailyEarnings: 0,
      earningsHistory: [],
    },
    squad: {
      referralCode: 'XYS0AR6R',
      members: ['mock-member-1', 'mock-member-2'],
    },
    profile: {
      username: 'DefaultUser',
      fullName: 'Default User',
      idCardNo: '000000000',
      contactNumber: '+0000000000',
      country: 'Default',
      avatarUrl: '',
      verificationStatus: 'unverified',
    },
    security: {
      withdrawalAddresses: {},
    },
  },
};

const publicChatData: any[] = [
  {
    id: 'msg_1',
    userId: 'admin-astralcore',
    displayName: 'AstralCore',
    text: 'Welcome to the AstralCore public chat!',
    timestamp: 1752503011049,
    isAdmin: true,
    rank: { name: 'Admin', minBalance: 999999, Icon: 'Shield', className: 'text-primary' },
    tier: null,
  },
];

const srcWalletsData = walletsData;
const squadChatsData = {};
const squadClansData = {};

const DataRepository = () => {
  const [selectedUser] = useState('mock-user-123');

  // Extract user data
  const userData = walletsData[selectedUser] || {};
  const userChats = chatsData[selectedUser] || [];
  const userNotifications = notificationsData[selectedUser] || [];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(4)} ${currency.toUpperCase()}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">AstralCore Repository Data</h1>
        <p className="text-muted-foreground">Complete overview of all platform data</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet size={16} />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageCircle size={16} />
            Chats
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="squad" className="flex items-center gap-2">
            <Users size={16} />
            Squad
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-primary" />
                User Profile
              </CardTitle>
              <CardDescription>Complete user profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData.profile?.avatarUrl} />
                  <AvatarFallback>{userData.profile?.username?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{userData.profile?.fullName || 'N/A'}</h3>
                  <p className="text-muted-foreground">@{userData.profile?.username || 'N/A'}</p>
                  <Badge
                    variant={
                      userData.profile?.verificationStatus === 'verified' ? 'default' : 'secondary'
                    }
                  >
                    {userData.profile?.verificationStatus || 'unverified'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID Card Number</label>
                  <p className="text-muted-foreground">{userData.profile?.idCardNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Number</label>
                  <p className="text-muted-foreground">
                    {userData.profile?.contactNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <p className="text-muted-foreground">{userData.profile?.country || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Referral Code</label>
                  <p className="text-primary font-mono">{userData.squad?.referralCode || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="text-green-500" />
                  Balances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(userData.balances || {}).map(([currency, balance]) => (
                    <div key={currency} className="flex justify-between items-center">
                      <span className="font-medium">{currency.toUpperCase()}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(balance as number, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="text-blue-500" />
                  Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(userData.addresses || {}).map(([currency, address]) => (
                    <div key={currency} className="space-y-1">
                      <span className="font-medium text-sm">{currency.toUpperCase()}</span>
                      <p className="text-xs text-muted-foreground font-mono break-all">
                        {address as string}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-purple-500" />
                Growth Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Clicks Left</label>
                  <p className="text-2xl font-bold text-primary">
                    {userData.growth?.clicksLeft || 0}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Daily Earnings</label>
                  <p className="text-2xl font-bold text-green-500">
                    ${userData.growth?.dailyEarnings || 0}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Reset</label>
                  <p className="text-sm text-muted-foreground">
                    {userData.growth?.lastReset
                      ? formatTimestamp(userData.growth.lastReset)
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Earnings History</label>
                  <p className="text-sm text-muted-foreground">
                    {userData.growth?.earningsHistory?.length || 0} entries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="text-blue-500" />
                  Private Messages
                </CardTitle>
                <CardDescription>{userChats.length} message(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {userChats.map((chat: any) => (
                    <div key={chat.id} className="p-3 border rounded-lg mb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{chat.sender}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{chat.text}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-green-500" />
                  Public Chat
                </CardTitle>
                <CardDescription>{publicChatData.length} message(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {publicChatData.map((message: any) => (
                    <div key={message.id} className="p-3 border rounded-lg mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={message.avatarUrl} />
                          <AvatarFallback>{message.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{message.displayName}</span>
                        {message.isAdmin && (
                          <Badge variant="destructive" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                      {message.rank && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {message.rank.name}
                        </Badge>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="text-yellow-500" />
                User Notifications
              </CardTitle>
              <CardDescription>{userNotifications.length} notification(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {userNotifications.map((notification: any) => (
                  <div key={notification.id} className="p-4 border rounded-lg mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <div className="flex items-center gap-2">
                        {notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            Read
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.date)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>
                    {notification.href && (
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        View Details
                      </Button>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="squad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-purple-500" />
                Squad Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Referral Code</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-mono text-lg text-primary">
                      {userData.squad?.referralCode || 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Squad Members</h4>
                  <div className="space-y-2">
                    {userData.squad?.members?.map((member: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{member.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member}</span>
                      </div>
                    )) || <p className="text-muted-foreground">No members</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="text-gray-500" />
                  Bot Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Minimum Grid Balance</label>
                    <p className="text-lg font-semibold">
                      ${settingsData.botSettings?.minGridBalance || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bot Tier Settings</label>
                    <p className="text-muted-foreground">
                      {settingsData.botTierSettings?.length || 0} tiers configured
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="text-red-500" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Withdrawal Addresses</label>
                    <p className="text-muted-foreground">
                      {Object.keys(userData.security?.withdrawalAddresses || {}).length} saved
                      address(es)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pending Withdrawals</label>
                    <p className="text-muted-foreground">
                      {userData.pendingWithdrawals?.length || 0} pending
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-8">
        <p className="text-sm text-muted-foreground">
          Data Repository • Last Updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default DataRepository;
