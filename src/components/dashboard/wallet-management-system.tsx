'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Minus,
  BarChart3,
  PieChart,
  History,
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import Image from 'next/image';

interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
  price: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'reward' | 'transfer';
  asset: string;
  amount: number;
  value: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txHash?: string;
  fee?: number;
  from?: string;
  to?: string;
}

const mockAssets: WalletAsset[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    balance: 1247.83,
    value: 1247.83,
    change24h: 0.01,
    icon: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
    price: 1.00
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.0234,
    value: 1589.45,
    change24h: 2.34,
    icon: 'https://assets.coincap.io/assets/icons/btc@2x.png',
    price: 67890.50
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 0.678,
    value: 2371.56,
    change24h: -1.23,
    icon: 'https://assets.coincap.io/assets/icons/eth@2x.png',
    price: 3498.75
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: 12.45,
    value: 1867.50,
    change24h: 4.56,
    icon: 'https://assets.coincap.io/assets/icons/sol@2x.png',
    price: 150.00
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    asset: 'USDT',
    amount: 500,
    value: 500,
    status: 'completed',
    timestamp: '2024-01-15T12:30:00Z',
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    type: 'trade',
    asset: 'BTC',
    amount: 0.005,
    value: 339.45,
    status: 'completed',
    timestamp: '2024-01-15T11:45:00Z',
    fee: 1.50
  },
  {
    id: '3',
    type: 'withdrawal',
    asset: 'ETH',
    amount: -0.1,
    value: -349.87,
    status: 'pending',
    timestamp: '2024-01-15T10:20:00Z',
    to: '0xabcd...efgh'
  },
  {
    id: '4',
    type: 'reward',
    asset: 'USDT',
    amount: 25.50,
    value: 25.50,
    status: 'completed',
    timestamp: '2024-01-15T09:15:00Z'
  }
];

export function WalletManagementSystem() {
  const { wallet } = useUser();
  const { toast } = useToast();
  const [assets, setAssets] = React.useState(mockAssets);
  const [transactions, setTransactions] = React.useState(mockTransactions);
  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const [selectedAsset, setSelectedAsset] = React.useState<WalletAsset | null>(null);
  const [filterType, setFilterType] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [portfolioView, setPortfolioView] = React.useState<'list' | 'chart'>('list');

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange24h = assets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
  const totalChangePercent = (totalChange24h / totalValue) * 100;

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const refreshBalances = () => {
    toast({
      title: "Refreshing Balances",
      description: "Updating your wallet balances...",
    });

    // Simulate refresh
    setTimeout(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        change24h: (Math.random() - 0.5) * 10
      })));
      
      toast({
        title: "Balances Updated",
        description: "Your wallet balances have been refreshed.",
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'trade':
        return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'reward':
        return <Plus className="w-4 h-4 text-purple-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Overview */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center electric-glow">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Portfolio</h1>
                <p className="text-sm text-muted-foreground">Total value</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="h-8 w-8"
              >
                {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshBalances}
                className="h-8 w-8"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="text-center mb-6">
            {balanceVisible ? (
              <>
                <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {totalChangePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={cn(
                    "font-semibold",
                    totalChangePercent >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground">
                    ({totalChangePercent >= 0 ? '+' : ''}${totalChange24h.toFixed(2)})
                  </span>
                </div>
              </>
            ) : (
              <h2 className="text-3xl font-black text-muted-foreground">••••••</h2>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button asChild className="h-12 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-all">
              <a href="/dashboard/deposit">
                <ArrowDownLeft className="mr-2 h-4 w-4" />
                Deposit
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 border-red-400/50 hover:bg-red-400/10 transition-all">
              <a href="/dashboard/withdraw">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Assets Management */}
      <Tabs value={portfolioView} onValueChange={(value) => setPortfolioView(value as any)} className="w-full">
        <div className="mobile-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Assets</h2>
              <TabsList className="grid w-24 grid-cols-2 h-8">
                <TabsTrigger value="list" className="text-xs">
                  <BarChart3 className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="chart" className="text-xs">
                  <PieChart className="w-3 h-3" />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="space-y-3 mt-0">
              {assets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="p-4 bg-background/50 rounded-xl border border-primary/10 hover:electric-glow transition-all cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={asset.icon}
                        alt={asset.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{asset.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {balanceVisible ? (
                        <>
                          <p className="font-bold">{asset.balance.toFixed(6)}</p>
                          <p className="text-sm text-muted-foreground">${asset.value.toFixed(2)}</p>
                          <div className="flex items-center gap-1">
                            {asset.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-400" />
                            )}
                            <span className={cn(
                              "text-xs font-medium",
                              asset.change24h >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-muted-foreground">•••••</p>
                          <p className="text-sm text-muted-foreground">•••••</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="chart" className="mt-0">
              <div className="space-y-4">
                {assets.map((asset) => {
                  const percentage = (asset.value / totalValue) * 100;
                  return (
                    <div key={asset.symbol} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src={asset.icon}
                            alt={asset.symbol}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="font-medium">{asset.symbol}</span>
                        </div>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Transaction History */}
      <div className="mobile-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Transaction History</h2>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="trade">Trades</SelectItem>
                <SelectItem value="reward">Rewards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-3 bg-background/50 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-semibold capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.asset}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={cn(
                        "font-bold",
                        tx.amount >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {tx.amount >= 0 ? '+' : ''}{tx.amount} {tx.asset}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${Math.abs(tx.value).toFixed(2)}
                      </p>
                    </div>
                    {getStatusIcon(tx.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(tx.timestamp).toLocaleString()}</span>
                  {tx.txHash && (
                    <button
                      onClick={() => copyToClipboard(tx.txHash!)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <span className="font-mono">{tx.txHash.slice(0, 8)}...</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                {tx.fee && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Fee: ${tx.fee.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-lg">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-semibold">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enabled</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400/50">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-semibold">Withdrawal Whitelist</p>
                  <p className="text-sm text-muted-foreground">3 addresses</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
