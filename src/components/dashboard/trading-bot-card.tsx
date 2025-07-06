"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { type WalletData, updateWallet } from "@/lib/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function TradingBotCard({
  walletData,
  onUpdate,
}: {
  walletData: WalletData;
  onUpdate: (data: WalletData) => void;
}) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const logRef = React.useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const totalBalance =
    walletData.balances.usdt + walletData.balances.eth * 2500; // Assuming ETH price for calculation
  const canStart =
    totalBalance >= 100 && walletData.growth.clicksLeft > 0 && !isAnimating;

  const addLogLine = (text: string) => {
    setLogs((prev) => {
        const newLogs = [...prev, text];
        if (newLogs.length > 5) {
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
    if (!canStart) {
      if (isAnimating) {
        toast({ title: "Bot is already running." });
      } else if (totalBalance < 100) {
        toast({
          title: "Insufficient Balance",
          description: "You need at least $100 to run the bot.",
          variant: "destructive"
        });
      } else if (walletData.growth.clicksLeft <= 0) {
        toast({
          title: "Limit Reached",
          description: "You've used all your runs for today.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsAnimating(true);
    setLogs([]);
    setProgressPercent(0);

    const milestones = [
      { percent: 5, text: "🔗 Initializing AI core..." },
      { percent: 15, text: "📈 Analyzing market data..." },
      { percent: 30, text: "🔍 Identifying arbitrage opportunity..." },
      { percent: 60, text: "✅ Executing trade..." },
      { percent: 85, text: "🧮 Calculating profit..." },
      { percent: 100, text: "💰 Trade complete. Profit secured." },
    ];

    let loggedMilestones = new Set();
    let animationRequestId: number;

    const duration = 5000; // 5 seconds
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
        const rate = totalBalance >= 500 ? 0.03 : 0.025;
        const earnings = totalBalance * rate;

        const newWalletData: WalletData = {
          ...walletData,
          balances: {
            ...walletData.balances,
            usdt: walletData.balances.usdt + earnings,
          },
          growth: {
            ...walletData.growth,
            clicksLeft: walletData.growth.clicksLeft - 1,
          },
        };

        updateWallet(newWalletData);
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
        canStart && "cursor-pointer hover:border-primary hover:shadow-xl hover:shadow-primary/20",
        isAnimating && "border-primary ring-2 ring-primary/50 shadow-xl shadow-primary/20"
      )}
    >
      <CardHeader className="flex-row items-start justify-between pb-4">
        <div className="space-y-1">
          <CardTitle>AI Growth Engine</CardTitle>
          <CardDescription>
            {walletData.growth.clicksLeft > 0 
                ? `${walletData.growth.clicksLeft} run${walletData.growth.clicksLeft > 1 ? 's' : ''} left today`
                : 'No runs left for today'
            }
          </CardDescription>
        </div>
        <div className={cn(
            "p-2 rounded-lg bg-muted transition-all",
            isAnimating && "bg-primary/20 animate-bot-pulse"
        )}>
            <Bot className={cn(
                "h-6 w-6 text-muted-foreground transition-colors",
                isAnimating && "text-primary"
            )} />
        </div>
      </CardHeader>
      <CardContent>
        {isAnimating ? (
          <div className="space-y-3 animate-in fade-in-50 duration-500">
            <Progress value={progressPercent} className="h-2" />
            <div ref={logRef} className="h-[7.5rem] overflow-y-auto rounded-md bg-muted/50 p-3 text-xs text-muted-foreground font-mono space-y-1">
              {logs.length > 0 ? logs.map((log, index) => (
                <p key={index} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">{log}</p>
              )) : <p>Starting engine...</p>}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[9.25rem] rounded-lg bg-muted/50 p-4 animate-in fade-in-0 duration-300">
            <Zap className={cn(
                "h-8 w-8 mb-2",
                canStart && "animate-pulse text-primary/80"
            )} />
            <p className="font-semibold text-foreground">
              {canStart ? 'Click here to start' : totalBalance < 100 ? 'Minimum $100 balance required' : 'No runs left'}
            </p>
            <p className="text-xs">
                {canStart ? 'Earn up to 3% on your available balance.' : 'Come back tomorrow for more runs.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
