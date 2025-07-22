
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, PlayCircle, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { useTradingBot } from '@/hooks/use-trading-bot';
import type { CandlestickData } from '@/hooks/use-trading-bot';
import { getOrCreateWallet, updateWallet, type WalletData } from '@/lib/wallet';
import { useUser } from '@/contexts/UserContext';
import { type TierSetting as TierData, getCurrentTier, getBotTierSettings } from '@/lib/tiers';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { UsdtLogoIcon } from '../icons/usdt-logo';
import { format } from 'date-fns';

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
        <div className="flex-1">{log}</div>
        <div className="order-time">{time}</div>
    </div>
);


const PerformanceItem = ({ label, value, className }: { label: string; value: string; className?: string }) => (
    <div className="performance-item">
        <div className="performance-label">{label}</div>
        <div className={cn("performance-value", className)}>{value}</div>
    </div>
)

const CandlestickChart = ({ data, currentPrice }: { data: CandlestickData[], currentPrice: number }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const [minPrice, setMinPrice] = React.useState(0);
    const [maxPrice, setMaxPrice] = React.useState(0);
    const [chartHeight, setChartHeight] = React.useState(0);

    React.useEffect(() => {
        if (data.length > 0) {
            const prices = data.flatMap(d => [d.high, d.low]);
            setMinPrice(Math.min(...prices) * 0.999);
            setMaxPrice(Math.max(...prices) * 1.001);
        }
        if (chartRef.current) {
            setChartHeight(chartRef.current.clientHeight);
        }
    }, [data]);

    const getPriceY = (price: number) => {
        if (maxPrice === minPrice) return chartHeight / 2;
        return chartHeight * (1 - (price - minPrice) / (maxPrice - minPrice));
    };

    if (data.length === 0 || chartHeight === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500">Generating chart data...</div>;
    }
    
    const candleWidth = 8;
    const candleMargin = 4;
    const totalCandleWidth = candleWidth + candleMargin;

    return (
        <div ref={chartRef} className="w-full h-full relative">
            {/* Grid Lines */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="grid-line" style={{ top: `${(i + 1) * 20}%` }} />
            ))}
            
            {/* Candlesticks */}
            {data.map((candle, index) => {
                const isBullish = candle.close >= candle.open;
                const bodyTop = getPriceY(isBullish ? candle.close : candle.open);
                const bodyHeight = Math.abs(getPriceY(candle.close) - getPriceY(candle.open));
                const wickTop = getPriceY(candle.high);
                const wickHeight = Math.abs(getPriceY(candle.high) - getPriceY(candle.low));
                
                return (
                    <div key={index} className="candle" style={{ left: `${index * totalCandleWidth}px`, width: `${candleWidth}px` }}>
                        <div className="candle-wick" style={{ top: `${wickTop}px`, height: `${wickHeight}px` }} />
                        <div className={cn("candle-body", isBullish ? 'bullish' : 'bearish')} style={{ top: `${bodyTop}px`, height: `${Math.max(bodyHeight, 2)}px` }} />
                    </div>
                );
            })}

            {/* Current Price Line */}
            <div className="price-line" style={{ top: `${getPriceY(currentPrice)}px` }} data-price={formatCurrency(currentPrice)} />
        </div>
    );
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


