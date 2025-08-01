'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { 
  User, 
  Shield, 
  Trophy, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  Camera, 
  Verified, 
  Crown, 
  Zap,
  TrendingUp,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { countries } from '@/lib/countries';

export function ModernProfileView() {
  const { user, wallet, rank, tier } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showSensitive, setShowSensitive] = React.useState(false);

  const userCountry = countries.find(c => c.name === wallet?.profile?.country);
  const verificationProgress = wallet?.profile?.verificationStatus === 'verified' ? 100 : 
                              wallet?.profile?.verificationStatus === 'verifying' ? 50 : 0;

  const stats = [
    {
      label: 'Total Balance',
      value: `$${(wallet?.balances?.usdt || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Daily Earnings',
      value: `$${(wallet?.growth?.dailyEarnings || 0).toFixed(2)}`,
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Squad Members',
      value: wallet?.squad?.members?.length || 0,
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Member Since',
      value: 'Dec 2024',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <CardContent className="relative pt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-2xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      {wallet?.profile?.username || 'Set Username'}
                    </h1>
                    {userCountry && (
                      <span className="text-2xl">{userCountry.flag}</span>
                    )}
                    {wallet?.profile?.verificationStatus === 'verified' && (
                      <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>

                {/* Rank and Tier */}
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className={cn("flex items-center gap-2 px-3 py-1", rank.className)}>
                    <Crown className="h-4 w-4" />
                    <span className="font-medium">{rank.name}</span>
                  </Badge>
                  {tier && (
                    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-700 border-yellow-200">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">{tier.name}</span>
                    </Badge>
                  )}
                </div>

                {/* Verification Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Verification</span>
                    <span className="text-sm text-muted-foreground">{verificationProgress}%</span>
                  </div>
                  <Progress value={verificationProgress} className="h-2" />
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className="shrink-0"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue={wallet?.profile?.fullName || ''}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue={wallet?.profile?.username || ''}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type={showSensitive ? "text" : "password"}
                        defaultValue={wallet?.profile?.contactNumber || ''}
                        disabled={!isEditing}
                        className="bg-background/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowSensitive(!showSensitive)}
                      >
                        {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      defaultValue={wallet?.profile?.country || ''}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idCard">ID Card Number</Label>
                    <div className="relative">
                      <Input
                        id="idCard"
                        type={showSensitive ? "text" : "password"}
                        defaultValue={wallet?.profile?.idCardNo || ''}
                        disabled={!isEditing}
                        className="bg-background/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                        onClick={() => setShowSensitive(!showSensitive)}
                      >
                        {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button className="bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and verification status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Account Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        Status: {wallet?.profile?.verificationStatus || 'Unverified'}
                      </p>
                    </div>
                    <Button variant="outline">
                      {wallet?.profile?.verificationStatus === 'verified' ? 'Verified' : 'Verify Now'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>
                  Customize your platform experience and notification settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Trading Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified about trading opportunities</p>
                    </div>
                    <Button variant="outline">Settings</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">Control your data and privacy</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
