
'use client';

import * as React from 'react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, PlayCircle, Bot, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { useTradingBot } from '@/hooks/use-trading-bot';
import { getOrCreateWallet, updateWallet, type WalletData } from '@/lib/wallet';
import { useUser } from '@/contexts/UserContext';
import { type TierSetting as TierData, getCurrentTier, getBotTierSettings } from '@/lib/tiers';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { UsdtLogoIcon } from '../icons/usdt-logo';
import { format } from 'date-fns';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { getUserRank } from '@/lib/ranks';
import { tierIcons, tierClassNames } from '@/lib/settings';
import { GridTradingAnimation } from './grid-trading-animation';

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

const StatCard = ({ label, value, className, change }: { label: string; value: string; className?: string; change?: string }) => (
    <div className="stat-card">
        <div className="stat-label">{label}</div>
        <div className={cn("stat-value", className)}>
            {value}
            {change && <span className={cn("text-xs ml-2", change.startsWith('+') ? 'text-green-400' : 'text-red-400')}>{change}</span>}
        </div>
    </div>
);

const HistoryItem = ({ log, time }: { log: string; time: string }) => (
    <div className="order-item">
        <div className="flex-1 text-white flex items-center gap-2">{log}</div>
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
    const [tierSettings, setTierSettings] = React.useState<TierData[]>([]);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [displayBalance, setDisplayBalance] = React.useState(0);
    const { user } = useUser();
    const { toast } = useToast();
    const { state: simState, setBotLog } = useTradingBot({ initialPrice: 68000 });
    
    const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const fetchAndSetData = React.useCallback(async () => {
        if (user) {
            const [wallet, tiers] = await Promise.all([getOrCreateWallet(), getBotTierSettings()]);
            setWalletData(wallet);
            setDisplayBalance(wallet.balances?.usdt ?? 0);
            setTierSettings(tiers);
        }
    }, [user]);

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
    const dailyEarnings = walletData?.growth?.dailyEarnings ?? 0;
    const gridsRemaining = walletData?.growth?.clicksLeft ?? 0;
    const totalTrades = walletData?.growth?.earningsHistory?.length ?? 0;
    
    const currentTier = getCurrentTier(totalBalance, tierSettings);
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
    
    const canStart = gridsRemaining > 0 && !isAnimating;

    const handleStartBot = async () => {
        if (!canStart || !currentTier || !walletData) {
          toast({
            title: canStart ? "Cannot Start Bot" : "Limit Reached",
            description: gridsRemaining <= 0 ? "You have no grids remaining for today." : "Bot cannot be started at this time.",
            variant: "destructive"
          });
          return;
        }
    
        setIsAnimating(true);
        setBotLog([]);
        setProgress(0);
        setDisplayBalance(0);

        const animationDuration = 60000; // 60 seconds
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
                dailyEarnings: dailyEarnings + usdtEarnings,
                earningsHistory: [...(walletData.growth.earningsHistory || []), newEarning],
              },
            };
    
            const updatedWallet = await handleWalletUpdate(newWalletData);
    
            toast({
              title: "Trade Successful!",
              description: `You've earned ${formatCurrency(usdtEarnings)}.`,
            });
            
            setBotLog(prev => [...prev, { message: `Profit: +${formatCurrency(usdtEarnings)}`, time: new Date() }]);
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
                    Grid Trading Bot
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

            <section className="content-grid">
                <div className="chart-section">
                    <div className="flex justify-between items-center mb-4">
                         {isAnimating ? (
                            <div className="bot-status !bg-emerald-500/20">
                                <div className="status-indicator"></div>
                                ONLINE
                                <span className="text-xs tabular-nums">({progress.toFixed(0)}%)</span>
                            </div>
                        ) : (
                             <div className={cn("bot-status", gridsRemaining > 0 ? "!bg-slate-500/20" : "!bg-red-500/20")}>
                                <div className={cn("status-indicator", gridsRemaining > 0 ? "!bg-slate-400" : "!bg-red-400")}></div>
                                OFFLINE
                            </div>
                        )}
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700 hover:text-white">
                            <SlidersHorizontal className="h-4 w-4 mr-2"/>
                            Indicators
                        </Button>
                    </div>
                    <div className="chart-container">
                        <GridTradingAnimation totalBalance={totalBalance} profitPerTrade={profitPerTrade} profitPercentage={profitPercentagePerTrade} />
                        {isAnimating && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                                <Progress value={progress} className="w-1/2 h-2 bg-slate-700" />
                            </div>
                        )}
                    </div>
                     <div className="price-display">
                        <div className="price-info">
                             <UsdtLogoIcon className="h-8 w-8" />
                            <div className="price-value">{formatCurrency(displayBalance)}</div>
                        </div>
                        <div className="volume-info">
                            Vol: {simState.volume24h.toLocaleString()}M
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard label="Portfolio Balance" value={formatCurrency(displayBalance)} />
                        <StatCard label="Today's Earnings" value={`${dailyEarnings >= 0 ? '+' : ''}${formatCurrency(dailyEarnings)}`} className={dailyEarnings >= 0 ? "profit" : "loss"} />
                        <StatCard label="Grids Remaining" value={`${gridsRemaining}/${totalGrids}`} />
                        <StatCard label="Profit per Grid" value={`~${profitPercentagePerTrade.toFixed(4)}%`} />
                    </div>
                    <div className="performance-section">
                        <h3 className="section-header">Performance Analytics</h3>
                        <div className="performance-grid">
                            <PerformanceItem label="Win Rate" value={`${simState.winRate.toFixed(1)}%`} className="text-green-400"/>
                            <PerformanceItem label="Avg Trade" value={formatCurrency(profitPerTrade)} />
                            <PerformanceItem label="Total Trades" value={totalTrades.toString()} />
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
                             walletData.growth.earningsHistory.slice(-10).reverse().map(trade => (
                                 <HistoryItem key={trade.timestamp} log={`Grid Profit: +${formatCurrency(trade.amount)}`} time={format(new Date(trade.timestamp), 'HH:mm:ss')} />
                             ))
                         )}
                     </div>
                 </div>
                 <div className="order-history">
                     <h3 className="section-header">Grid Start Times</h3>
                     <div className="order-list">
                        {[...Array(totalGrids)].map((_, i) => (
                           <div className="order-item" key={i}>
                                <div className={cn("font-bold text-white")}>
                                    Grid #{i + 1}
                                </div>
                                <div className={cn(i < executedGrids ? "text-slate-500" : "text-white")}>
                                     {i < executedGrids ? 'Executed' : 'Pending'}
                                </div>
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
