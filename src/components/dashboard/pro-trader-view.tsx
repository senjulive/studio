'use client';

import * as React from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  SlidersHorizontal, 
  PlayCircle, 
  Bot, 
  Lock, 
  Trophy, 
  Wallet, 
  TrendingUp,
  Activity,
  Zap,
  DollarSign,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { useTradingBot } from '@/hooks/use-trading-bot';
import { getOrCreateWallet, updateWallet, type WalletData } from '@/lib/wallet';
import { useUser } from '@/contexts/UserContext';
import { type TierSetting as TierData, getBotTierSettings } from '@/lib/tiers';
import { getCurrentTier } from '@/lib/ranks';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { UsdtLogoIcon } from '../icons/usdt-logo';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { getUserRank } from '@/lib/ranks';
import { tierIcons, tierClassNames } from '@/lib/settings';
import { TradingChartAnimation } from './trading-chart-animation';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

const rankIcons: Record<string, React.ElementType> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};

// Enhanced animated counter with smooth transitions
const useAnimatedCounter = (endValue: number, duration = 2000) => {
    const [count, setCount] = React.useState(0);
    const spring = useSpring(endValue, { stiffness: 100, damping: 30 });
    
    React.useEffect(() => {
        const unsubscribe = spring.onChange((latest) => {
            setCount(latest);
        });
        return unsubscribe;
    }, [spring]);

    React.useEffect(() => {
        spring.set(endValue);
    }, [endValue, spring]);

    return count;
};

