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
  ArrowUpCircle,
  Check,
  X,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  Shield,
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
  Send,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Settings,
  Bell,
  Hash,
  Ban,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Lock,
  Unlock
} from 'lucide-react';

interface WithdrawalRecord {
  id: string;
  userId: string;
  username: string;
  email: string;
  amount: number;
  currency: string;
  network: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  toAddress: string;
  transactionHash?: string;
  fee: number;
  netAmount: number;
  submittedAt: string;
  approvedAt?: string;
  processedAt?: string;
  completedAt?: string;
  adminNotes?: string;
  riskScore: number;
  requiresKyc: boolean;
  kycStatus: 'verified' | 'pending' | 'rejected';
  dailyLimit: number;
  monthlyLimit: number;
  usedDaily: number;
  usedMonthly: number;
}

interface WithdrawalStats {
  totalWithdrawals: number;
  pendingWithdrawals: number;
  processedToday: number;
  totalVolume: number;
  averageAmount: number;
  rejectedToday: number;
  processingTime: number;
  dailyVolume: number;
}

interface WithdrawalSettings {
  autoProcessing: boolean;
  maxAutoProcessAmount: number;
  dailyLimits: { [key: string]: number };
  monthlyLimits: { [key: string]: number };
  processingFees: { [key: string]: number };
  minimumAmounts: { [key: string]: number };
  requireKycAbove: number;
  riskThreshold: number;
  businessHoursOnly: boolean;
}

