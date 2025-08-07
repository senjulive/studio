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
  ArrowDownCircle,
  Check,
  X,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  Shield,
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  Users,
  Globe,
  Smartphone,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Settings,
  Bell,
  Hash
} from 'lucide-react';

interface DepositRecord {
  id: string;
  userId: string;
  username: string;
  email: string;
  amount: number;
  currency: string;
  network: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'processing';
  transactionHash: string;
  address: string;
  confirmations: number;
  requiredConfirmations: number;
  submittedAt: string;
  confirmedAt?: string;
  notes?: string;
  adminNotes?: string;
  riskScore: number;
  isFirstDeposit: boolean;
}

interface DepositStats {
  totalDeposits: number;
  pendingDeposits: number;
  confirmedToday: number;
  totalVolume: number;
  averageAmount: number;
  rejectedToday: number;
  processingTime: number;
}

interface DepositSettings {
  autoApproval: boolean;
  maxAutoApprovalAmount: number;
  requiredConfirmations: { [key: string]: number };
  minimumAmounts: { [key: string]: number };
  processingFees: { [key: string]: number };
  riskThreshold: number;
}

export function DepositsAdminManager() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = React.useState('pending');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedDeposit, setSelectedDeposit] = React.useState<DepositRecord | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);

  // Mock data
  const [deposits, setDeposits] = React.useState<DepositRecord[]>([
    {
      id: 'dep-001',
      userId: 'user-123',
      username: 'crypto_trader',
      email: 'user@example.com',
      amount: 500,
      currency: 'USDT',
      network: 'TRC20',
      status: 'pending',
      transactionHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      address: 'TXY7s8K9mNpQ2rStUvWxYz123456789',
      confirmations: 15,
      requiredConfirmations: 20,
      submittedAt: '2024-12-31T10:30:00Z',
      riskScore: 2,
      isFirstDeposit: false
    },
    {
      id: 'dep-002',
      userId: 'user-456',
      username: 'new_investor',
      email: 'investor@example.com',
      amount: 1000,
      currency: 'USDT',
      network: 'ERC20',
      status: 'processing',
      transactionHash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      confirmations: 25,
      requiredConfirmations: 12,
      submittedAt: '2024-12-31T09:15:00Z',
      riskScore: 8,
      isFirstDeposit: true
    },
    {
      id: 'dep-003',
      userId: 'user-789',
      username: 'whale_trader',
      email: 'whale@example.com',
      amount: 10000,
      currency: 'BTC',
      network: 'Bitcoin',
      status: 'confirmed',
      transactionHash: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      confirmations: 6,
      requiredConfirmations: 6,
      submittedAt: '2024-12-31T08:00:00Z',
      confirmedAt: '2024-12-31T08:45:00Z',
      riskScore: 1,
      isFirstDeposit: false
    }
  ]);

  const [stats] = React.useState<DepositStats>({
    totalDeposits: 15847,
    pendingDeposits: 23,
    confirmedToday: 156,
    totalVolume: 2456789.50,
    averageAmount: 547.32,
    rejectedToday: 3,
    processingTime: 12.5
  });

  const [settings, setSettings] = React.useState<DepositSettings>({
    autoApproval: true,
    maxAutoApprovalAmount: 1000,
    requiredConfirmations: {
      'USDT-TRC20': 20,
      'USDT-ERC20': 12,
      'BTC': 6,
      'ETH': 12
    },
    minimumAmounts: {
      'USDT': 10,
      'BTC': 0.001,
      'ETH': 0.01
    },
    processingFees: {
      'USDT-TRC20': 1,
      'USDT-ERC20': 5,
      'BTC': 0.0001,
      'ETH': 0.001
    },
    riskThreshold: 5
  });

  const handleApproveDeposit = (depositId: string) => {
    setDeposits(prev => prev.map(dep => 
      dep.id === depositId 
        ? { ...dep, status: 'confirmed', confirmedAt: new Date().toISOString() }
        : dep
    ));
    toast({
      title: "Deposit Approved",
      description: "Deposit has been approved and credited to user account.",
    });
  };

  const handleRejectDeposit = (depositId: string, reason: string) => {
    setDeposits(prev => prev.map(dep => 
      dep.id === depositId 
        ? { ...dep, status: 'rejected', adminNotes: reason }
        : dep
    ));
    toast({
      title: "Deposit Rejected",
      description: "Deposit has been rejected and user has been notified.",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (score <= 6) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 3) return 'Low';
    if (score <= 6) return 'Medium';
    return 'High';
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deposit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deposit.transactionHash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || deposit.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <ArrowDownCircle className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Deposits Manager
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                Manage user deposits and approval workflow
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Deposits', value: stats.totalDeposits.toLocaleString(), icon: ArrowDownCircle, color: 'from-blue-500 to-cyan-500' },
              { label: 'Pending', value: stats.pendingDeposits.toString(), icon: Clock, color: 'from-yellow-500 to-orange-500' },
              { label: 'Confirmed Today', value: stats.confirmedToday.toString(), icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
              { label: 'Total Volume', value: `$${stats.totalVolume.toLocaleString()}`, icon: DollarSign, color: 'from-purple-500 to-pink-500' }
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

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search deposits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="border-white/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-white/10">
              <Clock className="h-4 w-4 mr-2" />
              Pending ({deposits.filter(d => d.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="rounded-xl data-[state=active]:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Processing ({deposits.filter(d => d.status === 'processing').length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="rounded-xl data-[state=active]:bg-white/10">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-white/10">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Deposits List */}
          <TabsContent value={selectedTab} className="space-y-4">
            {filteredDeposits
              .filter(deposit => selectedTab === 'analytics' || deposit.status === selectedTab || selectedTab === 'confirmed')
              .map((deposit) => (
              <motion.div
                key={deposit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center space-x-3">
                      <Badge className={cn("border", getStatusColor(deposit.status))}>
                        {deposit.status}
                      </Badge>
                      <Badge className={cn("border", getRiskColor(deposit.riskScore))}>
                        Risk: {getRiskLabel(deposit.riskScore)}
                      </Badge>
                      {deposit.isFirstDeposit && (
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 border">
                          First Deposit
                        </Badge>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-white font-medium">{deposit.username}</span>
                        <span className="text-slate-400 text-sm">({deposit.email})</span>
                      </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-white font-medium">
                          {deposit.amount} {deposit.currency}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-400">Network:</span>
                        <span className="text-white">{deposit.network}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-yellow-400" />
                        <span className="text-slate-400">Confirmations:</span>
                        <span className="text-white">
                          {deposit.confirmations}/{deposit.requiredConfirmations}
                        </span>
                      </div>
                    </div>

                    {/* Transaction Hash */}
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl">
                      <Hash className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">TX:</span>
                      <code className="text-white text-sm font-mono flex-1 truncate">
                        {deposit.transactionHash}
                      </code>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Submitted: {new Date(deposit.submittedAt).toLocaleString()}</span>
                      </div>
                      {deposit.confirmedAt && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Confirmed: {new Date(deposit.confirmedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Admin Notes */}
                    {deposit.adminNotes && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-red-400 text-sm">{deposit.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDeposit(deposit)}
                      className="border-white/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {deposit.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveDeposit(deposit.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectDeposit(deposit.id, 'Manual review required')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {deposit.status === 'processing' && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check Status
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Analytics Tab Content */}
            {selectedTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Deposit Trends</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-slate-400">
                      📈 Chart visualization would go here
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-md border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <PieChart className="h-5 w-5" />
                      <span>Currency Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { currency: 'USDT', percentage: 65, amount: '$1,598,234' },
                      { currency: 'BTC', percentage: 25, amount: '$615,467' },
                      { currency: 'ETH', percentage: 10, amount: '$243,088' }
                    ].map((item) => (
                      <div key={item.currency} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">{item.currency}</span>
                          <span className="text-slate-400">{item.percentage}% ({item.amount})</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Deposit Details Modal */}
      <AnimatePresence>
        {selectedDeposit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDeposit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">Deposit Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDeposit(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Status and Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn("border", getStatusColor(selectedDeposit.status))}>
                    {selectedDeposit.status}
                  </Badge>
                  <Badge className={cn("border", getRiskColor(selectedDeposit.riskScore))}>
                    Risk Score: {selectedDeposit.riskScore}/10
                  </Badge>
                  {selectedDeposit.isFirstDeposit && (
                    <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 border">
                      First Deposit
                    </Badge>
                  )}
                </div>

                {/* User Information */}
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-semibold">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Username:</span>
                      <span className="text-white ml-2">{selectedDeposit.username}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white ml-2">{selectedDeposit.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">User ID:</span>
                      <span className="text-white ml-2">{selectedDeposit.userId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">First Deposit:</span>
                      <span className="text-white ml-2">{selectedDeposit.isFirstDeposit ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-semibold">Transaction Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-white ml-2 font-medium">
                          {selectedDeposit.amount} {selectedDeposit.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Network:</span>
                        <span className="text-white ml-2">{selectedDeposit.network}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Confirmations:</span>
                        <span className="text-white ml-2">
                          {selectedDeposit.confirmations}/{selectedDeposit.requiredConfirmations}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Address:</span>
                        <code className="text-white ml-2 text-xs">{selectedDeposit.address}</code>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-slate-400">Transaction Hash:</span>
                      <div className="mt-1 flex items-center space-x-2 bg-white/5 p-2 rounded">
                        <code className="text-white text-xs flex-1">{selectedDeposit.transactionHash}</code>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <h3 className="text-white font-semibold">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-slate-400">Submitted:</span>
                      <span className="text-white">{new Date(selectedDeposit.submittedAt).toLocaleString()}</span>
                    </div>
                    {selectedDeposit.confirmedAt && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-slate-400">Confirmed:</span>
                        <span className="text-white">{new Date(selectedDeposit.confirmedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedDeposit.status === 'pending' && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        handleApproveDeposit(selectedDeposit.id);
                        setSelectedDeposit(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Deposit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleRejectDeposit(selectedDeposit.id, 'Manual review required');
                        setSelectedDeposit(null);
                      }}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Deposit
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">Deposit Settings</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-semibold">Auto Approval</h3>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-400">Enable automatic approval</Label>
                    <Switch 
                      checked={settings.autoApproval} 
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproval: checked }))}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400">Max auto approval amount</Label>
                    <Input
                      type="number"
                      value={settings.maxAutoApprovalAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxAutoApprovalAmount: Number(e.target.value) }))}
                      className="bg-white/5 border-white/10 mt-1"
                    />
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-semibold">Risk Management</h3>
                  <div>
                    <Label className="text-slate-400">Risk threshold (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.riskThreshold}
                      onChange={(e) => setSettings(prev => ({ ...prev, riskThreshold: Number(e.target.value) }))}
                      className="bg-white/5 border-white/10 mt-1"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Deposit settings have been updated successfully.",
                      });
                      setShowSettings(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    Save Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(false)}
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
