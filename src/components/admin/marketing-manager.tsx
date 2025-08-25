'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Megaphone, Mail, Users, TrendingUp, Eye, Calendar, Plus, Edit, Trash2, Send, Target, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['email', 'notification', 'banner', 'referral']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  targetAudience: z.enum(['all', 'new_users', 'active_traders', 'inactive_users', 'high_value']),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(0),
  isActive: z.boolean().default(true)
});

const referralProgramSchema = z.object({
  name: z.string().min(1, 'Program name is required'),
  description: z.string().min(1, 'Description is required'),
  referrerReward: z.number().min(0, 'Referrer reward must be positive'),
  refereeReward: z.number().min(0, 'Referee reward must be positive'),
  minDeposit: z.number().min(0, 'Minimum deposit must be positive'),
  validUntil: z.string(),
  isActive: z.boolean().default(true)
});

type CampaignFormData = z.infer<typeof campaignSchema>;
type ReferralProgramFormData = z.infer<typeof referralProgramSchema>;

type Campaign = {
  id: string;
  name: string;
  type: 'email' | 'notification' | 'banner' | 'referral';
  title: string;
  message: string;
  targetAudience: 'all' | 'new_users' | 'active_traders' | 'inactive_users' | 'high_value';
  startDate: string;
  endDate: string;
  budget: number;
  isActive: boolean;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
};

type ReferralProgram = {
  id: string;
  name: string;
  description: string;
  referrerReward: number;
  refereeReward: number;
  minDeposit: number;
  validUntil: string;
  isActive: boolean;
  stats: {
    totalReferrals: number;
    successfulReferrals: number;
    totalRewardsPaid: number;
  };
  createdAt: string;
};

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Welcome Campaign',
    type: 'email',
    title: 'Welcome to AstralCore!',
    message: 'Start your trading journey with our AI-powered platform.',
    targetAudience: 'new_users',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 1000,
    isActive: true,
    stats: { sent: 1250, opened: 875, clicked: 234, converted: 89 },
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Deposit Bonus',
    type: 'notification',
    title: 'Get 20% Bonus on Your Next Deposit!',
    message: 'Limited time offer - deposit now and get 20% bonus.',
    targetAudience: 'active_traders',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    budget: 2500,
    isActive: true,
    stats: { sent: 890, opened: 567, clicked: 156, converted: 45 },
    createdAt: '2024-01-15'
  }
];

const mockReferralPrograms: ReferralProgram[] = [
  {
    id: '1',
    name: 'Friend Referral Program',
    description: 'Refer friends and earn $25 for each successful referral',
    referrerReward: 25,
    refereeReward: 15,
    minDeposit: 100,
    validUntil: '2024-12-31',
    isActive: true,
    stats: { totalReferrals: 456, successfulReferrals: 234, totalRewardsPaid: 5850 },
    createdAt: '2024-01-01'
  }
];