export function WithdrawalsAdminManager() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = React.useState('pending');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = React.useState<WithdrawalRecord | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showProcessModal, setShowProcessModal] = React.useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = React.useState<WithdrawalRecord | null>(null);

  // Mock data
  const [withdrawals, setWithdrawals] = React.useState<WithdrawalRecord[]>([
    {
      id: 'wth-001',
      userId: 'user-123',
      username: 'crypto_trader',
      email: 'user@example.com',
      amount: 250,
      currency: 'USDT',
      network: 'TRC20',
      status: 'pending',
      toAddress: 'TXY7s8K9mNpQ2rStUvWxYz123456789',
      fee: 1,
      netAmount: 249,
      submittedAt: '2024-12-31T10:30:00Z',
      riskScore: 3,
      requiresKyc: false,
      kycStatus: 'verified',
      dailyLimit: 5000,
      monthlyLimit: 50000,
      usedDaily: 250,
      usedMonthly: 1250
    },
    {
      id: 'wth-002',
      userId: 'user-456',
      username: 'whale_investor',
      email: 'whale@example.com',
      amount: 10000,
      currency: 'USDT',
      network: 'ERC20',
      status: 'approved',
      toAddress: '0x1234567890abcdef1234567890abcdef12345678',
      fee: 5,
      netAmount: 9995,
      submittedAt: '2024-12-31T09:15:00Z',
      approvedAt: '2024-12-31T09:30:00Z',
      riskScore: 8,
      requiresKyc: true,
      kycStatus: 'verified',
      dailyLimit: 50000,
      monthlyLimit: 500000,
      usedDaily: 10000,
      usedMonthly: 25000
    },
    {
      id: 'wth-003',
      userId: 'user-789',
      username: 'day_trader',
      email: 'trader@example.com',
      amount: 1500,
      currency: 'BTC',
      network: 'Bitcoin',
      status: 'completed',
      toAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      transactionHash: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      fee: 0.0001,
      netAmount: 1499.9999,
      submittedAt: '2024-12-31T08:00:00Z',
      approvedAt: '2024-12-31T08:15:00Z',
      processedAt: '2024-12-31T08:30:00Z',
      completedAt: '2024-12-31T08:45:00Z',
      riskScore: 2,
      requiresKyc: false,
      kycStatus: 'verified',
      dailyLimit: 10000,
      monthlyLimit: 100000,
      usedDaily: 1500,
      usedMonthly: 8500
    }
  ]);

  const [stats] = React.useState<WithdrawalStats>({
    totalWithdrawals: 8934,
    pendingWithdrawals: 15,
    processedToday: 89,
    totalVolume: 1856234.50,
    averageAmount: 348.67,
    rejectedToday: 2,
    processingTime: 18.5,
    dailyVolume: 156789.25
  });

  const [settings, setSettings] = React.useState<WithdrawalSettings>({
    autoProcessing: false,
    maxAutoProcessAmount: 500,
    dailyLimits: {
      'basic': 1000,
      'verified': 5000,
      'vip': 50000
    },
    monthlyLimits: {
      'basic': 10000,
      'verified': 50000,
      'vip': 500000
    },
    processingFees: {
      'USDT-TRC20': 1,
      'USDT-ERC20': 5,
      'BTC': 0.0001,
      'ETH': 0.001
    },
    minimumAmounts: {
      'USDT': 10,
      'BTC': 0.001,
      'ETH': 0.01
    },
    requireKycAbove: 1000,
    riskThreshold: 6,
    businessHoursOnly: false
  });

  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals(prev => prev.map(wth => 
      wth.id === withdrawalId 
        ? { ...wth, status: 'approved', approvedAt: new Date().toISOString() }
        : wth
    ));
    toast({
      title: "Withdrawal Approved",
      description: "Withdrawal has been approved and queued for processing.",
    });
  };

  const handleRejectWithdrawal = (withdrawalId: string, reason: string) => {
    setWithdrawals(prev => prev.map(wth => 
      wth.id === withdrawalId 
        ? { ...wth, status: 'rejected', adminNotes: reason }
        : wth
    ));
    toast({
      title: "Withdrawal Rejected",
      description: "Withdrawal has been rejected and user has been notified.",
      variant: "destructive"
    });
  };

  const handleProcessWithdrawal = (withdrawalId: string, transactionHash: string) => {
    setWithdrawals(prev => prev.map(wth => 
      wth.id === withdrawalId 
        ? { 
            ...wth, 
            status: 'completed', 
            transactionHash,
            processedAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          }
        : wth
    ));
    toast({
      title: "Withdrawal Processed",
      description: "Withdrawal has been processed and transaction hash recorded.",
    });
    setShowProcessModal(false);
    setProcessingWithdrawal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'processing': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'cancelled': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
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

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         withdrawal.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         withdrawal.toAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || withdrawal.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <ArrowUpCircle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Withdrawals Manager
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                Manage user withdrawals and payment processing
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Withdrawals', value: stats.totalWithdrawals.toLocaleString(), icon: ArrowUpCircle, color: 'from-red-500 to-orange-500' },
              { label: 'Pending', value: stats.pendingWithdrawals.toString(), icon: Clock, color: 'from-yellow-500 to-amber-500' },
              { label: 'Processed Today', value: stats.processedToday.toString(), icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
              { label: 'Daily Volume', value: `$${stats.dailyVolume.toLocaleString()}`, icon: DollarSign, color: 'from-purple-500 to-pink-500' }
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
                placeholder="Search withdrawals..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
            <Button className="bg-gradient-to-r from-red-500 to-orange-500">
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
              Pending ({withdrawals.filter(w => w.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-xl data-[state=active]:bg-white/10">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved ({withdrawals.filter(w => w.status === 'approved').length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-white/10">
              <Check className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-white/10">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Withdrawals List */}
          <TabsContent value={selectedTab} className="space-y-4">
            {filteredWithdrawals
              .filter(withdrawal => selectedTab === 'analytics' || withdrawal.status === selectedTab || selectedTab === 'completed')
              .map((withdrawal) => (
              <motion.div
                key={withdrawal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <Badge className={cn("border", getStatusColor(withdrawal.status))}>
                        {withdrawal.status}
                      </Badge>
                      <Badge className={cn("border", getRiskColor(withdrawal.riskScore))}>
                        Risk: {getRiskLabel(withdrawal.riskScore)}
                      </Badge>
                      <Badge className={cn("border", getKycStatusColor(withdrawal.kycStatus))}>
                        KYC: {withdrawal.kycStatus}
                      </Badge>
                      {withdrawal.requiresKyc && (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 border">
                          KYC Required
                        </Badge>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-white font-medium">{withdrawal.username}</span>
                        <span className="text-slate-400 text-sm">({withdrawal.email})</span>
                      </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-red-400" />
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-white font-medium">
                          {withdrawal.amount} {withdrawal.currency}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-400">Net:</span>
                        <span className="text-white">
                          {withdrawal.netAmount} {withdrawal.currency}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-green-400" />
                        <span className="text-slate-400">Network:</span>
                        <span className="text-white">{withdrawal.network}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-400" />
                        <span className="text-slate-400">Fee:</span>
                        <span className="text-white">{withdrawal.fee} {withdrawal.currency}</span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl">
                      <Wallet className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">To:</span>
                      <code className="text-white text-sm font-mono flex-1 truncate">
                        {withdrawal.toAddress}
                      </code>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Transaction Hash */}
                    {withdrawal.transactionHash && (
                      <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl">
                        <Hash className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">TX:</span>
                        <code className="text-white text-sm font-mono flex-1 truncate">
                          {withdrawal.transactionHash}
                        </code>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Limits Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white/5 p-3 rounded-xl">
                        <p className="text-slate-400 mb-1">Daily Usage</p>
                        <div className="flex justify-between items-center">
                          <span className="text-white">
                            ${withdrawal.usedDaily.toLocaleString()} / ${withdrawal.dailyLimit.toLocaleString()}
                          </span>
                          <span className="text-slate-400">
                            {Math.round((withdrawal.usedDaily / withdrawal.dailyLimit) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                          <div
                            className="h-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                            style={{ width: `${Math.min((withdrawal.usedDaily / withdrawal.dailyLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl">
                        <p className="text-slate-400 mb-1">Monthly Usage</p>
                        <div className="flex justify-between items-center">
                          <span className="text-white">
                            ${withdrawal.usedMonthly.toLocaleString()} / ${withdrawal.monthlyLimit.toLocaleString()}
                          </span>
                          <span className="text-slate-400">
                            {Math.round((withdrawal.usedMonthly / withdrawal.monthlyLimit) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                          <div
                            className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${Math.min((withdrawal.usedMonthly / withdrawal.monthlyLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center space-x-4 text-xs text-slate-400 flex-wrap gap-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Submitted: {new Date(withdrawal.submittedAt).toLocaleString()}</span>
                      </div>
                      {withdrawal.approvedAt && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Approved: {new Date(withdrawal.approvedAt).toLocaleString()}</span>
                        </div>
                      )}
                      {withdrawal.completedAt && (
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>Completed: {new Date(withdrawal.completedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Admin Notes */}
                    {withdrawal.adminNotes && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-red-400 text-sm">{withdrawal.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWithdrawal(withdrawal)}
                      className="border-white/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {withdrawal.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveWithdrawal(withdrawal.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectWithdrawal(withdrawal.id, 'Manual review required')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {withdrawal.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setProcessingWithdrawal(withdrawal);
                          setShowProcessModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Process
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
                      <span>Withdrawal Trends</span>
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
                      <span>Status Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { status: 'Completed', percentage: 85, color: 'bg-green-500' },
                      { status: 'Pending', percentage: 8, color: 'bg-yellow-500' },
                      { status: 'Processing', percentage: 5, color: 'bg-blue-500' },
                      { status: 'Rejected', percentage: 2, color: 'bg-red-500' }
                    ].map((item) => (
                      <div key={item.status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">{item.status}</span>
                          <span className="text-slate-400">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={cn("h-2 rounded-full", item.color)}
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

      {/* Process Withdrawal Modal */}
      <AnimatePresence>
        {showProcessModal && processingWithdrawal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProcessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Process Withdrawal</h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Processing withdrawal for:</p>
                  <p className="text-white font-medium">{processingWithdrawal.username}</p>
                  <p className="text-white text-lg">
                    {processingWithdrawal.netAmount} {processingWithdrawal.currency}
                  </p>
                </div>
                
                <div>
                  <Label className="text-white">Transaction Hash</Label>
                  <Input
                    placeholder="Enter transaction hash..."
                    className="bg-white/5 border-white/10 mt-1"
                    id="txHash"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      const txHash = (document.getElementById('txHash') as HTMLInputElement)?.value;
                      if (txHash) {
                        handleProcessWithdrawal(processingWithdrawal.id, txHash);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    Complete Processing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowProcessModal(false)}
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

      {/* Settings Modal (similar to deposits) */}
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
                <h2 className="text-xl font-bold text-white">Withdrawal Settings</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-semibold">Auto Processing</h3>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-400">Enable automatic processing</Label>
                    <Switch 
                      checked={settings.autoProcessing} 
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoProcessing: checked }))}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400">Max auto process amount</Label>
                    <Input
                      type="number"
                      value={settings.maxAutoProcessAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxAutoProcessAmount: Number(e.target.value) }))}
                      className="bg-white/5 border-white/10 mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-400">Business hours only</Label>
                    <Switch 
                      checked={settings.businessHoursOnly} 
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, businessHoursOnly: checked }))}
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
                  <div>
                    <Label className="text-slate-400">Require KYC above amount</Label>
                    <Input
                      type="number"
                      value={settings.requireKycAbove}
                      onChange={(e) => setSettings(prev => ({ ...prev, requireKycAbove: Number(e.target.value) }))}
                      className="bg-white/5 border-white/10 mt-1"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Settings Saved",
                        description: "Withdrawal settings have been updated successfully.",
                      });
                      setShowSettings(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500"
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