export function ProTraderView() {
    const [activeChartTab, setActiveChartTab] = React.useState('Candlestick');
    const { state: simState, setBotLog } = useTradingBot({ initialPrice: 68000 });
    const [walletData, setWalletData] = React.useState<WalletData | null>(null);
    const [tierSettings, setTierSettings] = React.useState<TierData[]>([]);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const { user } = useUser();
    const { toast } = useToast();
    
    const [floaters, setFloaters] = React.useState<{ id: number; x: number; y: number; text: string; type: 'profit' | 'loss' }[]>([]);
    const chartContainerRef = React.useRef<HTMLDivElement>(null);
    const botLogIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            const [wallet, tiers] = await Promise.all([getOrCreateWallet(), getBotTierSettings()]);
            setWalletData(wallet);
            setTierSettings(tiers);
        }
        if (user) {
            fetchData();
        }
    }, [user]);
    
    const handleWalletUpdate = async (newData: WalletData) => {
        if (user?.id) {
            const updatedWallet = await updateWallet(newData);
            if (updatedWallet) {
                setWalletData(updatedWallet);
            }
        }
    };
    
    const totalBalance = walletData?.balances?.usdt ?? 0;
    const dailyEarnings = walletData?.growth?.dailyEarnings ?? 0;
    const gridsRemaining = walletData?.growth?.clicksLeft ?? 0;
    
    const currentTier = getCurrentTier(totalBalance, tierSettings);

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
          if (isAnimating) {
            toast({ title: "Bot is already running." });
          } else if (gridsRemaining <= 0) {
            toast({
              title: "Limit Reached",
              description: "You have no grids remaining for today.",
              variant: "destructive"
            });
          }
          return;
        }
    
        setIsAnimating(true);
        setBotLog([]);

        const logMessages = [
            "Connecting to Exchange...", "Authenticating API Keys...", "Fetching Market Data...", "Analyzing Market Volatility...",
            "Calculating Grid Levels...", "Placing Upper Grid Sell Orders...", "Placing Lower Grid Buy Orders...",
            "Monitoring Price Action...", "Executing Grid Trade...", "Finalizing Trade and Calculating Profit...", "Updating Portfolio..."
        ];

        let logIndex = 0;
        botLogIntervalRef.current = setInterval(() => {
            if (logIndex < logMessages.length) {
                setBotLog(prev => [...prev, { message: logMessages[logIndex], time: new Date() }]);
                logIndex++;
            } else {
                if(botLogIntervalRef.current) clearInterval(botLogIntervalRef.current);
            }
        }, 5000); // 5 seconds per log message for a ~60s total run
        
        setTimeout(() => {
            if (botLogIntervalRef.current) clearInterval(botLogIntervalRef.current);
            
            const usdtEarnings = profitPerTrade;
            
            const newEarning = { amount: usdtEarnings, timestamp: Date.now() };
    
            const newWalletData: WalletData = {
              ...walletData,
              balances: {
                ...walletData.balances,
                usdt: (walletData.balances?.usdt ?? 0) + usdtEarnings,
              },
              growth: {
                ...walletData.growth,
                clicksLeft: (walletData.growth?.clicksLeft ?? 1) - 1,
                dailyEarnings: (walletData.growth?.dailyEarnings ?? 0) + usdtEarnings,
                earningsHistory: [...(walletData.growth.earningsHistory || []), newEarning],
              },
            };
    
            handleWalletUpdate(newWalletData);
    
            toast({
              title: "Trade Successful!",
              description: `You've earned ${formatCurrency(usdtEarnings)}.`,
            });
            
            const chartRect = chartContainerRef.current?.getBoundingClientRect();
            if (chartRect) {
                const newFloater = {
                    id: Date.now(),
                    x: Math.random() * chartRect.width * 0.8 + chartRect.width * 0.1,
                    y: Math.random() * chartRect.height * 0.5 + chartRect.height * 0.2,
                    text: `+${formatCurrency(usdtEarnings)}`,
                    type: 'profit' as const
                };
                setFloaters(f => [...f, newFloater]);
                setTimeout(() => {
                    setFloaters(f => f.filter(fl => fl.id !== newFloater.id));
                }, 3000);
            }

            setIsAnimating(false);
        }, 60000); // Animation duration of 60 seconds
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
                <div className="logo">
                    Grid Trading Bot
                </div>
                <Button onClick={handleStartBot} disabled={!canStart || isAnimating} size="lg">
                    {isAnimating ? (
                        <>
                            <Bot className="h-5 w-5 mr-2 animate-pulse"/>
                            <span>Bot is Running...</span>
                        </>
                    ) : (
                        <>
                            <PlayCircle className="h-5 w-5 mr-2" />
                            <span>Start Bot</span>
                        </>
                    )}
                </Button>
            </header>

            <section className="content-grid">
                <div className="chart-section">
                    <div className="flex justify-between items-center mb-4">
                        <div className="chart-tabs">
                            {['Candlestick'].map(tab => (
                                <button key={tab} className={cn("chart-tab", activeChartTab === tab && "active")}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700 hover:text-white">
                            <SlidersHorizontal className="h-4 w-4 mr-2"/>
                            Indicators
                        </Button>
                    </div>
                    <div ref={chartContainerRef} className={cn("chart-container", simState.lastTrade?.type === 'buy' ? 'flash-green' : simState.lastTrade?.type === 'sell' ? 'flash-red' : '')}>
                         <CandlestickChart data={simState.candlestickData} currentPrice={simState.currentPrice} />
                         {floaters.map(f => (
                            <div key={f.id} className={cn(f.type === 'profit' ? 'profit-float' : 'loss-float')} style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                {f.text}
                            </div>
                        ))}
                    </div>
                     <div className="price-display">
                        <div className="price-info">
                             <UsdtLogoIcon className="h-8 w-8" />
                            <div className="price-value">{formatCurrency(totalBalance)}</div>
                        </div>
                        <div className="volume-info">
                            Vol: {simState.volume24h.toLocaleString()}M
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard label="Portfolio Balance" value={formatCurrency(totalBalance)} />
                        <StatCard label="Today's P&L" value={`${dailyEarnings >= 0 ? '+' : ''}${formatCurrency(dailyEarnings)}`} className={dailyEarnings >= 0 ? "profit" : "loss"} />
                        <StatCard label="Grids Remaining" value={`${gridsRemaining}/${totalGrids}`} />
                        <StatCard label="Profit per Grid" value={`~${profitPercentagePerTrade.toFixed(4)}%`} />
                    </div>
                    <div className="performance-section">
                        <h3 className="section-header">Performance Analytics</h3>
                        <div className="performance-grid">
                            <PerformanceItem label="Win Rate" value={`${simState.winRate.toFixed(1)}%`} className="text-green-400"/>
                            <PerformanceItem label="Avg Trade" value={formatCurrency(simState.avgTrade)} />
                            <PerformanceItem label="Max Drawdown" value={`${simState.maxDrawdown.toFixed(2)}%`} className="text-red-400"/>
                            <PerformanceItem label="Total Trades" value={simState.totalTrades.toString()} />
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
                                <HistoryItem key={trade.timestamp} log={`Grid Profit Executed`} time={format(new Date(trade.timestamp), 'PPpp')} />
                            ))
                        )}
                     </div>
                 </div>
                 <div className="order-history">
                     <h3 className="section-header">Open Orders</h3>
                     <div className="order-list">
                        {[...Array(totalGrids)].map((_, i) => (
                           <div className="order-item" key={i}>
                                <div className={cn("font-bold", i < executedGrids ? "text-slate-500" : "text-amber-400")}>
                                    Grid #{i + 1}
                                </div>
                                <div className={cn(i < executedGrids ? "text-slate-500" : "text-slate-300")}>
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
