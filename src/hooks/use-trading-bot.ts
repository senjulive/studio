
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
        botLog: [],
        winRate: 84.2,
        maxDrawdown: -1.8,
        totalTrades: 1247,
        volume24h: 847.23,
    });
    
    useEffect(() => {
        const interval = setInterval(() => {
            setState(prevState => {
                const winRateChange = (Math.random() - 0.5) * 0.2;
                const newWinRate = Math.max(80, Math.min(95, prevState.winRate + winRateChange));

                const drawdownChange = (Math.random() - 0.5) * 0.1;
                const newMaxDrawdown = Math.max(-5, Math.min(-1, prevState.maxDrawdown + drawdownChange));

                return {
                    ...prevState,
                    winRate: newWinRate,
                    maxDrawdown: newMaxDrawdown,
                };
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const setBotLog = useCallback((logUpdater: React.SetStateAction<{ message: string; time: Date; }[]>) => {
        setState(prevState => ({
            ...prevState,
            botLog: typeof logUpdater === 'function' ? logUpdater(prevState.botLog) : logUpdater
        }));
    }, []);
    

    return { state, setBotLog };
}
