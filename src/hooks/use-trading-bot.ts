
"use client";

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

type Order = {
    id: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
};

type Trade = Order & {
    time: string;
};

export type CandlestickData = {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp: number;
};


type BotState = {
    currentPrice: number;
    change24h: number;
    volume24h: number;
    openOrders: Order[];
    orderHistory: Trade[];
    lastTrade: Trade | null;
    candlestickData: CandlestickData[];
    // Simplified fields, real data comes from wallet
    winRate: number;
    avgTrade: number;
    maxDrawdown: number;
    totalTrades: number;
};

type BotConfig = {
    initialPrice: number;
};

const SIMULATION_CONFIG = {
    gridLevels: 5,
    gridSpread: 0.001,
    tradeAmount: 0.05
};

export function useTradingBot(config: BotConfig) {
    const [state, setState] = useState<BotState>({
        currentPrice: config.initialPrice,
        change24h: 0,
        volume24h: 847.23,
        openOrders: [],
        orderHistory: [],
        lastTrade: null,
        candlestickData: [],
        winRate: 84.2,
        avgTrade: 8.74,
        maxDrawdown: -1.8,
        totalTrades: 1247,
    });

    const createGrid = useCallback((price: number) => {
        const orders: Order[] = [];
        for (let i = 1; i <= SIMULATION_CONFIG.gridLevels; i++) {
            const buyPrice = price * (1 - SIMULATION_CONFIG.gridSpread * i);
            const sellPrice = price * (1 + SIMULATION_CONFIG.gridSpread * i);
            orders.push({ id: `buy-${i}`, type: 'buy', price: buyPrice, amount: SIMULATION_CONFIG.tradeAmount });
            orders.push({ id: `sell-${i}`, type: 'sell', price: sellPrice, amount: SIMULATION_CONFIG.tradeAmount });
        }
        return orders;
    }, []);
    
    useEffect(() => {
        const initialCandle: CandlestickData = {
            open: config.initialPrice,
            high: config.initialPrice,
            low: config.initialPrice,
            close: config.initialPrice,
            timestamp: Date.now(),
        };

        setState(prevState => ({
            ...prevState,
            openOrders: createGrid(config.initialPrice),
            candlestickData: [initialCandle],
        }));
    }, [config.initialPrice, createGrid]);

    useEffect(() => {
        const interval = setInterval(() => {
            setState(prevState => {
                const lastCandle = prevState.candlestickData[prevState.candlestickData.length - 1];
                const priceChange = (Math.random() - 0.49) * (prevState.currentPrice * 0.0005); // slightly bullish bias
                const newPrice = prevState.currentPrice + priceChange;

                let newCandle: CandlestickData = {
                    ...lastCandle,
                    close: newPrice,
                    high: Math.max(lastCandle.high, newPrice),
                    low: Math.min(lastCandle.low, newPrice),
                };
                
                let newCandlestickData = [...prevState.candlestickData];
                
                const ticksSinceLastCandle = (prevState.totalTrades + 1) % 15;

                if (ticksSinceLastCandle === 0) {
                     newCandle = {
                        open: newPrice,
                        high: newPrice,
                        low: newPrice,
                        close: newPrice,
                        timestamp: Date.now(),
                    };
                    newCandlestickData.push(newCandle);
                    if (newCandlestickData.length > 50) {
                        newCandlestickData.shift();
                    }
                } else {
                    newCandlestickData[newCandlestickData.length - 1] = newCandle;
                }

                let newHistory = [...prevState.orderHistory];
                let newOpenOrders = [...prevState.openOrders];
                let lastTrade: Trade | null = null;
                
                const buysToExecute = newOpenOrders.filter(order => order.type === 'buy' && newPrice <= order.price);
                const sellsToExecute = newOpenOrders.filter(order => order.type === 'sell' && newPrice >= order.price);

                if (buysToExecute.length > 0) {
                    const order = buysToExecute[0];
                    newOpenOrders = newOpenOrders.filter(o => o.id !== order.id);
                    
                    const newSellPrice = order.price * (1 + SIMULATION_CONFIG.gridSpread * 2); 
                    newOpenOrders.push({ id: `sell-filled-${Date.now()}`, type: 'sell', price: newSellPrice, amount: order.amount });
                    
                    const trade: Trade = { ...order, time: formatDistanceToNowStrict(new Date(), { addSuffix: true }) };
                    newHistory.unshift(trade);
                    lastTrade = trade;
                } else if (sellsToExecute.length > 0) {
                    const order = sellsToExecute[0];
                    newOpenOrders = newOpenOrders.filter(o => o.id !== order.id);

                    const newBuyPrice = order.price * (1 - SIMULATION_CONFIG.gridSpread * 2);
                    newOpenOrders.push({ id: `buy-filled-${Date.now()}`, type: 'buy', price: newBuyPrice, amount: order.amount });
                    
                    const trade: Trade = { ...order, time: formatDistanceToNowStrict(new Date(), { addSuffix: true }) };
                    newHistory.unshift(trade);
                    lastTrade = trade;
                }
                
                return {
                    ...prevState,
                    currentPrice: newPrice,
                    openOrders: newOpenOrders.sort((a,b) => b.price - a.price),
                    orderHistory: newHistory.slice(0, 10),
                    lastTrade,
                    totalTrades: prevState.totalTrades + 1,
                    change24h: (newPrice / config.initialPrice - 1) * 100,
                    candlestickData: newCandlestickData,
                };
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [config.initialPrice, createGrid]);

    return { state };
}
