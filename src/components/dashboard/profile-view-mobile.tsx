'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Shield,
  Bell,
  Globe,
  Smartphone,
  Eye,
  EyeOff,
  Edit,
  Save,
  X
} from 'lucide-react';

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
];

export function ProfileViewMobile() {
  const { wallet, rank, tier } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    username: wallet?.profile?.username || 'User',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    country: 'US',
    timezone: 'America/New_York',
    language: 'en'
  });
  const [notifications, setNotifications] = React.useState({
    trading: true,
    deposits: true,
    withdrawals: true,
    marketing: false,
    security: true
  });
  const [privacy, setPrivacy] = React.useState({
    showProfile: true,
    showStats: false,
    showActivity: false
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const userInitial = profileData.username.charAt(0).toUpperCase();
  const selectedCountry = countries.find(c => c.code === profileData.country);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="mobile-card">
        <div className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={wallet?.profile?.avatarUrl} alt="Profile" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <h1 className="text-xl font-bold mb-2">{profileData.username}</h1>
          <p className="text-muted-foreground mb-4">{profileData.email}</p>
          
          {/* Rank and Tier Badges */}
          <div className="flex justify-center gap-2 mb-4">
            {rank && (
              <Badge variant="outline" className={cn("flex items-center gap-1.5", rank.className)}>
                <span>{rank.name}</span>
              </Badge>
            )}
            {tier && (
              <Badge variant="outline" className="flex items-center gap-1.5 bg-secondary/20 text-secondary">
                <span>{tier.name} Tier</span>
              </Badge>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-background/50 rounded-xl">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="font-semibold">Jan 2024</p>
            </div>
            <div className="p-3 bg-background/50 rounded-xl">
              <p className="text-xs text-muted-foreground">Total Trades</p>
              <p className="font-semibold">247</p>
            </div>
            <div className="p-3 bg-background/50 rounded-xl">
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="font-semibold text-green-400">92.3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Personal Information</h2>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Select 
                value={profileData.country} 
                onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue>
                    {selectedCountry && (
                      <div className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="font-bold text-lg">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
              <div>
                <h3 className="font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400/50">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
              <div>
                <h3 className="font-semibold">Email Verification</h3>
                <p className="text-sm text-muted-foreground">Verify your email address</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400/50">
                Verified
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
              <div>
                <h3 className="font-semibold">Login Notifications</h3>
                <p className="text-sm text-muted-foreground">Get notified of new logins</p>
              </div>
              <Switch checked={notifications.security} onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, security: checked }))
              } />
            </div>

            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Trading Alerts</h3>
                <p className="text-sm text-muted-foreground">Bot activity and trade results</p>
              </div>
              <Switch 
                checked={notifications.trading} 
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, trading: checked }))
                } 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Deposit Confirmations</h3>
                <p className="text-sm text-muted-foreground">When deposits are received</p>
              </div>
              <Switch 
                checked={notifications.deposits} 
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, deposits: checked }))
                } 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Withdrawal Updates</h3>
                <p className="text-sm text-muted-foreground">Status of withdrawal requests</p>
              </div>
              <Switch 
                checked={notifications.withdrawals} 
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, withdrawals: checked }))
                } 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Marketing Updates</h3>
                <p className="text-sm text-muted-foreground">Promotions and new features</p>
              </div>
              <Switch 
                checked={notifications.marketing} 
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, marketing: checked }))
                } 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-lg">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Public Profile</h3>
                <p className="text-sm text-muted-foreground">Others can see your profile</p>
              </div>
              <Switch 
                checked={privacy.showProfile} 
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, showProfile: checked }))
                } 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Show Trading Stats</h3>
                <p className="text-sm text-muted-foreground">Display your performance metrics</p>
              </div>
              <Switch 
                checked={privacy.showStats} 
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, showStats: checked }))
                } 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Show Activity</h3>
                <p className="text-sm text-muted-foreground">Others can see your recent activity</p>
              </div>
              <Switch 
                checked={privacy.showActivity} 
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, showActivity: checked }))
                } 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="mobile-card">
        <div className="p-6 space-y-3">
          <Button variant="outline" className="w-full">
            Download Account Data
          </Button>
          <Button variant="outline" className="w-full text-orange-400 border-orange-400/50 hover:bg-orange-400/10">
            Deactivate Account
          </Button>
          <Button variant="outline" className="w-full text-red-400 border-red-400/50 hover:bg-red-400/10">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
