
"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { type WalletData } from "@/lib/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BotAnimationPreview } from "./bot-animation-preview";
import { AstralLogo } from "../icons/astral-logo";
import { getBotTierSettings, type TierSetting } from "@/lib/settings";
import { GridTradingAnimation } from "./grid-trading-animation";

export function TradingBotCard({
  walletData,
  onUpdate,
  totalBalance,
  className,
}: {
  walletData: WalletData;
  onUpdate: (data: WalletData) => void;
  totalBalance: number;
  className?: string;
}) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [tierSettings, setTierSettings] = React.useState<TierSetting[]>([]);

  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchSettings() {
      const settings = await getBotTierSettings();
      setTierSettings(settings);
    }
    fetchSettings();
  }, []);

  const getCurrentTier = React.useCallback((balance: number): TierSetting | null => {
    if (tierSettings.length === 0) return null;
    // Tiers are pre-sorted by balance ascending, so we find the highest applicable tier by reversing
    const applicableTier = [...tierSettings].reverse().find(tier => balance >= tier.balanceThreshold && tier.Icon !== Zap);
    return applicableTier || null;
  }, [tierSettings]);

  const currentTier = getCurrentTier(totalBalance);
  
  const profitPerTrade = currentTier && totalBalance > 0 
    ? (totalBalance * currentTier.dailyProfit) / currentTier.clicks 
    : 0;
  
  const profitPercentagePerTrade = currentTier && totalBalance > 0 
    ? (currentTier.dailyProfit / currentTier.clicks) * 100
    : 0;

  const canStart =
    totalBalance >= 100 && (walletData?.growth?.clicksLeft ?? 0) > 0 && !isAnimating;


  const handleStart = async () => {
    if (!canStart || !currentTier) {
      if (isAnimating) {
        toast({ title: "Bot is already running." });
      } else if (totalBalance < 100) {
        toast({
          title: "Insufficient Balance",
          description: "You need at least $100 to run the bot.",
          variant: "destructive"
        });
      } else if ((walletData?.growth?.clicksLeft ?? 0) <= 0) {
        toast({
          title: "Limit Reached",
          description: "You have no grids remaining for today.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsAnimating(true);
    
    // Simulate the animation and trading process
    setTimeout(() => {
        const usdtEarnings = profitPerTrade;
        const btcBonus = 0.00001 + Math.random() * 0.00002;
        const ethBonus = 0.0002 + Math.random() * 0.0003;
        
        const newEarning = { amount: usdtEarnings, timestamp: Date.now() };

        const newWalletData: WalletData = {
          ...walletData,
          balances: {
            usdt: (walletData.balances?.usdt ?? 0) + usdtEarnings,
            btc: (walletData.balances?.btc ?? 0) + btcBonus,
            eth: (walletData.balances?.eth ?? 0) + ethBonus,
          },
          growth: {
            ...walletData.growth,
            clicksLeft: (walletData.growth?.clicksLeft ?? 1) - 1,
            dailyEarnings: (walletData.growth?.dailyEarnings ?? 0) + usdtEarnings,
            earningsHistory: [...(walletData.growth.earningsHistory || []), newEarning],
          },
        };

        onUpdate(newWalletData);

        toast({
          title: "Trade Successful!",
          description: `You've earned $${usdtEarnings.toFixed(2)} USDT and a bonus in BTC & ETH.`,
        });

        setIsAnimating(false);
    }, 60000); // Animation duration
  };

  return (
    <Card
      onClick={handleStart}
      className={cn(
        "transition-all duration-300 overflow-hidden",
        canStart && "cursor-pointer hover:border-primary hover:shadow-lg",
        isAnimating && "border-primary ring-2 ring-primary/50",
        className
      )}
    >
        {isAnimating && currentTier ? (
            <GridTradingAnimation totalBalance={totalBalance} profitPerTrade={profitPerTrade} profitPercentage={profitPercentagePerTrade} />
        ) : (
            <>
                <CardHeader className="flex-row items-start justify-between pb-4">
                    <div className="space-y-1">
                    <CardTitle>Astral Trading</CardTitle>
                    <CardDescription>
                        {(walletData?.growth?.clicksLeft ?? 0) > 0 
                            ? `${walletData.growth.clicksLeft} grid${walletData.growth.clicksLeft > 1 ? 's' : ''} remaining`
                            : 'No grids remaining'
                        }
                    </CardDescription>
                    </div>
                    <div className={cn(
                        "p-2 rounded-lg bg-muted transition-all",
                        isAnimating && "bg-primary/20 animate-bot-pulse"
                    )}>
                        <Bot className={cn(
                            "h-6 w-6 text-foreground/80 transition-colors",
                            isAnimating && "text-primary"
                        )} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center h-[9.25rem] rounded-lg bg-muted/50 p-4 animate-in fade-in-0 duration-300">
                        {canStart ? (
                        <BotAnimationPreview />
                        ) : totalBalance < 100 ? (
                            <Zap className="h-8 w-8 mb-2 text-muted-foreground" />
                        ) : (
                            <AstralLogo className="h-10 w-10 mb-2 text-muted-foreground" />
                        )}
                        <p className="font-semibold text-card-foreground mt-2">
                        {canStart ? 'START GRID' : totalBalance < 100 ? 'Minimum $100 balance required' : 'No grids remaining'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {canStart && currentTier ? `Earn up to ${(currentTier.dailyProfit * 100).toFixed(1)}% daily.` : ''}
                        </p>
                    </div>
                </CardContent>
            </>
        )}
    </Card>
  );
}
