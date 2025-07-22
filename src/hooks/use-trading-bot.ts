
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
    // Simplified static fields for UI
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
    
    const setBotLog = useCallback((logUpdater: React.SetStateAction<{ message: string; time: Date; }[]>) => {
        setState(prevState => ({
            ...prevState,
            botLog: typeof logUpdater === 'function' ? logUpdater(prevState.botLog) : logUpdater
        }));
    }, []);
    

    return { state, setBotLog };
}