export function MarketingManager() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(mockCampaigns);
  const [referralPrograms, setReferralPrograms] = React.useState<ReferralProgram[]>(mockReferralPrograms);
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(null);
  const [editingReferralProgram, setEditingReferralProgram] = React.useState<ReferralProgram | null>(null);
  const [isAddingCampaign, setIsAddingCampaign] = React.useState(false);
  const [isAddingReferralProgram, setIsAddingReferralProgram] = React.useState(false);

  const campaignForm = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      type: 'email',
      title: '',
      message: '',
      targetAudience: 'all',
      startDate: '',
      endDate: '',
      budget: 0,
      isActive: true
    }
  });

  const referralForm = useForm<ReferralProgramFormData>({
    resolver: zodResolver(referralProgramSchema),
    defaultValues: {
      name: '',
      description: '',
      referrerReward: 0,
      refereeReward: 0,
      minDeposit: 0,
      validUntil: '',
      isActive: true
    }
  });

  const handleCreateCampaign = async (data: CampaignFormData) => {
    try {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        title: data.title,
        message: data.message,
        targetAudience: data.targetAudience,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        isActive: data.isActive,
        stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        createdAt: new Date().toISOString()
      };

      setCampaigns(prev => [...prev, newCampaign]);
      campaignForm.reset();
      setIsAddingCampaign(false);

      toast({
        title: 'Campaign Created',
        description: `"${data.name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign.',
        variant: 'destructive'
      });
    }
  };

  const handleCreateReferralProgram = async (data: ReferralProgramFormData) => {
    try {
      const newProgram: ReferralProgram = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        referrerReward: data.referrerReward,
        refereeReward: data.refereeReward,
        minDeposit: data.minDeposit,
        validUntil: data.validUntil,
        isActive: data.isActive,
        stats: { totalReferrals: 0, successfulReferrals: 0, totalRewardsPaid: 0 },
        createdAt: new Date().toISOString()
      };

      setReferralPrograms(prev => [...prev, newProgram]);
      referralForm.reset();
      setIsAddingReferralProgram(false);

      toast({
        title: 'Referral Program Created',
        description: `"${data.name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create referral program.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      toast({
        title: 'Campaign Deleted',
        description: 'Campaign has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete campaign.',
        variant: 'destructive'
      });
    }
  };

  const getTypeColor = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return 'text-blue-600 bg-blue-100';
      case 'notification': return 'text-green-600 bg-green-100';
      case 'banner': return 'text-purple-600 bg-purple-100';
      case 'referral': return 'text-orange-600 bg-orange-100';
    }
  };

  const getAudienceColor = (audience: Campaign['targetAudience']) => {
    switch (audience) {
      case 'all': return 'text-gray-600 bg-gray-100';
      case 'new_users': return 'text-green-600 bg-green-100';
      case 'active_traders': return 'text-blue-600 bg-blue-100';
      case 'inactive_users': return 'text-yellow-600 bg-yellow-100';
      case 'high_value': return 'text-purple-600 bg-purple-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Management</h2>
          <p className="text-muted-foreground">Manage campaigns, referral programs, and marketing analytics</p>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="campaigns" className="text-xs sm:text-sm">Campaigns</TabsTrigger>
          <TabsTrigger value="referrals" className="text-xs sm:text-sm">Referrals</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Marketing Campaigns ({campaigns.length})</h3>
            <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Marketing Campaign</DialogTitle>
                  <DialogDescription>Create a new marketing campaign to engage users</DialogDescription>
                </DialogHeader>
                
                <Form {...campaignForm}>
                  <form onSubmit={campaignForm.handleSubmit(handleCreateCampaign)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={campaignForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Campaign name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={campaignForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="notification">Notification</SelectItem>
                                <SelectItem value="banner">Banner</SelectItem>
                                <SelectItem value="referral">Referral</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={campaignForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Campaign title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={campaignForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Campaign message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={campaignForm.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="new_users">New Users</SelectItem>
                                <SelectItem value="active_traders">Active Traders</SelectItem>
                                <SelectItem value="inactive_users">Inactive Users</SelectItem>
                                <SelectItem value="high_value">High Value Users</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={campaignForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={campaignForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={campaignForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingCampaign(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Campaign</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(campaign.type)}>
                          {campaign.type}
                        </Badge>
                        <Badge className={getAudienceColor(campaign.targetAudience)}>
                          {campaign.targetAudience.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCampaign(campaign.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{campaign.title}</h4>
                    <p className="text-sm text-muted-foreground">{campaign.message}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-medium">{campaign.stats.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Opened</p>
                      <p className="font-medium">{campaign.stats.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Clicked</p>
                      <p className="font-medium">{campaign.stats.clicked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Converted</p>
                      <p className="font-medium">{campaign.stats.converted.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Budget: </span>
                      <span className="font-medium">${campaign.budget}</span>
                    </div>
                    <Badge variant={campaign.isActive ? "default" : "secondary"}>
                      {campaign.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Referral Programs ({referralPrograms.length})</h3>
            <Dialog open={isAddingReferralProgram} onOpenChange={setIsAddingReferralProgram}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Referral Program</DialogTitle>
                  <DialogDescription>Set up a new referral program to drive user acquisition</DialogDescription>
                </DialogHeader>
                
                <Form {...referralForm}>
                  <form onSubmit={referralForm.handleSubmit(handleCreateReferralProgram)} className="space-y-4">
                    <FormField
                      control={referralForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Program name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={referralForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Program description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={referralForm.control}
                        name="referrerReward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referrer Reward ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={referralForm.control}
                        name="refereeReward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referee Reward ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={referralForm.control}
                        name="minDeposit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Deposit ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={referralForm.control}
                        name="validUntil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valid Until</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingReferralProgram(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Program</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {referralPrograms.map((program) => (
              <Card key={program.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                    </div>
                    <Badge variant={program.isActive ? "default" : "secondary"}>
                      {program.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Referrer Reward</p>
                      <p className="text-xl font-bold text-green-600">${program.referrerReward}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Referee Reward</p>
                      <p className="text-xl font-bold text-blue-600">${program.refereeReward}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Referrals</p>
                      <p className="font-medium">{program.stats.totalReferrals}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Successful</p>
                      <p className="font-medium">{program.stats.successfulReferrals}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rewards Paid</p>
                      <p className="font-medium">${program.stats.totalRewardsPaid}</p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Minimum deposit: ${program.minDeposit} • Valid until: {new Date(program.validUntil).toLocaleDateString()}
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
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <p className="text-xs text-muted-foreground">
                  {campaigns.filter(c => c.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Messages sent</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaigns.length > 0 
                    ? ((campaigns.reduce((sum, c) => sum + c.stats.converted, 0) / campaigns.reduce((sum, c) => sum + c.stats.sent, 0)) * 100).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Average conversion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Referral Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${referralPrograms.reduce((sum, p) => sum + p.stats.totalRewardsPaid, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total paid out</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Top performing campaigns by conversion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns
                  .map(campaign => ({
                    ...campaign,
                    conversionRate: campaign.stats.sent > 0 ? (campaign.stats.converted / campaign.stats.sent) * 100 : 0
                  }))
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .slice(0, 5)
                  .map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", getTypeColor(campaign.type))}>
                          <Megaphone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{campaign.conversionRate.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">{campaign.stats.converted} conversions</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Settings</CardTitle>
              <CardDescription>Configure global marketing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-marketing">Email Marketing</Label>
                    <p className="text-sm text-muted-foreground">Enable automated email campaigns</p>
                  </div>
                  <Switch id="email-marketing" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications to users</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="referral-tracking">Referral Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track referral conversions</p>
                  </div>
                  <Switch id="referral-tracking" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="default-sender">Default Sender Email</Label>
                  <Input id="default-sender" placeholder="noreply@astralcore.com" />
                </div>
                
                <div>
                  <Label htmlFor="analytics-tracking">Analytics Tracking ID</Label>
                  <Input id="analytics-tracking" placeholder="GA-XXXXXXXXX" />
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
