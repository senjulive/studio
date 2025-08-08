"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CandlestickData } from '@/hooks/use-trading-bot';
import { TrendingUp, TrendingDown, DollarSign, Activity, Target } from 'lucide-react';

type TradingOrder = {
    id: number;
    type: 'buy' | 'sell';
    price: number;
    x: number;
    y: number;
    timestamp: number;
    amount: number;
    filled?: boolean;
};

type GridLevel = {
    price: number;
    type: 'buy' | 'sell';
    active: boolean;
    filled: boolean;
};

type TradingIndicators = {
    rsi: number;
    macd: number;
    volume: number;
    volatility: number;
};

interface TradingChartAnimationProps {
    totalBalance: number;
    profitPerTrade: number;
    profitPercentage: number;
    setBotLog: React.Dispatch<React.SetStateAction<{ message: string; time: Date; }[]>>;
    isAnimating: boolean;
    candlestickData: CandlestickData[];
    currentPrice: number;
}

export function TradingChartAnimation({
    totalBalance,
    profitPerTrade,
    profitPercentage,
    setBotLog,
    isAnimating,
    candlestickData,
    currentPrice
}: TradingChartAnimationProps) {
    const [orders, setOrders] = useState<TradingOrder[]>([]);
    const [gridLevels, setGridLevels] = useState<GridLevel[]>([]);
    const [indicators, setIndicators] = useState<TradingIndicators>({
        rsi: 50,
        macd: 0,
        volume: 1000000,
        volatility: 2.5
    });
    const [lastPrice, setLastPrice] = useState(currentPrice);
    const [priceChange, setPriceChange] = useState(0);
    const chartRef = useRef<HTMLDivElement>(null);
    const [visibleCandles, setVisibleCandles] = useState(30);

    const orderId = useRef(0);

    // Calculate price statistics
    const priceStats = useMemo(() => {
        if (!candlestickData?.length) return null;
        
        const prices = candlestickData.map(c => c.close);
        const high24h = Math.max(...candlestickData.map(c => c.high));
        const low24h = Math.min(...candlestickData.map(c => c.low));
        const volume24h = candlestickData.reduce((sum, c) => sum + (c.high * 100000), 0);
        
        return {
            high24h,
            low24h,
            volume24h,
            change24h: ((currentPrice - prices[0]) / prices[0]) * 100
        };
    }, [candlestickData, currentPrice]);

    // Initialize grid trading levels
    useEffect(() => {
        if (!isAnimating || !currentPrice) return;

        const gridSpacing = currentPrice * 0.005; // 0.5% spacing
        const numLevels = 10;
        const newGridLevels: GridLevel[] = [];

        for (let i = 0; i < numLevels; i++) {
            // Buy levels below current price
            newGridLevels.push({
                price: currentPrice - (gridSpacing * (i + 1)),
                type: 'buy',
                active: true,
                filled: false
            });
            
            // Sell levels above current price
            newGridLevels.push({
                price: currentPrice + (gridSpacing * (i + 1)),
                type: 'sell',
                active: true,
                filled: false
            });
        }

        setGridLevels(newGridLevels);
    }, [isAnimating, currentPrice]);

    // Track price changes and trigger orders
    useEffect(() => {
        if (!isAnimating) {
            setOrders([]);
            return;
        }

        const change = currentPrice - lastPrice;
        setPriceChange(change);
        setLastPrice(currentPrice);

        // Check for grid level hits and create orders
        const triggeredLevels = gridLevels.filter(level => {
            if (level.filled) return false;
            
            if (level.type === 'buy' && currentPrice <= level.price && lastPrice > level.price) {
                return true;
            }
            if (level.type === 'sell' && currentPrice >= level.price && lastPrice < level.price) {
                return true;
            }
            return false;
        });

        triggeredLevels.forEach(level => {
            const chartRect = chartRef.current?.getBoundingClientRect();
            if (!chartRect) return;

            const x = Math.random() * 80 + 10; // Random X position
            const y = getYPosition(level.price, chartRect.height);

            const newOrder: TradingOrder = {
                id: orderId.current++,
                type: level.type,
                price: level.price,
                x,
                y: (y / chartRect.height) * 100,
                timestamp: Date.now(),
                amount: profitPerTrade,
                filled: false
            };

            setOrders(prev => [...prev, newOrder]);

            // Mark level as filled
            setGridLevels(prev => prev.map(l => 
                l.price === level.price && l.type === level.type 
                    ? { ...l, filled: true }
                    : l
            ));

            // Add to bot log
            setBotLog(prev => [...prev, {
                message: `${level.type.toUpperCase()} order executed at $${level.price.toFixed(2)}`,
                time: new Date()
            }]);

            // Remove order after animation
            setTimeout(() => {
                setOrders(prev => prev.filter(o => o.id !== newOrder.id));
            }, 3000);
        });

        // Update indicators
        setIndicators(prev => ({
            rsi: Math.max(0, Math.min(100, prev.rsi + (Math.random() - 0.5) * 5)),
            macd: prev.macd + (Math.random() - 0.5) * 0.2,
            volume: prev.volume * (1 + (Math.random() - 0.5) * 0.1),
            volatility: Math.max(0.5, Math.min(10, prev.volatility + (Math.random() - 0.5) * 0.5))
        }));

    }, [currentPrice, lastPrice, isAnimating, gridLevels, profitPerTrade, setBotLog]);

    const getYPosition = (price: number, chartHeight: number) => {
        if (!candlestickData?.length) return chartHeight / 2;
        
        const visibleData = candlestickData.slice(-visibleCandles);
        const prices = visibleData.map(d => [d.high, d.low]).flat();
        const minPrice = Math.min(...prices, currentPrice);
        const maxPrice = Math.max(...prices, currentPrice);
        const priceRange = maxPrice - minPrice;
        
        if (priceRange === 0) return chartHeight / 2;
        return chartHeight - ((price - minPrice) / priceRange) * chartHeight * 0.8 - chartHeight * 0.1;
    };

    const renderCandlesticks = () => {
        if (!candlestickData?.length) return null;
        
        const visibleData = candlestickData.slice(-visibleCandles);
        const chartRect = chartRef.current?.getBoundingClientRect();
        if (!chartRect) return null;

        const candleWidth = (chartRect.width * 0.8) / visibleData.length;
        const chartHeight = chartRect.height;

        return visibleData.map((candle, index) => {
            const x = (index / visibleData.length) * 80 + 10; // 10% margin on each side
            const candleTop = getYPosition(candle.high, chartHeight);
            const candleBottom = getYPosition(candle.low, chartHeight);
            const bodyTop = getYPosition(Math.max(candle.open, candle.close), chartHeight);
            const bodyBottom = getYPosition(Math.min(candle.open, candle.close), chartHeight);
            const isBullish = candle.close >= candle.open;
            const bodyHeight = Math.max(bodyBottom - bodyTop, 2);

            return (
                <motion.div
                    key={`${candle.timestamp}-${index}`}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                    className="absolute"
                    style={{ 
                        left: `${x}%`, 
                        width: `${Math.max(candleWidth - 2, 2)}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {/* Wick */}
                    <div 
                        className="absolute bg-gray-400 mx-auto"
                        style={{ 
                            top: `${candleTop}px`,
                            height: `${Math.max(candleBottom - candleTop, 1)}px`,
                            width: '2px',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    />
                    
                    {/* Body */}
                    <motion.div
                        className={cn(
                            "absolute mx-auto rounded-sm",
                            isBullish 
                                ? "bg-green-500 border border-green-400" 
                                : "bg-red-500 border border-red-400"
                        )}
                        style={{
                            top: `${bodyTop}px`,
                            height: `${bodyHeight}px`,
                            width: `${Math.max(candleWidth - 4, 4)}px`,
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                    />
                </motion.div>
            );
        });
    };

    const renderGridLevels = () => {
        const chartRect = chartRef.current?.getBoundingClientRect();
        if (!chartRect || !isAnimating) return null;

        return gridLevels.map((level, index) => {
            const y = getYPosition(level.price, chartRect.height);
            
            return (
                <motion.div
                    key={`${level.type}-${level.price}-${index}`}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                        opacity: level.filled ? 0.3 : 0.7,
                        scaleX: 1 
                    }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                        "absolute w-full border-dashed border-l-0 border-r-0 border-t",
                        level.type === 'buy' 
                            ? "border-green-400/50" 
                            : "border-red-400/50"
                    )}
                    style={{ top: `${(y / chartRect.height) * 100}%` }}
                >
                    <div className={cn(
                        "absolute right-2 top-0 transform -translate-y-1/2 text-xs px-2 py-1 rounded",
                        level.type === 'buy'
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                    )}>
                        {level.type.toUpperCase()} ${level.price.toFixed(2)}
                    </div>
                </motion.div>
            );
        });
    };

    const renderOrders = () => {
        return (
            <AnimatePresence>
                {orders.map(order => (
                    <motion.div
                        key={order.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: [0, 1.2, 1],
                            opacity: [0, 1, 0.8]
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "absolute flex items-center justify-center rounded-full border-2 shadow-lg",
                            "w-8 h-8 text-xs font-bold z-20",
                            order.type === 'buy'
                                ? "bg-green-500 border-green-400 text-white"
                                : "bg-red-500 border-red-400 text-white"
                        )}
                        style={{
                            left: `${order.x}%`,
                            top: `${order.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {order.type === 'buy' ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        
                        {/* Ripple effect */}
                        <motion.div
                            className={cn(
                                "absolute inset-0 rounded-full border-2",
                                order.type === 'buy' ? "border-green-400" : "border-red-400"
                            )}
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        );
    };

    const renderCurrentPriceLine = () => {
        const chartRect = chartRef.current?.getBoundingClientRect();
        if (!chartRect) return null;

        const y = getYPosition(currentPrice, chartRect.height);
        const isPositive = priceChange >= 0;

        return (
            <motion.div
                className="absolute w-full z-10"
                style={{ top: `${(y / chartRect.height) * 100}%` }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <div className={cn(
                    "w-full border-t-2 border-dashed relative",
                    isPositive ? "border-green-400" : "border-red-400"
                )}>
                    <motion.div
                        className={cn(
                            "absolute right-0 top-0 transform -translate-y-1/2 px-3 py-1 rounded-l text-sm font-bold",
                            isPositive 
                                ? "bg-green-500 text-white" 
                                : "bg-red-500 text-white"
                        )}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ${currentPrice.toFixed(2)}
                        <span className="ml-2 text-xs">
                            {isPositive ? '↗' : '↘'} {Math.abs(priceChange).toFixed(2)}
                        </span>
                    </motion.div>
                </div>
            </motion.div>
        );
    };

    if (!candlestickData?.length) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
                <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400">Loading market data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-lg border border-gray-700">
            {/* Chart Header */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex justify-between items-start text-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold">BTC/USDT</span>
                            <span className={cn(
                                "px-2 py-1 rounded text-xs font-semibold",
                                priceChange >= 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                            )}>
                                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
                            </span>
                        </div>
                        {priceStats && (
                            <div className="flex gap-4 text-xs text-gray-400">
                                <span>24h High: ${priceStats.high24h.toFixed(2)}</span>
                                <span>24h Low: ${priceStats.low24h.toFixed(2)}</span>
                                <span>Volume: {(priceStats.volume24h / 1000000).toFixed(1)}M</span>
                            </div>
                        )}
                    </div>
                    
                    {isAnimating && (
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-green-400 text-xs font-semibold">GRID ACTIVE</span>
                            </div>
                            <div className="text-xs text-gray-400">
                                RSI: {indicators.rsi.toFixed(1)} | Vol: {indicators.volatility.toFixed(1)}%
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chart Area */}
            <div 
                ref={chartRef}
                className="absolute inset-0 pt-16 pb-4"
            >
                {/* Background Grid */}
                <div className="absolute inset-0">
                    {[20, 40, 60, 80].map((top, i) => (
                        <div 
                            key={i}
                            className="absolute w-full border-t border-gray-700/30"
                            style={{ top: `${top}%` }}
                        />
                    ))}
                    {[20, 40, 60, 80].map((left, i) => (
                        <div 
                            key={i}
                            className="absolute h-full border-l border-gray-700/30"
                            style={{ left: `${left}%` }}
                        />
                    ))}
                </div>

                {/* Grid Trading Levels */}
                {renderGridLevels()}

                {/* Candlesticks */}
                {renderCandlesticks()}

                {/* Current Price Line */}
                {renderCurrentPriceLine()}

                {/* Trading Orders */}
                {renderOrders()}

                {/* Volume Bars at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-around px-4">
                    {candlestickData.slice(-visibleCandles).map((candle, index) => {
                        const volume = (candle.high - candle.low) * 100000; // Simulated volume
                        const maxVolume = Math.max(...candlestickData.slice(-visibleCandles).map(c => (c.high - c.low) * 100000));
                        const height = (volume / maxVolume) * 60;
                        const isBullish = candle.close >= candle.open;
                        
                        return (
                            <motion.div
                                key={index}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: index * 0.02, duration: 0.3 }}
                                className={cn(
                                    "w-1 rounded-t",
                                    isBullish ? "bg-green-400/50" : "bg-red-400/50"
                                )}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Trading Status Overlay */}
            {isAnimating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white">
                        Grid Trading • {gridLevels.filter(g => g.filled).length} orders filled
                    </span>
                </motion.div>
            )}
        </div>
    );
}
