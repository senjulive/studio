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
  Wallet, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Smartphone,
  Globe,
  QrCode,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import Image from 'next/image';
import QRCode from 'qrcode.react';

const depositMethods = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: <Wallet className="w-6 h-6" />,
    description: 'Instant deposits via crypto',
    enabled: true,
    fee: 'No fees'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Visa, Mastercard accepted',
    enabled: true,
    fee: '2.9% fee'
  },
  {
    id: 'mobile',
    name: 'Mobile Payment',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'Apple Pay, Google Pay',
    enabled: false,
    fee: 'Coming soon'
  },
  {
    id: 'wire',
    name: 'Wire Transfer',
    icon: <Globe className="w-6 h-6" />,
    description: 'International transfers',
    enabled: false,
    fee: 'Coming soon'
  }
];

const cryptoOptions = [
  {
    symbol: 'USDT',
    name: 'Tether',
    network: 'TRC20',
    icon: 'https://assets.coincap.io/assets/icons/usdt@2x.png',
    address: 'TQRmpz1bqKA3LBzKDQnNkKv3rPa9xL4bWx',
    minDeposit: 10
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    icon: 'https://assets.coincap.io/assets/icons/btc@2x.png',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minDeposit: 0.0001
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC20',
    icon: 'https://assets.coincap.io/assets/icons/eth@2x.png',
    address: '0x742d35Cc6634C0532925a3b8D332Cc71F8a47e09',
    minDeposit: 0.001
  }
];

export function DepositViewMobile() {
  const { wallet } = useUser();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = React.useState('crypto');
  const [selectedCrypto, setSelectedCrypto] = React.useState(cryptoOptions[0]);
  const [depositAmount, setDepositAmount] = React.useState('');
  const [showQR, setShowQR] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleDeposit = () => {
    if (selectedMethod === 'crypto') {
      setShowQR(true);
    } else {
      toast({
        title: "Coming Soon",
        description: "This payment method will be available soon!",
        variant: "default",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="mobile-card">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center electric-glow">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Deposit Funds</h1>
          <p className="text-muted-foreground">
            Add funds to your AstralCore account to start trading
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Select Payment Method</h2>
          <div className="grid grid-cols-1 gap-3">
            {depositMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                disabled={!method.enabled}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  selectedMethod === method.id && method.enabled
                    ? "border-primary bg-primary/10 electric-glow"
                    : method.enabled
                    ? "border-border hover:border-primary/50"
                    : "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    method.enabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <Badge variant={method.enabled ? "default" : "secondary"} className="text-xs">
                    {method.fee}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crypto Deposit */}
      {selectedMethod === 'crypto' && (
        <>
          {/* Crypto Selection */}
          <div className="mobile-card">
            <div className="p-6">
              <h2 className="font-bold text-lg mb-4">Select Cryptocurrency</h2>
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
                        <p className="text-sm text-muted-foreground">Min. Deposit</p>
                        <p className="font-semibold">{crypto.minDeposit} {crypto.symbol}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mobile-card">
            <div className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Deposit Amount</h2>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({selectedCrypto.symbol})</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Min. ${selectedCrypto.minDeposit} ${selectedCrypto.symbol}`}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['10', '50', '100', '500'].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount(amount)}
                    className="h-10"
                  >
                    {amount}
                  </Button>
                ))}
              </div>

              <Button 
                onClick={handleDeposit}
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary electric-glow"
                disabled={!depositAmount || parseFloat(depositAmount) < selectedCrypto.minDeposit}
              >
                Generate Deposit Address
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* QR Code & Address */}
          {showQR && (
            <div className="mobile-card">
              <div className="p-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h2 className="font-bold text-lg">Deposit Address Generated</h2>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-xl inline-block">
                  <QRCode value={selectedCrypto.address} size={160} />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label>Send {selectedCrypto.symbol} to this address:</Label>
                  <div className="p-3 bg-background/50 rounded-xl border border-primary/20">
                    <p className="text-sm font-mono break-all">{selectedCrypto.address}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedCrypto.address)}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Address
                  </Button>
                </div>

                {/* Warning */}
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div className="text-left">
                      <p className="font-semibold text-orange-400 mb-1">Important</p>
                      <p className="text-sm text-muted-foreground">
                        Only send {selectedCrypto.symbol} ({selectedCrypto.network}) to this address. 
                        Sending other tokens may result in permanent loss.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Recent Deposits */}
      <div className="mobile-card">
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4">Recent Deposits</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold">50.00 USDT</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-500/20 text-green-400">
                Completed
              </Badge>
            </div>
            
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No more recent deposits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
