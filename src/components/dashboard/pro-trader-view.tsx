
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { useTradingBot } from '@/hooks/use-trading-bot';
import type { CandlestickData } from '@/hooks/use-trading-bot';

const StatCard = ({ label, value, className, change }: { label: string; value: string; className?: string; change?: string }) => (
    <div className="stat-card">
        <div className="stat-label">{label}</div>
        <div className={cn("stat-value", className)}>
            {value}
            {change && <span className={cn("text-xs ml-2", change.startsWith('+') ? 'text-green-400' : 'text-red-400')}>{change}</span>}
        </div>
    </div>
);

const OrderItem = ({ type, price, amount, time }: { type: 'buy' | 'sell'; price: string; amount: string; time: string }) => (
    <div className="order-item">
        <div className={cn("font-bold", type === 'buy' ? "order-buy" : "order-sell")}>{type.toUpperCase()}</div>
        <div>{price}</div>
        <div>{amount}</div>
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
    const [activePair, setActivePair] = React.useState('BTC/USDT');
    const [activeChartTab, setActiveChartTab] = React.useState('Candlestick');
    const { state } = useTradingBot({
        initialPrice: 43850,
        gridLevels: 5,
        gridSpread: 0.001,
        tradeAmount: 0.05
    });
    const [floaters, setFloaters] = React.useState<{ id: number; x: number; y: number; text: string; type: 'profit' | 'loss' }[]>([]);
    const chartContainerRef = React.useRef<HTMLDivElement>(null);


    React.useEffect(() => {
        if (state.lastTrade) {
            const chartRect = chartContainerRef.current?.getBoundingClientRect();
            if (chartRect) {
                const isBuy = state.lastTrade.type === 'buy';
                if (!isBuy) { // Only show floaters on sell (profit/loss)
                    const profit = state.lastPnl;
                    const type = profit >= 0 ? 'profit' : 'loss';
                    const text = `${type === 'profit' ? '+' : ''}${formatCurrency(profit)}`;

                    const newFloater = {
                        id: Date.now(),
                        x: Math.random() * chartRect.width * 0.8 + chartRect.width * 0.1,
                        y: Math.random() * chartRect.height * 0.5 + chartRect.height * 0.2,
                        text,
                        type
                    };
                    setFloaters(f => [...f, newFloater]);
                    setTimeout(() => {
                        setFloaters(f => f.filter(fl => fl.id !== newFloater.id));
                    }, 3000);
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.lastTrade, state.lastPnl]);


    return (
        <div className="trading-card">
            <header className="header">
                <div className="logo">
                    Grid Trading Bot Pro
                </div>
                <div className="bot-status">
                    <div className="status-indicator"></div>
                    <span>Active</span>
                </div>
            </header>

            <section className="controls">
                <div className="pair-selector">
                    {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'].map(pair => (
                        <button key={pair} onClick={() => setActivePair(pair)} className={cn("pair-btn", activePair === pair && "active")}>
                            {pair}
                        </button>
                    ))}
                </div>
            </section>

            <section className="content-grid">
                <div className="chart-section">
                    <div className="flex justify-between items-center mb-4">
                        <div className="chart-tabs">
                            {['Candlestick', 'Line Chart', 'Volume'].map(tab => (
                                <button key={tab} onClick={() => setActiveChartTab(tab)} className={cn("chart-tab", activeChartTab === tab && "active")}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700 hover:text-white">
                            <SlidersHorizontal className="h-4 w-4 mr-2"/>
                            Indicators
                        </Button>
                    </div>
                    <div ref={chartContainerRef} className={cn("chart-container", state.lastTrade?.type === 'buy' ? 'flash-green' : state.lastTrade?.type === 'sell' ? 'flash-red' : '')}>
                         {activeChartTab === 'Candlestick' && <CandlestickChart data={state.candlestickData} currentPrice={state.currentPrice} />}
                         {(activeChartTab === 'Line Chart' || activeChartTab === 'Volume') && (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                Chart for {activePair} - {activeChartTab}
                            </div>
                         )}
                         {floaters.map(f => (
                            <div key={f.id} className={cn(f.type === 'profit' ? 'profit-float' : 'loss-float')} style={{ left: `${f.x}px`, top: `${f.y}px` }}>
                                {f.text}
                            </div>
                        ))}
                    </div>
                     <div className="price-display">
                        <div className="price-info">
                            <div className="price-value">{formatCurrency(state.currentPrice)}</div>
                            <div className={cn("price-change", state.change24h >= 0 ? 'positive' : 'negative')}>
                                {state.change24h >= 0 ? '+' : ''}{state.change24h.toFixed(2)}%
                            </div>
                        </div>
                        <div className="volume-info">
                            Vol: {state.volume24h.toLocaleString()}M
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard label="Portfolio Balance" value={formatCurrency(state.portfolioBalance)} />
                        <StatCard label="Today's P&L" value={`${state.pnl >= 0 ? '+' : ''}${formatCurrency(state.pnl)}`} className={state.pnl >= 0 ? "profit" : "loss"} />
                        <StatCard label="Active Positions" value={`${state.openPositions}/${state.totalPositions}`} />
                        <StatCard label="Grid Range" value={`±${state.gridRange.toFixed(2)}%`} />
                    </div>
                    <div className="performance-section">
                        <h3 className="section-header">Performance Analytics</h3>
                        <div className="performance-grid">
                            <PerformanceItem label="Win Rate" value={`${state.winRate.toFixed(1)}%`} className="text-green-400"/>
                            <PerformanceItem label="Avg Trade" value={formatCurrency(state.avgTrade)} />
                            <PerformanceItem label="Max Drawdown" value={`${state.maxDrawdown.toFixed(2)}%`} className="text-red-400"/>
                            <PerformanceItem label="Total Trades" value={state.totalTrades.toString()} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="bottom-stats">
                 <div className="order-history">
                    <h3 className="section-header">Live Order History</h3>
                     <div className="order-list">
                        {state.orderHistory.map(order => (
                             <OrderItem key={order.id} type={order.type} price={order.price.toFixed(2)} amount={order.amount.toFixed(2)} time={order.time} />
                        ))}
                     </div>
                 </div>
                 <div className="order-history">
                     <h3 className="section-header">Open Orders</h3>
                     <div className="order-list">
                        {state.openOrders.map(order => (
                            <OrderItem key={order.id} type={order.type} price={order.price.toFixed(2)} amount={order.amount.toFixed(2)} time="pending" />
                        ))}
                     </div>
                 </div>
            </div>

        </div>
    );
}
