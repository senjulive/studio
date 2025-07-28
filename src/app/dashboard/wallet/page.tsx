'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Send,
  Download,
  Copy,
  ExternalLink,
  PieChart,
  BarChart3,
  History,
  Settings,
  Shield,
  Info,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

// Import crypto logos
import { BtcLogo } from '@/components/icons/btc-logo';
import { EthLogo } from '@/components/icons/eth-logo';
import { UsdtLogo } from '@/components/icons/usdt-logo';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Virtual Wallet - AstralCore",
  description: "Manage your virtual cryptocurrency wallet and assets.",
};

interface WalletAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  price: number;
  change24h: number;
  icon: any;
  network: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer' | 'reward' | 'fee';
  asset: string;
  amount: number;
  usdValue: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  description: string;
  txHash?: string;
  fee?: number;
  from?: string;
  to?: string;
}

interface PendingTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  asset: string;
  amount: number;
  address: string;
  status: 'processing' | 'confirming';
  confirmations: number;
  requiredConfirmations: number;
  timestamp: string;
  estimatedCompletion: string;
}

export default function WalletPage() {
  const { toast } = useToast();
  const { user, wallet } = useUser();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalances, setShowBalances] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('USDT');
  
  // Mock wallet data
  const [assets, setAssets] = useState<WalletAsset[]>([
    {
      id: '1',
      symbol: 'USDT',
      name: 'Tether USD',
      balance: 1500.00,
      usdValue: 1500.00,
      price: 1.00,
      change24h: 0.02,
      icon: UsdtLogo,
      network: 'TRC20'
    },
    {
      id: '2',
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.02345,
      usdValue: 1021.75,
      price: 43560.00,
      change24h: 2.45,
      icon: BtcLogo,
      network: 'Bitcoin'
    },
    {
      id: '3',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 0.4567,
      usdValue: 1210.25,
      price: 2650.00,
      change24h: -1.23,
      icon: EthLogo,
      network: 'Ethereum'
    }
  ]);

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      asset: 'USDT',
      amount: 500,
      usdValue: 500,
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      description: 'Deposit via TRC20',
      txHash: '0x1234...5678',
      fee: 1
    },
    {
      id: '2',
      type: 'trade',
      asset: 'BTC',
      amount: 0.01,
      usdValue: 435.60,
      status: 'completed',
      timestamp: '2024-01-14T15:45:00Z',
      description: 'Grid trading profit',
      fee: 0.1
    },
    {
      id: '3',
      type: 'reward',
      asset: 'USDT',
      amount: 25.50,
      usdValue: 25.50,
      status: 'completed',
      timestamp: '2024-01-14T09:20:00Z',
      description: 'Daily trading bonus'
    },
    {
      id: '4',
      type: 'withdrawal',
      asset: 'ETH',
      amount: 0.1,
      usdValue: 265,
      status: 'pending',
      timestamp: '2024-01-13T18:15:00Z',
      description: 'Withdraw to external wallet',
      fee: 0.002
    }
  ]);

  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([
    {
      id: '1',
      type: 'deposit',
      asset: 'BTC',
      amount: 0.005,
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      status: 'confirming',
      confirmations: 2,
      requiredConfirmations: 3,
      timestamp: '2024-01-15T12:00:00Z',
      estimatedCompletion: '2024-01-15T12:30:00Z'
    }
  ]);

  // Calculate total portfolio value
  const totalValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalChange24h = assets.reduce((sum, asset) => {
    const change = (asset.usdValue * asset.change24h) / 100;
    return sum + change;
  }, 0);
  const totalChangePercent = (totalChange24h / totalValue) * 100;

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCrypto = (amount: number, decimals = 8) => {
    return amount.toFixed(decimals).replace(/\.?0+$/, '');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'trade': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'transfer': return <Send className="h-4 w-4 text-purple-500" />;
      case 'reward': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'fee': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'confirming':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Confirming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const refreshWallet = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update asset prices with random changes
      setAssets(prev => prev.map(asset => ({
        ...asset,
        change24h: asset.change24h + (Math.random() - 0.5) * 0.5,
        price: asset.price * (1 + (Math.random() - 0.5) * 0.01)
      })));
      
      toast({
        title: "Wallet Refreshed",
        description: "Latest prices and balances updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh wallet data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Wallet</h1>
          <p className="text-muted-foreground">
            Manage your cryptocurrency assets and transactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshWallet}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-primary" />
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">
                {showBalances ? formatCurrency(totalValue) : '••••••'}
              </div>
              <div className={`flex items-center text-sm ${
                totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalChangePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {showBalances ? (
                  <>
                    {formatCurrency(Math.abs(totalChange24h))} ({Math.abs(totalChangePercent).toFixed(2)}%)
                  </>
                ) : (
                  '••••••'
                )}
                <span className="text-muted-foreground ml-1">24h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Minus className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Transactions Alert */}
      {pendingTransactions.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            You have {pendingTransactions.length} pending transaction(s) waiting for confirmation.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Assets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Assets Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
              <CardDescription>
                Overview of your cryptocurrency holdings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage asChild>
                          <asset.icon className="h-full w-full" />
                        </AvatarImage>
                        <AvatarFallback>{asset.symbol}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-semibold">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.symbol} • {asset.network}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-medium">
                        {showBalances ? formatCrypto(asset.balance) : '••••••'} {asset.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ≈ {showBalances ? formatCurrency(asset.usdValue) : '••••••'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-medium">
                        {formatCurrency(asset.price)}
                      </div>
                      <div className={`text-sm ${
                        asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {assets.map((asset) => {
                  const percentage = (asset.usdValue / totalValue) * 100;
                  return (
                    <div key={asset.id} className="text-center p-4 border rounded-lg">
                      <asset.icon className="h-8 w-8 mx-auto mb-2" />
                      <div className="font-semibold">{asset.symbol}</div>
                      <div className="text-2xl font-bold text-primary">
                        {percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {showBalances ? formatCurrency(asset.usdValue) : '••••••'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Recent Transactions
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-full">
                        {getTransactionIcon(tx.type)}
                      </div>
                      
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className={`font-medium ${
                        tx.type === 'deposit' || tx.type === 'reward' ? 'text-green-600' : 
                        tx.type === 'withdrawal' || tx.type === 'fee' ? 'text-red-600' : 
                        'text-foreground'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'reward' ? '+' : 
                         tx.type === 'withdrawal' || tx.type === 'fee' ? '-' : ''}
                        {formatCrypto(tx.amount)} {tx.asset}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ≈ {formatCurrency(tx.usdValue)}
                      </div>
                      {tx.fee && (
                        <div className="text-xs text-muted-foreground">
                          Fee: {formatCrypto(tx.fee)} {tx.asset}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(tx.status)}
                      {tx.txHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(tx.txHash!, 'Transaction hash')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Transactions Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pending Transactions
              </CardTitle>
              <CardDescription>
                Transactions waiting for network confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.length > 0 ? (
                <div className="space-y-4">
                  {pendingTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-full">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{tx.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCrypto(tx.amount)} {tx.asset}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(tx.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Network Confirmations</span>
                          <span>{tx.confirmations}/{tx.requiredConfirmations}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(tx.confirmations / tx.requiredConfirmations) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started: {new Date(tx.timestamp).toLocaleString()}</span>
                          <span>ETA: {new Date(tx.estimatedCompletion).toLocaleString()}</span>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Address:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs">
                              {tx.address.slice(0, 8)}...{tx.address.slice(-8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(tx.address, 'Address')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Network:</span>
                          <div className="font-medium">{tx.asset} Network</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No pending transactions</p>
                  <p className="text-sm">All your transactions have been confirmed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">24h Change</span>
                    <span className={`font-semibold ${
                      totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Assets</span>
                    <span className="font-semibold">{assets.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Transactions</span>
                    <span className="font-semibold">{recentTransactions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pending Transactions</span>
                    <span className="font-semibold">{pendingTransactions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['deposit', 'withdrawal', 'trade', 'reward'].map((type) => {
                    const count = recentTransactions.filter(tx => tx.type === type).length;
                    const total = recentTransactions.filter(tx => tx.type === type)
                      .reduce((sum, tx) => sum + tx.usdValue, 0);
                    
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(type)}
                          <span className="capitalize">{type}s</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{count}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(total)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>
                Your wallet security and protection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">2FA Enabled</div>
                    <div className="text-sm text-muted-foreground">Account protected</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Wallet Encrypted</div>
                    <div className="text-sm text-muted-foreground">Data secured</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">Backup Pending</div>
                    <div className="text-sm text-muted-foreground">Create backup</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
