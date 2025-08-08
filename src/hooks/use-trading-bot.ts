"use client";

import { useState, useEffect, useCallback } from 'react';

export type CandlestickData = {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp: number;
};

type BotState = {
    candlestickData: CandlestickData[];
    currentPrice: number;
    botLog: { message: string, time: Date }[];
    winRate: number;
    maxDrawdown: number;
    totalTrades: number;
    volume24h: number;
};

type BotConfig = {
    initialPrice: number;
};


export function useTradingBot(config: BotConfig) {
    const [state, setState] = useState<BotState>({
        candlestickData: [],
        currentPrice: config.initialPrice,
        botLog: [],
        winRate: 84.2,
        maxDrawdown: -1.8,
        totalTrades: 1247,
        volume24h: 847.23,
    });
    
    useEffect(() => {
        const generateInitialCandles = () => {
            let price = config.initialPrice;
            const data: CandlestickData[] = [];
            for (let i = 0; i < 50; i++) {
                const open = price;
                const change = (Math.random() - 0.5) * (price * 0.005);
                const close = open + change;
                const high = Math.max(open, close) + (Math.random() * (price * 0.002));
                const low = Math.min(open, close) - (Math.random() * (price * 0.002));
                data.push({ open, high, low, close, timestamp: Date.now() - (50 - i) * 1000 });
                price = close;
            }
            return data;
        };

        const initialData = generateInitialCandles();
        setState(prevState => ({
            ...prevState,
            candlestickData: initialData,
            currentPrice: initialData[initialData.length - 1].close,
        }));

        const interval = setInterval(() => {
            setState(prevState => {
                const winRateChange = (Math.random() - 0.5) * 0.2;
                const newWinRate = Math.max(80, Math.min(95, prevState.winRate + winRateChange));

                const drawdownChange = (Math.random() - 0.5) * 0.1;
                const newMaxDrawdown = Math.max(-5, Math.min(-1, prevState.maxDrawdown + drawdownChange));

                const lastCandle = prevState.candlestickData[prevState.candlestickData.length - 1];
                const open = lastCandle.close;

                // More realistic price movement with trend simulation
                const trend = Math.sin(Date.now() / 100000) * 0.002; // Long-term trend
                const volatility = 0.003 + (Math.random() * 0.002); // Variable volatility
                const change = (Math.random() - 0.5) * (open * volatility) + (open * trend);

                const close = Math.max(open * 0.98, Math.min(open * 1.02, open + change)); // Limit extreme moves

                // Calculate realistic high/low with wicks
                const wickRange = open * 0.001;
                const bodyHigh = Math.max(open, close);
                const bodyLow = Math.min(open, close);
                const high = bodyHigh + (Math.random() * wickRange);
                const low = Math.max(bodyLow - (Math.random() * wickRange), bodyLow * 0.995);

                const newCandle: CandlestickData = {
                    open,
                    high,
                    low,
                    close,
                    timestamp: Date.now()
                };

                const newCandlestickData = [...prevState.candlestickData.slice(1), newCandle];

                return {
                    ...prevState,
                    winRate: newWinRate,
                    maxDrawdown: newMaxDrawdown,
                    candlestickData: newCandlestickData,
                    currentPrice: close,
                    volume24h: prevState.volume24h * (1 + (Math.random() - 0.5) * 0.05), // Variable volume
                };
            });
        }, 2000); // Update every 2 seconds for more realistic timing

        return () => clearInterval(interval);
    }, [config.initialPrice]);

    const setBotLog = useCallback((logUpdater: React.SetStateAction<{ message: string; time: Date; }[]>) => {
        setState(prevState => ({
            ...prevState,
            botLog: typeof logUpdater === 'function' ? logUpdater(prevState.botLog) : logUpdater
        }));
    }, []);
    

    return { state, setBotLog };
}
