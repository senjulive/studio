'use client';

import * as React from "react";
import Link from "next/link";
import { Search, QrCode, Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, BarChart3 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

// Crypto assets data with realistic values
const cryptoAssets = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.42,
    value: 16245,
    change: 3.2,
    icon: "₿",
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: "ethereum", 
    name: "Ethereum",
    symbol: "ETH",
    amount: 3.8,
    value: 7120,
    change: 1.8,
    icon: "Ξ",
    color: "from-blue-500 to-purple-500"
  },
  {
    id: "solana",
    name: "Solana", 
    symbol: "SOL",
    amount: 42,
    value: 2450,
    change: -0.5,
    icon: "◊",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "lykan",
    name: "LYKAN",
    symbol: "LYK", 
    amount: 850,
    value: 3570,
    change: 8.3,
    icon: "◈",
    color: "from-cyan-500 to-blue-500"
  }
];

export function NeonWalletView() {
  const { wallet, user } = useUser();

  // Calculate total portfolio value from user's actual wallet
  const totalValue = React.useMemo(() => {
    if (!wallet?.balances) return 24857.90; // Default demo value
    const balances = wallet.balances as any;
    return balances.usdt + (balances.btc * 68000) + (balances.eth * 3500);
  }, [wallet]);

  // Calculate real crypto assets based on user's wallet
  const userAssets = React.useMemo(() => {
    if (!wallet?.balances) return cryptoAssets;

    const balances = wallet.balances as any;
    const btcPrice = 68000;
    const ethPrice = 3500;
    const solPrice = 150;

    return [
      {
        ...cryptoAssets[0], // Bitcoin
        amount: balances.btc || 0,
        value: (balances.btc || 0) * btcPrice,
      },
      {
        ...cryptoAssets[1], // Ethereum
        amount: balances.eth || 0,
        value: (balances.eth || 0) * ethPrice,
      },
      {
        ...cryptoAssets[2], // Solana
        amount: 0, // User doesn't have SOL in the current system
        value: 0,
      },
      {
        ...cryptoAssets[3], // LYKAN - custom token
        amount: balances.usdt || 0, // Using USDT as proxy for now
        value: balances.usdt || 0,
      }
    ].filter(asset => asset.amount > 0); // Only show assets with balance
  }, [wallet]);

  const weeklyChange = 5.2; // Mock weekly change
  const dailyEarnings = (wallet?.growth as any)?.dailyEarnings ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <span className="text-lg font-bold">₿</span>
          </div>
          <div>
            <h1 className="font-semibold">Main Wallet</h1>
            <p className="text-xs text-gray-400">{user?.email || 'user@astralcore.io'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <QrCode className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Balance Card */}
      <section className="p-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 p-6">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse" />
          
          <div className="relative z-10">
            <p className="text-sm text-gray-400 mb-2">Total Portfolio Value</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{weeklyChange}% this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Chips */}
      <section className="px-4 mb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0 rounded-full px-6 whitespace-nowrap">
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Receive
          </Button>
          <Button variant="ghost" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 whitespace-nowrap">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Send
          </Button>
          <Button variant="ghost" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 whitespace-nowrap">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Swap
          </Button>
          <Button variant="ghost" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 whitespace-nowrap">
            <BarChart3 className="w-4 h-4 mr-2" />
            Trade
          </Button>
        </div>
      </section>

      {/* Assets Section */}
      <section className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Assets</h2>
          <Link href="/dashboard/market" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cryptoAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30"
            >
              {/* Asset Header */}
              <div className="flex items-center mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mr-3 bg-gradient-to-br",
                  asset.color
                )}>
                  {asset.icon}
                </div>
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-xs text-gray-400">{asset.amount} {asset.symbol}</p>
                </div>
              </div>

              {/* Mini Chart Visualization */}
              <div className="h-16 mb-4 relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 opacity-50" 
                     style={{
                       clipPath: "polygon(0% 100%, 0% 50%, 30% 30%, 50% 50%, 70% 30%, 100% 50%, 100% 100%)"
                     }} 
                />
              </div>

              {/* Asset Footer */}
              <div className="flex items-center justify-between">
                <p className="font-semibold">${asset.value.toLocaleString()}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold border-0",
                    asset.change >= 0 
                      ? "text-green-400 bg-green-400/20" 
                      : "text-red-400 bg-red-400/20"
                  )}
                >
                  {asset.change >= 0 ? "+" : ""}{asset.change}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-white/10 z-50">
        <div className="flex items-center justify-around py-3">
          {[
            { href: "/dashboard", label: "Wallet", icon: "₿", active: true },
            { href: "/dashboard/market", label: "Portfolio", icon: "◉" },
            { href: "/dashboard/trading", label: "Trade", icon: "⚡" },
            { href: "/dashboard/profile", label: "Settings", icon: "⚙" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs transition-colors relative",
                item.active 
                  ? "text-purple-400" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
              {item.active && (
                <div className="absolute -bottom-3 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/25 border-0 z-50"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
