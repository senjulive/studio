'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { 
  MobileCard, 
  MobileCardHeader, 
  MobileCardTitle, 
  MobileCardContent 
} from '@/components/ui/mobile-optimized-card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MobileWalletCardProps {
  className?: string;
}

export function MobileWalletCard({ className }: MobileWalletCardProps) {
  const { state } = useApp();
  const { toast } = useToast();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<'total' | 'usdt' | 'btc' | 'eth'>('total');

  const { balance, totalBalance } = state;

  const assets = [
    {
      key: 'total' as const,
      symbol: 'USD',
      name: 'Total Balance',
      value: totalBalance,
      change: 5.67,
      color: 'from-green-500 to-emerald-500',
    },
    {
      key: 'usdt' as const,
      symbol: 'USDT',
      name: 'Tether USD',
      value: balance.usdt,
      change: 0.01,
      color: 'from-green-500 to-green-600',
    },
    {
      key: 'btc' as const,
      symbol: 'BTC',
      name: 'Bitcoin',
      value: balance.btc,
      change: -2.34,
      color: 'from-orange-500 to-yellow-500',
    },
    {
      key: 'eth' as const,
      symbol: 'ETH',
      name: 'Ethereum',
      value: balance.eth,
      change: 3.45,
      color: 'from-blue-500 to-purple-500',
    },
  ];

  const selectedAssetData = assets.find(asset => asset.key === selectedAsset) || assets[0];

  const formatBalance = (value: number, symbol: string) => {
    if (!balanceVisible) return '****';
    
    if (symbol === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x1234...5678');
    toast({
      title: 'Address copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  return (
    <MobileCard
      variant="gradient"
      size="lg"
      className={cn('relative overflow-hidden', className)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-gradient-to-tl from-white/10 to-transparent" />
      </div>

      <MobileCardHeader>
        <div className="flex items-center justify-between">
          <MobileCardTitle gradient>Wallet</MobileCardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {balanceVisible ? (
                <Eye className="w-5 h-5 text-[var(--qn-light)]" />
              ) : (
                <EyeOff className="w-5 h-5 text-[var(--qn-light)]" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-[var(--qn-light)]" />
            </button>
          </div>
        </div>
      </MobileCardHeader>

      <MobileCardContent>
        {/* Main Balance Display */}
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAsset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              <div className="text-3xl md:text-4xl font-bold text-[var(--qn-light)]">
                {formatBalance(selectedAssetData.value, selectedAssetData.symbol)}
              </div>
              <div className="text-sm text-[var(--qn-light)]/60">
                {selectedAssetData.name}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Price Change */}
          <div className={cn(
            'flex items-center justify-center gap-1 text-sm font-medium',
            selectedAssetData.change >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {selectedAssetData.change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {selectedAssetData.change >= 0 ? '+' : ''}{selectedAssetData.change}%
          </div>
        </div>

        {/* Asset Selector */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {assets.map((asset) => (
            <button
              key={asset.key}
              onClick={() => setSelectedAsset(asset.key)}
              className={cn(
                'p-3 rounded-xl border transition-all duration-200',
                selectedAsset === asset.key
                  ? 'border-[var(--qn-primary)] bg-[var(--qn-primary)]/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              )}
            >
              <div className="text-xs font-medium text-[var(--qn-light)] mb-1">
                {asset.symbol}
              </div>
              <div className="text-xs text-[var(--qn-light)]/60">
                {formatBalance(asset.value, asset.symbol)}
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Deposit</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Minus className="w-5 h-5" />
            <span className="font-medium">Withdraw</span>
          </motion.button>
        </div>

        {/* Recent Transactions Preview */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--qn-light)]">Recent</span>
            <button className="text-xs text-[var(--qn-secondary)] hover:text-[var(--qn-primary)] transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-2">
            {[
              { type: 'deposit', amount: '+$500.00', time: '2h ago', status: 'completed' },
              { type: 'withdraw', amount: '-$150.00', time: '5h ago', status: 'pending' },
            ].map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-full',
                    tx.type === 'deposit' ? 'bg-green-500/20' : 'bg-red-500/20'
                  )}>
                    {tx.type === 'deposit' ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--qn-light)] capitalize">
                      {tx.type}
                    </div>
                    <div className="text-xs text-[var(--qn-light)]/60">
                      {tx.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-sm font-medium',
                    tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {tx.amount}
                  </div>
                  <div className={cn(
                    'text-xs capitalize',
                    tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                  )}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[var(--qn-light)]/60 mb-1">Wallet Address</div>
              <div className="text-sm font-mono text-[var(--qn-light)]">
                0x1234...5678
              </div>
            </div>
            <button
              onClick={copyAddress}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Copy className="w-4 h-4 text-[var(--qn-secondary)]" />
            </button>
          </div>
        </div>
      </MobileCardContent>
    </MobileCard>
  );
}
