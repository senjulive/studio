"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { type WalletData } from "@/lib/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BotAnimationPreview } from "./bot-animation-preview";
import { AstralLogo } from "../icons/astral-logo";
import { getBotTierSettings, type TierSetting } from "@/lib/settings";

export function TradingBotCard({
  walletData,
  onUpdate,
  className,
}: {
  walletData: WalletData;
  onUpdate: (data: WalletData) => void;
  className?: string;
}) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [tierSettings, setTierSettings] = React.useState<TierSetting[]>([]);
  const logRef = React.useRef<HTMLDivElement>(null);

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
    const applicableTier = [...tierSettings].reverse().find(tier => balance >= tier.balanceThreshold);
    return applicableTier || null;
  }, [tierSettings]);

  const totalBalance = (walletData?.balances?.usdt ?? 0);
  const currentTier = getCurrentTier(totalBalance);
  
  const profitPerTrade = currentTier && totalBalance > 0 
    ? (totalBalance * currentTier.dailyProfit) / currentTier.clicks 
    : 0;

  const canStart =
    totalBalance >= 100 && (walletData?.growth?.clicksLeft ?? 0) > 0 && !isAnimating;

  const addLogLine = (text: string) => {
    setLogs((prev) => {
      const newLogs = [...prev, text];
      if (newLogs.length > 6) {
        newLogs.shift();
      }
      return newLogs;
    });
  };

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

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
    setLogs([]);
    setProgressPercent(0);

    const exchanges = ['Binance', 'Coinbase Pro', 'Kraken', 'KuCoin', 'Bitstamp', 'Gemini'];
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];

    const milestones = [
      { percent: 5, text: "Robot started successfully" },
      { percent: 15, text: "Scan the market successfully" },
      { percent: 30, text: "Order matching successfully" },
      { percent: 60, text: `Successfully buy on ${exchange}` },
      { percent: 90, text: `Successfully sold on ${exchange}` },
      { percent: 100, text: "Settlement completed" },
    ];

    let loggedMilestones = new Set();
    let animationRequestId: number;

    const duration = 90000; // 90 seconds
    const startTime = performance.now();

    const updateAnimation = (time: number) => {
      const elapsed = time - startTime;
      const percent = Math.min(100, (elapsed / duration) * 100);

      setProgressPercent(percent);

      milestones.forEach((m) => {
        if (percent >= m.percent && !loggedMilestones.has(m.percent)) {
          loggedMilestones.add(m.percent);
          addLogLine(m.text);
        }
      });

      if (percent < 100) {
        animationRequestId = requestAnimationFrame(updateAnimation);
      } else {
        const earnings = profitPerTrade;

        const newWalletData: WalletData = {
          ...walletData,
          balances: {
            ...walletData.balances,
            usdt: (walletData.balances?.usdt ?? 0) + earnings,
          },
          growth: {
            ...walletData.growth,
            clicksLeft: (walletData.growth?.clicksLeft ?? 1) - 1,
            dailyEarnings: (walletData.growth?.dailyEarnings ?? 0) + earnings,
          },
        };

        onUpdate(newWalletData);

        toast({
          title: "Trade Successful!",
          description: `You've earned $${earnings.toFixed(2)}.`,
        });

        setTimeout(() => {
            setIsAnimating(false);
            setLogs([]);
        }, 2000);
      }
    };

    animationRequestId = requestAnimationFrame(updateAnimation);
  };

  return (
    <Card
      onClick={handleStart}
      className={cn(
        "transition-all duration-300",
        canStart && "cursor-pointer hover:border-primary hover:shadow-lg",
        isAnimating && "border-primary ring-2 ring-primary/50",
        className
      )}
    >
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
        {isAnimating ? (
          <div className="space-y-3 animate-in fade-in-50 duration-500">
            <Progress value={progressPercent} className="h-2" />
            <div ref={logRef} className="h-[7.5rem] overflow-y-auto rounded-md bg-muted p-3 text-xs text-muted-foreground font-mono space-y-1">
              {logs.length > 0 ? logs.map((log, index) => (
                <p key={index} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">{log}</p>
              )) : <p>Starting engine...</p>}
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
