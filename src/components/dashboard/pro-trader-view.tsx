
'use client';

import * as React from 'react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, PlayCircle, Bot, Lock, Trophy, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import { useTradingBot } from '@/hooks/use-trading-bot';
import { getOrCreateWallet, updateWallet, type WalletData } from '@/lib/wallet';
import { useUser } from '@/contexts/UserContext';
import { type TierSetting as TierData, getBotTierSettings, getCurrentTier } from '@/lib/tiers';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { UsdtLogoIcon } from '../icons/usdt-logo';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { getUserRank } from '@/lib/ranks';
import { tierIcons, tierClassNames } from '@/lib/settings';
import { GridTradingAnimation } from './grid-trading-animation';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};

const useAnimatedCounter = (endValue: number, duration = 1000) => {
    const [count, setCount] = React.useState(0);
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    React.useEffect(() => {
        let frame = 0;
        const startValue = count;
        // Check if endValue is a valid number, otherwise default to startValue
        const validEndValue = isNaN(endValue) ? startValue : endValue;
        const increment = (validEndValue - startValue) / totalFrames;

        if (isNaN(increment)) {
            setCount(validEndValue);
            return;
        }

        const counter = setInterval(() => {
            frame++;
            const newCount = startValue + increment * frame;
            if (frame === totalFrames) {
                setCount(validEndValue);
                clearInterval(counter);
            } else {
                setCount(newCount);
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [endValue, duration, frameRate, totalFrames, count]);


    return count;
};


const StatCard = ({ label, value, valueIcon: ValueIcon, className, change }: { label: string; value: string; valueIcon?: React.ElementType, className?: string; change?: string }) => (
    <div className="stat-card">
        <div className="stat-label">{label}</div>
        <div className={cn("stat-value flex items-center gap-2", className)}>
            {ValueIcon && <ValueIcon className="h-5 w-5" />}
            <span>{value}</span>
            {change && <span className={cn("text-xs ml-2", change.startsWith('+') ? 'text-green-400' : 'text-red-400')}>{change}</span>}
        </div>
    </div>
);

const HistoryItem = ({ log, time, amount }: { log: string; time: string, amount?: number }) => (
    <div className="order-item">
        <div className="flex-1 text-white flex items-center gap-2">{log}</div>
        {amount && (
             <div className="flex items-center gap-1.5 font-bold [text-shadow:0_0_8px_rgba(16,185,129,0.3)] text-emerald-400">
                <UsdtLogoIcon className="h-4 w-4" />
                <span>+${amount.toFixed(2)}</span>
            </div>
        )}
        <div className="order-time">{time}</div>
    </div>
);

const PerformanceItem = ({ label, value, className }: { label: string; value: string; className?: string }) => (
    <div className="performance-item">
        <div className="performance-label">{label}</div>
        <div className={cn("performance-value", className)}>{value}</div>
    </div>
)

const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


export function ProTraderView() {
    const [walletData, setWalletData] = React.useState<WalletData | null>(null);
    const [currentTier, setCurrentTier] = React.useState<TierData | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [displayBalance, setDisplayBalance] = React.useState(0);
    const { user } = useUser();
    const { toast } = useToast();
    const { state: simState, setBotLog } = useTradingBot({ initialPrice: 68000 });
    const [minGridBalance, setMinGridBalance] = React.useState(0);
    
    const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const animatedBalance = useAnimatedCounter(displayBalance);
    const animatedDailyEarnings = useAnimatedCounter(walletData?.growth?.dailyEarnings ?? 0);
    
    React.useEffect(() => {
        async function fetchBotSettings() {
          try {
            const response = await fetch('/api/public-settings?key=botSettings');
            if (response.ok) {
              const data = await response.json();
              if (data && data.minGridBalance !== undefined) {
                setMinGridBalance(data.minGridBalance);
              }
            }
          } catch (error) {
            console.error("Could not fetch bot settings, using default.", error);
          }
        }
        fetchBotSettings();
    }, []);

    const fetchAndSetData = React.useCallback(async () => {
        if (user) {
            const [wallet, tiers] = await Promise.all([getOrCreateWallet(), getBotTierSettings()]);
            setWalletData(wallet);
            if (!isAnimating) {
                setDisplayBalance(wallet.balances?.usdt ?? 0);
            }
            const tier = await getCurrentTier(wallet.balances?.usdt ?? 0, tiers);
            setCurrentTier(tier);
        }
    }, [user, isAnimating]);

    React.useEffect(() => {
        fetchAndSetData();
    }, [fetchAndSetData]);
    
    const handleWalletUpdate = async (newData: WalletData) => {
        if (user?.id) {
            const updatedWallet = await updateWallet(newData);
            if (updatedWallet) {
                setWalletData(updatedWallet);
            }
            return updatedWallet;
        }
        return null;
    };
    
    const totalBalance = walletData?.balances?.usdt ?? 0;
    const totalTrades = walletData?.growth?.earningsHistory?.length ?? 0;
    
    const rank = getUserRank(totalBalance);
    const RankIcon = rankIcons[rank.Icon] || Lock;
    const TierIcon = currentTier ? tierIcons[currentTier.id] : null;
    const tierClassName = currentTier ? tierClassNames[currentTier.id] : null;

    const profitPerTrade = React.useMemo(() => {
        if (!currentTier) return 0;
        if (totalBalance > 0) {
            return (totalBalance * currentTier.dailyProfit) / currentTier.clicks;
        }
        return 0.05; 
    }, [totalBalance, currentTier]);
      
    const profitPercentagePerTrade = React.useMemo(() => {
        if (!currentTier) return 0;
        if (totalBalance > 0) {
            return (currentTier.dailyProfit / currentTier.clicks) * 100
        }
        return 0;
    }, [totalBalance, currentTier]);
    
    const gridsRemaining = walletData?.growth?.clicksLeft ?? 0;
    const canStart = gridsRemaining > 0 && !isAnimating && totalBalance >= minGridBalance;

    const handleStartBot = async () => {
        if (!walletData) return;

        if (totalBalance < minGridBalance) {
            // This case will be handled by the alert, but as a safeguard.
            return;
        }
    
        if (gridsRemaining <= 0 || isAnimating) {
          toast({
            title: isAnimating ? "Bot is already running" : "Limit Reached",
            description: gridsRemaining <= 0 ? "You have no grids remaining for today." : "Please wait for the current session to complete.",
            variant: "destructive"
          });
          return;
        }

        if (!currentTier) {
            toast({
                title: "Tier Not Found",
                description: "Could not determine your trading tier.",
                variant: "destructive"
            });
            return;
        }
    
        setIsAnimating(true);
        setBotLog([]);
        setProgress(0);
        setDisplayBalance(0);

        const animationDuration = 60000;
        const updateInterval = 100;
        const progressIncrement = 100 / (animationDuration / updateInterval);
        
        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => Math.min(prev + progressIncrement, 100));
        }, updateInterval);

        setTimeout(async () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            const usdtEarnings = profitPerTrade;
            const newEarning = { amount: usdtEarnings, timestamp: Date.now() };
    
            const newWalletData: WalletData = {
              ...walletData,
              balances: {
                ...walletData.balances,
                usdt: totalBalance + usdtEarnings,
              },
              growth: {
                ...walletData.growth,
                clicksLeft: gridsRemaining - 1,
                dailyEarnings: (walletData.growth.dailyEarnings || 0) + usdtEarnings,
                earningsHistory: [...(walletData.growth.earningsHistory || []), newEarning],
              },
            };
    
            const updatedWallet = await handleWalletUpdate(newWalletData);
    
            toast({
              title: "Trade Successful!",
              description: `You've earned ${formatCurrency(usdtEarnings)}.`,
            });
            
            setBotLog(prev => [...prev, { message: `Profit`, time: new Date() }]);
            if(updatedWallet) {
                setDisplayBalance(updatedWallet.balances.usdt);
            }
            setIsAnimating(false);
            setProgress(0);
        }, animationDuration);
    };
    
    if (!walletData) {
        return (
             <div className="trading-card">
                 <Skeleton className="h-full w-full" />
             </div>
        )
    }

    const totalGrids = currentTier?.clicks ?? 0;
    const executedGrids = totalGrids - gridsRemaining;

    return (
        <div className="trading-card">
            <header className="header">
                <div className="logo flex-col !items-start">
                    CORE Nexus Quantum v3.76
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={cn("text-base py-1 px-2 flex items-center gap-1.5", rank.className)}>
                          <RankIcon className="h-5 w-5" />
                          <span>{rank.name}</span>
                        </Badge>
                        {currentTier && TierIcon && tierClassName && (
                          <Badge variant="outline" className={cn("text-base py-1 px-2 flex items-center gap-1.5", tierClassName)}>
                            <TierIcon className="h-5 w-5" />
                            <span>{currentTier.name}</span>
                          </Badge>
                        )}
                        <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700 hover:text-white -ml-2">
                           <Link href="/dashboard/trading-info">
                              <Trophy className="h-4 w-4 mr-2"/>
                              Tiers & Ranks
                           </Link>
                        </Button>
                    </div>
                </div>
                 <Button onClick={handleStartBot} disabled={!canStart} size="lg" className={cn(!canStart && 'bg-gray-500 hover:bg-gray-500', canStart && 'bg-green-600 hover:bg-green-700')}>
                    {isAnimating ? (
                        <>
                            <Bot className="h-5 w-5 mr-2 animate-pulse"/>
                            <span>Bot is Running...</span>
                        </>
                    ) : canStart ? (
                        <>
                            <PlayCircle className="h-5 w-5 mr-2" />
                            <span>Start Bot</span>
                        </>
                    ) : (
                         <>
                            <Lock className="h-5 w-5 mr-2"/>
                            <span>Offline</span>
                         </>
                    )}
                </Button>
            </header>

            {totalBalance < minGridBalance && (
                <Alert className="mb-6">
                    <Wallet className="h-4 w-4" />
                    <AlertTitle>Insufficient Balance</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <div>
                           You need at least {formatCurrency(minGridBalance)} to start the bot.
                        </div>
                        <Button asChild size="sm">
                            <Link href="/dashboard/deposit">Deposit Funds</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <section className="content-grid">
                <div className="chart-section">
                    <div className="flex justify-between items-center mb-4">
                         {isAnimating ? (
                            <div className="flex items-center gap-2 text-emerald-400">
                                <div className="status-indicator bg-green-400 animate-pulse"></div>
                                🤖 ONLINE
                                <span className="text-xs tabular-nums">({progress.toFixed(0)}%)</span>
                            </div>
                        ) : (
                             <div className={cn("flex items-center gap-2 text-sm", gridsRemaining > 0 ? "text-slate-400" : "text-red-400")}>
                                <div className={cn("status-indicator", gridsRemaining > 0 ? "bg-slate-400" : "bg-red-400 animate-pulse")}></div>
                                🤖 OFFLINE
                            </div>
                        )}
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700 hover:text-white">
                            <SlidersHorizontal className="h-4 w-4 mr-2"/>
                            Indicators
                        </Button>
                    </div>
                    <div className="chart-container">
                        <GridTradingAnimation totalBalance={totalBalance} profitPerTrade={profitPerTrade} profitPercentage={profitPercentagePerTrade} setBotLog={setBotLog} isAnimating={isAnimating} candlestickData={simState.candlestickData} currentPrice={simState.currentPrice} />
                    </div>
                     <div className="price-display">
                        <div className="price-info">
                             <UsdtLogoIcon className="h-8 w-8" />
                            <div className="price-value">{formatCurrency(animatedBalance)}</div>
                        </div>
                        <div className="volume-info">
                            Vol: {simState.volume24h.toLocaleString()}M
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard label="Balance" value={formatCurrency(animatedBalance)} valueIcon={UsdtLogoIcon}/>
                        <StatCard label="Today's Earnings" value={`${animatedDailyEarnings >= 0 ? '+' : ''}${formatCurrency(animatedDailyEarnings)}`} className={animatedDailyEarnings >= 0 ? "profit" : "loss"} />
                        <StatCard label="Grids Remaining" value={`${gridsRemaining}/${totalGrids}`} />
                        <StatCard label="Profit per Grid" value={`~${profitPercentagePerTrade.toFixed(4)}%`} />
                    </div>
                    <div className="performance-section">
                        <h3 className="section-header">🤖 Quantum Operation v3.76</h3>
                        <div className="performance-grid">
                            <PerformanceItem label="Win Rate" value={`${simState.winRate.toFixed(1)}%`} className="text-green-400"/>
                            <PerformanceItem label="Total Trades" value={totalTrades.toString()} />
                            <PerformanceItem label="Avg Trade" value={formatCurrency(profitPerTrade)} />
                            <PerformanceItem label="Max Drawdown" value={`${simState.maxDrawdown.toFixed(2)}%`} className="text-red-400"/>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bottom-stats">
                 <div className="order-history">
                    <h3 className="section-header">History</h3>
                     <div className="order-list">
                         {isAnimating ? (
                            simState.botLog.map((log, index) => (
                                <HistoryItem key={index} log={log.message} time={format(log.time, 'HH:mm:ss')} />
                            ))
                         ) : (
                             walletData.growth.earningsHistory.slice(-10).reverse().map((trade, index) => (
                                 <HistoryItem key={trade.timestamp} log={`Grid Profit`} time={format(new Date(trade.timestamp), 'HH:mm:ss')} amount={trade.amount}/>
                             ))
                         )}
                     </div>
                 </div>
                 <div className="order-history">
                     <h3 className="section-header">Operation Status</h3>
                     <div className="order-list">
                        {[...Array(totalGrids)].map((_, i) => (
                           <div className="order-item" key={i}>
                                <div className={cn("font-bold text-white")}>
                                    Operation status 🤖 {i + 1}
                                </div>
                                <Badge variant={i < executedGrids ? "default" : "secondary"} className={cn(i < executedGrids ? "bg-green-600/80" : "bg-slate-600/80")}>
                                    {i < executedGrids ? 'Executed' : 'Pending'}
                                </Badge>
                                <div className="order-time">
                                    { i < executedGrids && walletData.growth.earningsHistory[i] ? format(new Date(walletData.growth.earningsHistory[i].timestamp), 'HH:mm:ss') : '--:--:--'}
                                </div>
                           </div>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
    );
}
