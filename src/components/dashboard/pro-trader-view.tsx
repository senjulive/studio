'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { BarChart2, TrendingUp, SlidersHorizontal, Layers, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

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


export function ProTraderView() {
    const [activePair, setActivePair] = React.useState('BTC/USDT');
    const [activeTimeframe, setActiveTimeframe] = React.useState('1h');
    const [activeChartTab, setActiveChartTab] = React.useState('Candlestick');

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
                <div className="timeframe-selector">
                    {['1m', '5m', '15m', '1h', '4h'].map(tf => (
                        <button key={tf} onClick={() => setActiveTimeframe(tf)} className={cn("timeframe-btn", activeTimeframe === tf && "active")}>
                            {tf}
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
                    <div className="chart-container">
                        {/* Placeholder for actual chart */}
                        <div className="flex items-center justify-center h-full text-slate-500">
                             Chart for {activePair} ({activeTimeframe}) - {activeChartTab}
                        </div>
                    </div>
                     <div className="price-display">
                        <div className="price-info">
                            <div className="price-value">$43,847.52</div>
                            <div className="price-change positive">+2.48%</div>
                        </div>
                        <div className="volume-info">
                            Vol: 847.23M
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stats-grid">
                        <StatCard label="Portfolio Balance" value="$12,847.92" />
                        <StatCard label="Today's P&L" value="+$347.85" className="profit" />
                        <StatCard label="Active Positions" value="8/15" />
                        <StatCard label="Grid Range" value="±3.2%" />
                    </div>
                    <div className="performance-section">
                        <h3 className="section-header">Performance Analytics</h3>
                        <div className="performance-grid">
                            <PerformanceItem label="Win Rate" value="84.2%" className="text-green-400"/>
                            <PerformanceItem label="Avg Trade" value="$8.74" />
                            <PerformanceItem label="Max Drawdown" value="-1.8%" className="text-red-400"/>
                            <PerformanceItem label="Total Trades" value="1,247" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="bottom-stats">
                 <div className="order-history">
                    <h3 className="section-header">Live Order History</h3>
                     <div className="order-list">
                        <OrderItem type="buy" price="43850.12" amount="0.05" time="2s ago" />
                        <OrderItem type="sell" price="43895.60" amount="0.02" time="28s ago" />
                        <OrderItem type="buy" price="43842.90" amount="0.10" time="1m ago" />
                        <OrderItem type="sell" price="43901.05" amount="0.08" time="2m ago" />
                        <OrderItem type="buy" price="43833.45" amount="0.05" time="3m ago" />
                     </div>
                 </div>
                 <div className="order-history">
                     <h3 className="section-header">Open Orders</h3>
                     <div className="order-list">
                        <OrderItem type="sell" price="44100.00" amount="0.15" time="pending" />
                        <OrderItem type="sell" price="44050.00" amount="0.15" time="pending" />
                        <OrderItem type="buy" price="43750.00" amount="0.20" time="pending" />
                        <OrderItem type="buy" price="43700.00" amount="0.20" time="pending" />
                     </div>
                 </div>
            </div>

        </div>
    );
}
