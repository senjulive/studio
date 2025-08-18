'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Users, 
  DollarSign, 
  Activity,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  UserCheck,
  UserX,
  Wallet,
  Bot,
  MessageSquare,
  Bell,
  Database,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react';

const mockUsers = [
  {
    id: '1',
    username: 'trader_pro',
    email: 'trader@example.com',
    status: 'active',
    rank: 'Gold',
    tier: 'VIP',
    balance: 15420.50,
    lastLogin: '2024-01-15T10:30:00Z',
    verified: true
  },
  {
    id: '2',
    username: 'crypto_king',
    email: 'king@example.com',
    status: 'suspended',
    rank: 'Platinum',
    tier: 'Premium',
    balance: 8750.25,
    lastLogin: '2024-01-14T15:45:00Z',
    verified: true
  },
  {
    id: '3',
    username: 'newbie_trader',
    email: 'newbie@example.com',
    status: 'pending',
    rank: 'Bronze',
    tier: 'Basic',
    balance: 250.00,
    lastLogin: '2024-01-15T09:15:00Z',
    verified: false
  }
];

const mockTransactions = [
  {
    id: '1',
    user: 'trader_pro',
    type: 'deposit',
    amount: 500,
    asset: 'USDT',
    status: 'completed',
    timestamp: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    user: 'crypto_king',
    type: 'withdrawal',
    amount: 1200,
    asset: 'BTC',
    status: 'pending',
    timestamp: '2024-01-15T10:45:00Z'
  },
  {
    id: '3',
    user: 'newbie_trader',
    type: 'deposit',
    amount: 100,
    asset: 'ETH',
    status: 'failed',
    timestamp: '2024-01-15T09:30:00Z'
  }
];

const systemStats = {
  totalUsers: 12547,
  activeUsers: 8934,
  totalVolume: 2547890.50,
  todayVolume: 45780.25,
  totalProfit: 156890.75,
  activeTraders: 3456,
  pendingWithdrawals: 45,
  pendingDeposits: 23
};

export function AdminDashboardMobile() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId: string, action: string) => {
    toast({
      title: `User ${action}`,
      description: `User action "${action}" has been executed.`,
    });
  };

  const handleTransactionAction = (transactionId: string, action: string) => {
    toast({
      title: `Transaction ${action}`,
      description: `Transaction has been ${action}.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Admin Header */}
      <div className="mobile-card">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 mx-auto mb-4 flex items-center justify-center electric-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System monitoring and user management</p>
        </div>
      </div>

      {/* System Overview */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">System Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Users className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="font-bold text-blue-400">{systemStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <Activity className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-xs text-muted-foreground">Active Users</p>
              <p className="font-bold text-green-400">{systemStats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <DollarSign className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-xs text-muted-foreground">Total Volume</p>
              <p className="font-bold text-yellow-400">${systemStats.totalVolume.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
              <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xs text-muted-foreground">Today Volume</p>
              <p className="font-bold text-purple-400">${systemStats.todayVolume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs">Transactions</TabsTrigger>
          <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4 mt-4">
          {/* Search and Filters */}
          <div className="mobile-card">
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="mobile-card">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{user.username}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.verified && (
                        <Badge variant="outline" className="text-green-400 border-green-400/50 text-xs">
                          Verified
                        </Badge>
                      )}
                      <Badge 
                        variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="font-semibold">${user.balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rank/Tier</p>
                      <p className="font-semibold">{user.rank} / {user.tier}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleUserAction(user.id, 'suspend')}
                    >
                      <UserX className="w-3 h-3 mr-1" />
                      Suspend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleUserAction(user.id, 'verify')}
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Management */}
        <TabsContent value="transactions" className="space-y-4 mt-4">
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="mobile-card">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{transaction.user}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {transaction.type} • {transaction.amount} {transaction.asset}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' : 
                        transaction.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                      className={cn(
                        "text-xs",
                        transaction.status === 'completed' && "bg-green-500/20 text-green-400"
                      )}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>

                  {transaction.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs text-green-400 border-green-400/50"
                        onClick={() => handleTransactionAction(transaction.id, 'approved')}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs text-red-400 border-red-400/50"
                        onClick={() => handleTransactionAction(transaction.id, 'rejected')}
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* System Monitoring */}
        <TabsContent value="system" className="space-y-4 mt-4">
          {/* System Health */}
          <div className="mobile-card">
            <div className="p-6">
              <h3 className="font-bold text-lg mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Database</span>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/50">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Trading Bots</span>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/50">
                    {systemStats.activeTraders} Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-sm">API Services</span>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/50">
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="mobile-card">
            <div className="p-6">
              <h3 className="font-bold text-lg mb-4">Pending Actions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
                  <div>
                    <p className="font-semibold">Pending Withdrawals</p>
                    <p className="text-sm text-muted-foreground">{systemStats.pendingWithdrawals} requests</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <div>
                    <p className="font-semibold">Pending Deposits</p>
                    <p className="text-sm text-muted-foreground">{systemStats.pendingDeposits} confirmations</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          {/* Global Settings */}
          <div className="mobile-card">
            <div className="p-6">
              <h3 className="font-bold text-lg mb-4">Global Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable trading temporarily</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Approvals</p>
                    <p className="text-sm text-muted-foreground">Auto-approve small deposits</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Registrations</p>
                    <p className="text-sm text-muted-foreground">Allow new user signups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          {/* Trading Limits */}
          <div className="mobile-card">
            <div className="p-6">
              <h3 className="font-bold text-lg mb-4">Trading Limits</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minDeposit">Minimum Deposit (USDT)</Label>
                  <Input id="minDeposit" type="number" defaultValue="10" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="maxWithdraw">Maximum Withdrawal (USDT)</Label>
                  <Input id="maxWithdraw" type="number" defaultValue="50000" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="tradingFee">Trading Fee (%)</Label>
                  <Input id="tradingFee" type="number" step="0.01" defaultValue="0.1" className="mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="mobile-card">
            <div className="p-6">
              <h3 className="font-bold text-lg mb-4">System Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export User Data
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Market Data
                </Button>
                <Button variant="outline" className="w-full text-orange-400 border-orange-400/50">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Send System Alert
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mobile-card w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">User Details</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant="outline" className="mt-1">
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <Label>Balance</Label>
                  <p className="font-medium">${selectedUser.balance.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p className="font-medium">
                    {new Date(selectedUser.lastLogin).toLocaleString()}
                  </p>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    View Transaction History
                  </Button>
                  <Button variant="outline" className="w-full">
                    Send Message
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Suspend Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
