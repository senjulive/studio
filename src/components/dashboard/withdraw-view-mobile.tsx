'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  ArrowDownLeft, 
  Wallet, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Copy,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';

const cryptoOptions = [
  {
    symbol: 'USDT',
    name: 'Tether',
    network: 'TRC20',
    icon: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
    minWithdraw: 10,
    fee: 1,
    processingTime: '1-5 minutes'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    icon: 'https://assets.coincap.io/assets/icons/btc@2x.png',
    minWithdraw: 0.001,
    fee: 0.0005,
    processingTime: '30-60 minutes'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC20',
    icon: 'https://assets.coincap.io/assets/icons/eth@2x.png',
    minWithdraw: 0.01,
    fee: 0.005,
    processingTime: '5-15 minutes'
  }
];

const mockWithdrawals = [
  {
    id: '1',
    amount: 100,
    symbol: 'USDT',
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    amount: 0.05,
    symbol: 'BTC',
    status: 'pending',
    date: '2024-01-15T09:15:00Z',
    txHash: null
  }
];

export function WithdrawViewMobile() {
  const { wallet } = useUser();
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = React.useState(cryptoOptions[0]);
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [withdrawAddress, setWithdrawAddress] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const balance = wallet?.balances?.usdt || 0;
  const maxWithdraw = Math.max(0, balance - selectedCrypto.fee);
  const isValidAmount = withdrawAmount && 
    parseFloat(withdrawAmount) >= selectedCrypto.minWithdraw && 
    parseFloat(withdrawAmount) <= maxWithdraw;

  const handleWithdraw = async () => {
    if (!isValidAmount || !withdrawAddress) {
      toast({
        title: "Invalid Input",
        description: "Please check your amount and address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Withdrawal Submitted",
        description: "Your withdrawal request has been submitted for processing",
      });
      setWithdrawAmount('');
      setWithdrawAddress('');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="mobile-card">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mx-auto mb-4 flex items-center justify-center electric-glow">
            <ArrowDownLeft className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-muted-foreground">
            Transfer your assets to external wallets
          </p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Available Balance</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-primary/10">
              <div className="flex items-center gap-3">
                <Image 
                  src="https://assets.coincap.io/assets/icons/usdt@2x.png" 
                  alt="USDT" 
                  width={32} 
                  height={32} 
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">USDT Balance</p>
                  <p className="text-sm text-muted-foreground">Tether</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{balance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">≈ ${balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Selection */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Select Asset</h2>
          <div className="grid grid-cols-1 gap-3">
            {cryptoOptions.map((crypto) => (
              <button
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  selectedCrypto.symbol === crypto.symbol
                    ? "border-primary bg-primary/10 electric-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Image 
                    src={crypto.icon} 
                    alt={crypto.symbol} 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{crypto.name} ({crypto.symbol})</h3>
                    <p className="text-sm text-muted-foreground">Network: {crypto.network}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Fee: {crypto.fee} {crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground">{crypto.processingTime}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="mobile-card">
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-lg">Withdrawal Details</h2>
          
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({selectedCrypto.symbol})</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Min. ${selectedCrypto.minWithdraw} ${selectedCrypto.symbol}`}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="h-12 text-lg"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: {selectedCrypto.minWithdraw} {selectedCrypto.symbol}</span>
              <span>Max: {maxWithdraw.toFixed(6)} {selectedCrypto.symbol}</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['25%', '50%', '75%', 'Max'].map((percent) => (
              <Button
                key={percent}
                variant="outline"
                size="sm"
                onClick={() => {
                  let amount = 0;
                  if (percent === '25%') amount = maxWithdraw * 0.25;
                  else if (percent === '50%') amount = maxWithdraw * 0.5;
                  else if (percent === '75%') amount = maxWithdraw * 0.75;
                  else amount = maxWithdraw;
                  setWithdrawAmount(amount.toFixed(6));
                }}
                className="h-10"
              >
                {percent}
              </Button>
            ))}
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address">Withdrawal Address</Label>
            <Input
              id="address"
              placeholder={`Enter ${selectedCrypto.symbol} address`}
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="h-12 font-mono text-sm"
            />
          </div>

          {/* Transaction Summary */}
          {withdrawAmount && (
            <div className="p-4 bg-background/50 rounded-xl space-y-2">
              <h3 className="font-semibold mb-2">Transaction Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span>{withdrawAmount} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee:</span>
                <span>{selectedCrypto.fee} {selectedCrypto.symbol}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>You'll Receive:</span>
                  <span>{(parseFloat(withdrawAmount) - selectedCrypto.fee).toFixed(6)} {selectedCrypto.symbol}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-orange-400 mb-1">Important</p>
                <p className="text-sm text-muted-foreground">
                  Double-check the withdrawal address. Transactions cannot be reversed once confirmed.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleWithdraw}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 electric-glow"
            disabled={!isValidAmount || !withdrawAddress || isProcessing}
          >
            {isProcessing ? "Processing..." : "Withdraw"}
          </Button>
        </div>
      </div>

      {/* Recent Withdrawals */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Recent Withdrawals</h2>
          <div className="space-y-3">
            {mockWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-4 bg-background/50 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      withdrawal.status === 'completed' ? "bg-green-500/20" : "bg-orange-500/20"
                    )}>
                      {withdrawal.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{withdrawal.amount} {withdrawal.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(withdrawal.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={withdrawal.status === 'completed' ? "default" : "secondary"}
                    className={cn(
                      withdrawal.status === 'completed' && "bg-green-500/20 text-green-400"
                    )}
                  >
                    {withdrawal.status}
                  </Badge>
                </div>
                {withdrawal.txHash && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">TX:</span>
                    <span className="font-mono">{withdrawal.txHash}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(withdrawal.txHash || '')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