// Animated metric card with hover effects
const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    suffix = '', 
    color = 'text-primary',
    trend,
    delay = 0
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    suffix?: string;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
    delay?: number;
}) => {
    const trendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;
    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative group"
        >
            <Card className="glass-card border-0 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Icon className={cn("h-5 w-5", color)} />
                        {trendIcon && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: delay + 0.3 }}
                            >
                                {React.createElement(trendIcon, { 
                                    className: cn("h-4 w-4", trendColor) 
                                })}
                            </motion.div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">{label}</p>
                        <motion.p 
                            className="text-lg font-bold text-foreground"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.2, type: 'spring' }}
                        >
                            {value}{suffix}
                        </motion.p>
                    </div>
                </CardContent>
                
                {/* Hover glow effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                />
            </Card>
        </motion.div>
    );
};

// Status indicator with pulse animation
const StatusIndicator = ({ status, progress }: { status: 'online' | 'offline' | 'running'; progress?: number }) => {
    const statusConfig = {
        online: { color: 'bg-green-400', text: 'ONLINE', icon: Activity },
        offline: { color: 'bg-red-400', text: 'OFFLINE', icon: Lock },
        running: { color: 'bg-blue-400', text: 'RUNNING', icon: Bot }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <motion.div
                    className={cn("w-3 h-3 rounded-full", config.color)}
                    animate={status === 'running' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                {status === 'running' && (
                    <motion.div
                        className={cn("absolute inset-0 w-3 h-3 rounded-full", config.color, "opacity-30")}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{config.text}</span>
                {progress !== undefined && (
                    <span className="text-xs tabular-nums text-muted-foreground">
                        ({progress.toFixed(0)}%)
                    </span>
                )}
            </div>
        </motion.div>
    );
};

// Enhanced trading button with loading states
const TradingButton = ({ 
    canStart, 
    isAnimating, 
    onStart, 
    gridsRemaining 
}: {
    canStart: boolean;
    isAnimating: boolean;
    onStart: () => void;
    gridsRemaining: number;
}) => {
    const buttonVariants = {
        idle: { scale: 1, boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        hover: { scale: 1.05, boxShadow: '0 0 20px 0 rgba(34, 197, 94, 0.3)' },
        tap: { scale: 0.95 },
        running: { 
            scale: 1,
            boxShadow: '0 0 30px 0 rgba(59, 130, 246, 0.5)',
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
        }
    };

    return (
        <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover={canStart ? "hover" : "idle"}
            whileTap={canStart ? "tap" : "idle"}
            animate={isAnimating ? "running" : "idle"}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Button
                onClick={onStart}
                disabled={!canStart}
                size="lg"
                className={cn(
                    "relative overflow-hidden font-semibold text-base px-8 py-3 rounded-xl",
                    !canStart && 'opacity-50 cursor-not-allowed',
                    canStart && !isAnimating && 'bg-green-600 hover:bg-green-700 border-green-500',
                    isAnimating && 'bg-blue-600 hover:bg-blue-700 border-blue-500'
                )}
            >
                <AnimatePresence mode="wait">
                    {isAnimating ? (
                        <motion.div
                            key="running"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Bot className="h-5 w-5" />
                            </motion.div>
                            <span>Bot Running...</span>
                        </motion.div>
                    ) : canStart ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2"
                        >
                            <PlayCircle className="h-5 w-5" />
                            <span>Start Trading</span>
                            <Sparkles className="h-4 w-4" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="offline"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2"
                        >
                            <Lock className="h-5 w-5" />
                            <span>Offline</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Shine effect on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full"
                    whileHover={{ translateX: '200%' }}
                    transition={{ duration: 0.6 }}
                />
            </Button>
        </motion.div>
    );
};

const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

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

    const animatedBalance = useAnimatedCounter(displayBalance, 1500);
    const animatedDailyEarnings = useAnimatedCounter(walletData?.growth?.dailyEarnings ?? 0, 1200);
    
    // Fetch bot settings
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
            const tier = getCurrentTier(wallet.balances?.usdt ?? 0, tiers);
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
            <motion.div 
                className="max-w-7xl mx-auto p-6 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Skeleton className="h-full w-full min-h-[600px] rounded-3xl" />
            </motion.div>
        )
    }

    const totalGrids = currentTier?.clicks ?? 0;
    const executedGrids = totalGrids - gridsRemaining;

    return (
        <motion.div 
            className="max-w-7xl mx-auto p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <Card className="glass-card border-0 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Bot className="h-8 w-8 text-primary" />
                                    </motion.div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                            CORE Nexus Quantum v3.76
                                        </CardTitle>
                                        <p className="text-muted-foreground">Advanced AI Trading System</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className={cn("text-sm py-1 px-3 flex items-center gap-2", rank.className)}>
                                        <RankIcon className="h-4 w-4" />
                                        <span>{rank.name}</span>
                                    </Badge>
                                    {currentTier && TierIcon && tierClassName && (
                                        <Badge variant="outline" className={cn("text-sm py-1 px-3 flex items-center gap-2", tierClassName)}>
                                            <TierIcon className="h-4 w-4" />
                                            <span>{currentTier.name}</span>
                                        </Badge>
                                    )}
                                    <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                        <Link href="/dashboard/trading-info" className="flex items-center gap-2">
                                            <Trophy className="h-4 w-4"/>
                                            Tiers & Ranks
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <StatusIndicator 
                                    status={isAnimating ? 'running' : (canStart ? 'online' : 'offline')} 
                                    progress={isAnimating ? progress : undefined}
                                />
                                <TradingButton
                                    canStart={canStart}
                                    isAnimating={isAnimating}
                                    onStart={handleStartBot}
                                    gridsRemaining={gridsRemaining}
                                />
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Insufficient Balance Alert */}
            {totalBalance < minGridBalance && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Alert className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <Wallet className="h-5 w-5 text-yellow-600" />
                        <AlertTitle className="text-yellow-800 dark:text-yellow-200">Insufficient Balance</AlertTitle>
                        <AlertDescription className="flex items-center justify-between text-yellow-700 dark:text-yellow-300">
                            <div>
                               You need at least {formatCurrency(minGridBalance)} to start the bot.
                            </div>
                            <Button asChild size="sm" className="ml-4">
                                <Link href="/dashboard/deposit">Deposit Funds</Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {/* Progress Bar */}
            {isAnimating && (
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="glass-card border-0">
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Trading Progress</span>
                                    <span className="font-medium">{progress.toFixed(1)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <motion.div
                    className="lg:col-span-2 space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Card className="glass-card border-0 overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    Trading Chart
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                    <Settings className="h-4 w-4 mr-2"/>
                                    Indicators
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-video relative overflow-hidden">
                                <TradingChartAnimation
                                    totalBalance={totalBalance}
                                    profitPerTrade={profitPerTrade}
                                    profitPercentage={profitPercentagePerTrade}
                                    setBotLog={setBotLog}
                                    isAnimating={isAnimating}
                                    candlestickData={simState.candlestickData}
                                    currentPrice={simState.currentPrice}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Display */}
                    <Card className="glass-card border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UsdtLogoIcon className="h-8 w-8" />
                                    <div>
                                        <motion.div 
                                            className="text-2xl font-bold"
                                            key={animatedBalance}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            {formatCurrency(animatedBalance)}
                                        </motion.div>
                                        <p className="text-sm text-muted-foreground">Portfolio Balance</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">24h Volume</div>
                                    <div className="font-semibold">{simState.volume24h.toLocaleString()}M</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard
                            icon={DollarSign}
                            label="Balance"
                            value={formatCurrency(animatedBalance)}
                            color="text-green-500"
                            trend="up"
                            delay={0.1}
                        />
                        <MetricCard
                            icon={TrendingUp}
                            label="Today's Earnings"
                            value={`${animatedDailyEarnings >= 0 ? '+' : ''}${formatCurrency(animatedDailyEarnings)}`}
                            color={animatedDailyEarnings >= 0 ? "text-green-500" : "text-red-500"}
                            trend={animatedDailyEarnings >= 0 ? "up" : "down"}
                            delay={0.2}
                        />
                        <MetricCard
                            icon={Target}
                            label="Grids Remaining"
                            value={`${gridsRemaining}/${totalGrids}`}
                            color="text-blue-500"
                            delay={0.3}
                        />
                        <MetricCard
                            icon={Zap}
                            label="Profit per Grid"
                            value={`~${profitPercentagePerTrade.toFixed(4)}`}
                            suffix="%"
                            color="text-purple-500"
                            delay={0.4}
                        />
                    </div>

                    {/* Performance Stats */}
                    <Card className="glass-card border-0">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Performance Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Win Rate</span>
                                <span className="font-semibold text-green-400">{simState.winRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Trades</span>
                                <span className="font-semibold">{totalTrades}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Avg Trade</span>
                                <span className="font-semibold">{formatCurrency(profitPerTrade)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Max Drawdown</span>
                                <span className="font-semibold text-red-400">{simState.maxDrawdown.toFixed(2)}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Section - History */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                {/* Trading History */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Trading History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            <AnimatePresence>
                                {isAnimating ? (
                                    simState.botLog.map((log, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                        >
                                            <span className="text-sm">{log.message}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(log.time, 'HH:mm:ss')}
                                            </span>
                                        </motion.div>
                                    ))
                                ) : (
                                    walletData.growth.earningsHistory.slice(-10).reverse().map((trade, index) => (
                                        <motion.div
                                            key={trade.timestamp}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                        >
                                            <span className="text-sm">Grid Profit</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-green-400">
                                                    +{formatCurrency(trade.amount)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(trade.timestamp), 'HH:mm:ss')}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>

                {/* Operation Status */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            Operation Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {[...Array(totalGrids)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                >
                                    <span className="text-sm font-medium">
                                        Operation Grid #{i + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Badge 
                                            variant={i < executedGrids ? "default" : "secondary"} 
                                            className={cn(
                                                "text-xs",
                                                i < executedGrids ? "bg-green-600/80 text-white" : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {i < executedGrids ? 'Executed' : 'Pending'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {i < executedGrids && walletData.growth.earningsHistory[i] 
                                                ? format(new Date(walletData.growth.earningsHistory[i].timestamp), 'HH:mm:ss') 
                                                : '--:--:--'
                                            }
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
