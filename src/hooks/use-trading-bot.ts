
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
    portfolioBalance: number;
    pnl: number;
    openPositions: number;
    totalPositions: number;
    gridRange: number;
    winRate: number;
    avgTrade: number;
    maxDrawdown: number;
    totalTrades: number;
    change24h: number;
    volume24h: number;
    openOrders: Order[];
    orderHistory: Trade[];
    lastTrade: Trade | null;
    lastPnl: number;
    candlestickData: CandlestickData[];
};

type BotConfig = {
    initialPrice: number;
    gridLevels: number;
    gridSpread: number; // e.g., 0.001 for 0.1%
    tradeAmount: number;
};

const MOCK_INITIAL_BALANCE = 12847.92;

export function useTradingBot(config: BotConfig) {
    const [state, setState] = useState<BotState>({
        currentPrice: config.initialPrice,
        portfolioBalance: MOCK_INITIAL_BALANCE,
        pnl: 0,
        openPositions: 0,
        totalPositions: config.gridLevels * 2,
        gridRange: config.gridSpread * config.gridLevels * 100,
        winRate: 0,
        avgTrade: 0,
        maxDrawdown: 0,
        totalTrades: 0,
        change24h: 0,
        volume24h: 847.23,
        openOrders: [],
        orderHistory: [],
        lastTrade: null,
        lastPnl: 0,
        candlestickData: [],
    });

    const createGrid = useCallback((price: number) => {
        const orders: Order[] = [];
        for (let i = 1; i <= config.gridLevels; i++) {
            const buyPrice = price * (1 - config.gridSpread * i);
            const sellPrice = price * (1 + config.gridSpread * i);
            orders.push({ id: `buy-${i}`, type: 'buy', price: buyPrice, amount: config.tradeAmount });
            orders.push({ id: `sell-${i}`, type: 'sell', price: sellPrice, amount: config.tradeAmount });
        }
        return orders;
    }, [config.gridLevels, config.gridSpread, config.tradeAmount]);
    
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
                
                // Create a new candle every 15 ticks (22.5s)
                if (prevState.totalTrades % 15 === 0 && prevState.totalTrades > 0) {
                     newCandle = {
                        open: newPrice,
                        high: newPrice,
                        low: newPrice,
                        close: newPrice,
                        timestamp: Date.now(),
                    };
                    newCandlestickData.push(newCandle);
                    if (newCandlestickData.length > 50) {
                        newCandlestickData.shift(); // Keep chart to 50 candles
                    }
                } else {
                    newCandlestickData[newCandlestickData.length - 1] = newCandle;
                }

                let newPnl = prevState.pnl;
                let newBalance = prevState.portfolioBalance;
                let newHistory = [...prevState.orderHistory];
                let newOpenOrders = [...prevState.openOrders];
                let lastTrade: Trade | null = null;
                let lastPnl = 0;
                let executedTradesCount = prevState.totalTrades + 1;
                let profitableTrades = prevState.winRate * prevState.totalTrades / 100;

                const buysToExecute = newOpenOrders.filter(order => order.type === 'buy' && newPrice <= order.price);
                const sellsToExecute = newOpenOrders.filter(order => order.type === 'sell' && newPrice >= order.price);

                if (buysToExecute.length > 0) {
                    const order = buysToExecute[0];
                    newOpenOrders = newOpenOrders.filter(o => o.id !== order.id);
                    
                    const newSellPrice = order.price * (1 + config.gridSpread * 2); 
                    newOpenOrders.push({ id: `sell-filled-${Date.now()}`, type: 'sell', price: newSellPrice, amount: order.amount });
                    
                    const trade: Trade = { ...order, time: formatDistanceToNowStrict(new Date(), { addSuffix: true }) };
                    newHistory.unshift(trade);
                    lastTrade = trade;
                } else if (sellsToExecute.length > 0) {
                    const order = sellsToExecute[0];
                    newOpenOrders = newOpenOrders.filter(o => o.id !== order.id);

                    const newBuyPrice = order.price * (1 - config.gridSpread * 2);
                    newOpenOrders.push({ id: `buy-filled-${Date.now()}`, type: 'buy', price: newBuyPrice, amount: order.amount });

                    const profit = (order.price - (order.price / (1 + config.gridSpread * 2))) * order.amount;
                    newPnl += profit;
                    newBalance += profit;
                    lastPnl = profit;
                    
                    profitableTrades++;

                    const trade: Trade = { ...order, time: formatDistanceToNowStrict(new Date(), { addSuffix: true }) };
                    newHistory.unshift(trade);
                    lastTrade = trade;
                }
                
                const winRate = executedTradesCount > 0 ? (profitableTrades / executedTradesCount) * 100 : 0;
                const avgTrade = executedTradesCount > 0 ? newPnl / executedTradesCount : 0;

                return {
                    ...prevState,
                    currentPrice: newPrice,
                    pnl: newPnl,
                    portfolioBalance: newBalance,
                    openOrders: newOpenOrders.sort((a,b) => b.price - a.price),
                    orderHistory: newHistory.slice(0, 10),
                    lastTrade,
                    lastPnl,
                    totalTrades: executedTradesCount,
                    winRate,
                    avgTrade,
                    openPositions: newOpenOrders.length / 2,
                    change24h: (newPrice / config.initialPrice - 1) * 100,
                    candlestickData: newCandlestickData,
                };
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [config.initialPrice, config.tradeAmount, createGrid, config.gridSpread]);

    return { state };
}
