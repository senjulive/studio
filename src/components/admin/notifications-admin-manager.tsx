'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Bell,
  Send,
  Users,
  UserCheck,
  Globe,
  Smartphone,
  Mail,
  MessageCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

interface NotificationCampaign {
  id: string;
  name: string;
  title: string;
  content: string;
  targetAudience: string;
  channels: string[];
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  recipients: number;
  opened: number;
  clicked: number;
  createdAt: string;
}

interface NotificationStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  engagementRate: number;
  deliveryRate: number;
}

export function NotificationsAdminManager() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [isCreating, setIsCreating] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedNotification, setSelectedNotification] = React.useState<string | null>(null);

  // Mock data
  const [templates, setTemplates] = React.useState<NotificationTemplate[]>([
    {
      id: 'template-1',
      title: 'Welcome to AstralCore',
      content: 'Welcome to the future of cryptocurrency trading! Get started with your AI-powered journey.',
      type: 'info',
      category: 'Onboarding',
      isActive: true,
      createdAt: '2024-12-01T10:00:00Z',
      lastUsed: '2024-12-30T15:30:00Z',
      usageCount: 1250
    },
    {
      id: 'template-2',
      title: 'Deposit Confirmed',
      content: 'Your deposit of ${amount} ${currency} has been confirmed and added to your wallet.',
      type: 'success',
      category: 'Transactions',
      isActive: true,
      createdAt: '2024-11-15T09:00:00Z',
      lastUsed: '2024-12-31T12:00:00Z',
      usageCount: 2847
    },
    {
      id: 'template-3',
      title: 'Security Alert',
      content: 'We detected a login attempt from an unrecognized device. If this wasn\'t you, please secure your account.',
      type: 'warning',
      category: 'Security',
      isActive: true,
      createdAt: '2024-11-01T08:00:00Z',
      lastUsed: '2024-12-29T18:45:00Z',
      usageCount: 156
    }
  ]);

  const [campaigns, setCampaigns] = React.useState<NotificationCampaign[]>([
    {
      id: 'campaign-1',
      name: 'New Year Promotion',
      title: '🎉 New Year Special - 25% Trading Bonus!',
      content: 'Start 2024 with extra rewards! Get 25% bonus on all deposits this week.',
      targetAudience: 'All Active Users',
      channels: ['push', 'email', 'in-app'],
      scheduledAt: '2024-01-01T00:00:00Z',
      status: 'scheduled',
      recipients: 12456,
      opened: 0,
      clicked: 0,
      createdAt: '2024-12-20T14:00:00Z'
    },
    {
      id: 'campaign-2',
      name: 'VIP Tier Upgrade',
      title: 'You\'re Eligible for VIP Core II!',
      content: 'Congratulations! Your trading performance qualifies you for an upgrade to VIP Core II.',
      targetAudience: 'VIP Core I Users',
      channels: ['in-app', 'email'],
      status: 'sent',
      recipients: 234,
      opened: 189,
      clicked: 142,
      createdAt: '2024-12-25T10:00:00Z'
    }
  ]);

  const [stats] = React.useState<NotificationStats>({
    totalSent: 458723,
    delivered: 445891,
    opened: 312456,
    clicked: 89234,
    bounced: 12832,
    unsubscribed: 1456,
    engagementRate: 70.1,
    deliveryRate: 97.2
  });

  const handleCreateTemplate = () => {
    toast({
      title: "Template Created",
      description: "New notification template has been created successfully.",
    });
    setIsCreating(false);
  };

  const handleSendCampaign = (campaignId: string) => {
    toast({
      title: "Campaign Sent",
      description: "Notification campaign has been sent to all recipients.",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'scheduled': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'draft': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <Bell className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Notifications Manager
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                Manage notifications, templates, and campaigns
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Sent', value: stats.totalSent.toLocaleString(), icon: Send, color: 'from-blue-500 to-cyan-500' },
              { label: 'Delivered', value: stats.delivered.toLocaleString(), icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
              { label: 'Opened', value: stats.opened.toLocaleString(), icon: Eye, color: 'from-purple-500 to-pink-500' },
              { label: 'Clicked', value: stats.clicked.toLocaleString(), icon: TrendingUp, color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-xl bg-gradient-to-r",
                    stat.color
                  )}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white/10">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-xl data-[state=active]:bg-white/10">
              <MessageCircle className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-xl data-[state=active]:bg-white/10">
              <Send className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-white/10">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Campaigns */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Recent Campaigns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{campaign.name}</h4>
                        <p className="text-slate-400 text-sm">{campaign.recipients.toLocaleString()} recipients</p>
                      </div>
                      <Badge className={cn("border", getStatusColor(campaign.status))}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Templates */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Top Templates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {templates.slice(0, 3).map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{template.title}</h4>
                        <p className="text-slate-400 text-sm">Used {template.usageCount} times</p>
                      </div>
                      <Badge className={cn("border", getTypeColor(template.type))}>
                        {template.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{stats.deliveryRate}%</div>
                    <div className="text-slate-400 text-sm">Delivery Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{stats.engagementRate}%</div>
                    <div className="text-slate-400 text-sm">Engagement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{((stats.opened / stats.totalSent) * 100).toFixed(1)}%</div>
                    <div className="text-slate-400 text-sm">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{((stats.clicked / stats.opened) * 100).toFixed(1)}%</div>
                    <div className="text-slate-400 text-sm">Click Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Templates Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => setSelectedNotification(template.id)}
                >
                  <div className="flex items-start justify-between">
                    <Badge className={cn("border", getTypeColor(template.type))}>
                      {template.type}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-2">{template.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{template.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{template.category}</span>
                    <span>Used {template.usageCount} times</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        template.isActive ? "bg-green-500" : "bg-red-500"
                      )} />
                      <span className="text-xs text-slate-400">
                        {template.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Preview
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Campaigns Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40 bg-white/5 border-white/10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{campaign.name}</h3>
                        <Badge className={cn("border", getStatusColor(campaign.status))}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-2">{campaign.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>👥 {campaign.recipients.toLocaleString()} recipients</span>
                        <span>📱 {campaign.channels.join(', ')}</span>
                        {campaign.scheduledAt && (
                          <span>⏰ {new Date(campaign.scheduledAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {campaign.status === 'sent' && (
                        <div className="grid grid-cols-3 gap-4 text-center mr-4">
                          <div>
                            <div className="text-sm font-bold text-blue-400">{campaign.opened}</div>
                            <div className="text-xs text-slate-400">Opened</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-green-400">{campaign.clicked}</div>
                            <div className="text-xs text-slate-400">Clicked</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-purple-400">
                              {((campaign.clicked / campaign.opened) * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-400">CTR</div>
                          </div>
                        </div>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500"
                          onClick={() => handleSendCampaign(campaign.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Trends */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Engagement Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    📈 Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              {/* Channel Performance */}
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Channel Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Push Notifications', rate: 92, color: 'bg-blue-500' },
                    { name: 'Email', rate: 78, color: 'bg-green-500' },
                    { name: 'In-App', rate: 85, color: 'bg-purple-500' },
                    { name: 'SMS', rate: 65, color: 'bg-orange-500' }
                  ].map((channel) => (
                    <div key={channel.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{channel.name}</span>
                        <span className="text-slate-400">{channel.rate}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full", channel.color)}
                          style={{ width: `${channel.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Template Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Create New Template</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Template Title</Label>
                  <Input placeholder="Enter title..." className="bg-white/5 border-white/10" />
                </div>
                <div>
                  <Label className="text-white">Type</Label>
                  <Select>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Content</Label>
                  <Textarea
                    placeholder="Enter notification content..."
                    className="bg-white/5 border-white/10"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleCreateTemplate}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    Create Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
