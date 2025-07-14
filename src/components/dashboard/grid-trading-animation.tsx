
"use client";

import React, { useEffect, useState, useRef } from 'react';

const statusMessages = [
    "Connecting to Exchange...",
    "Analyzing Market...",
    "Placing Buy Orders...",
    "Placing Sell Orders...",
    "Executing Grid...",
    "Finalizing Grid..."
];


export function GridTradingAnimation({ totalBalance, profitPerTrade, profitPercentage }: { totalBalance: number, profitPerTrade: number, profitPercentage: number }) {
  const [price, setPrice] = useState(totalBalance);
  const [pnl, setPnl] = useState(0);
  const [transactions, setTransactions] = useState<{ id: number; type: string; x: number; y: number; }[]>([]);
  const [statusText, setStatusText] = useState(statusMessages[0]);
  const chartAreaRef = useRef<HTMLDivElement>(null);
  let transId = 0;

  useEffect(() => {
    // Animate the price around the total balance
    const priceInterval = setInterval(() => {
      setPrice(prevPrice => {
        const variation = (Math.random() - 0.5) * (totalBalance * 0.001); // Smaller, more realistic flicker
        return totalBalance + variation;
      });
    }, 500);

    // Animate the P&L up to the final profit amount
    const pnlInterval = setInterval(() => {
        setPnl(prevPnl => {
            if (prevPnl < profitPerTrade) {
                return Math.min(prevPnl + profitPerTrade / 500, profitPerTrade); // Smoothly increment P&L over animation duration
            }
            return profitPerTrade;
        });
    }, 100);

    const transactionInterval = setInterval(() => {
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 60 + 20;
      
      setTransactions(currentTransactions => {
        const newTransaction = { id: transId++, type, x, y };
        // Limit transactions on screen to avoid performance issues
        const updatedTransactions = [...currentTransactions.slice(-20), newTransaction];
        
        // This timeout is for the animation of a single transaction dot
        setTimeout(() => {
          setTransactions(trs => trs.filter(t => t.id !== newTransaction.id));
        }, 1000);

        return updatedTransactions;
      });

    }, 800);

    // Cycle through status messages
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusMessages.length;
        setStatusText(statusMessages[statusIndex]);
    }, 10000); // Change status every 10 seconds

    return () => {
      clearInterval(priceInterval);
      clearInterval(pnlInterval);
      clearInterval(transactionInterval);
      clearInterval(statusInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitPerTrade, totalBalance]);

  return (
    <>
      <style>{`
        .trading-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .trading-container {
            width: 100%;
            height: 270px; /* Adjusted height for card */
            display: flex;
            flex-direction: column;
            position: relative;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
            font-family: 'Courier New', monospace;
            color: #ffffff;
            overflow: hidden;
            border-radius: var(--radius);
        }
        .header {
            height: 40px; /* Adjusted height */
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px; /* Adjusted padding */
            border-bottom: 1px solid #333;
        }
        .ticker {
            font-size: 16px; /* Adjusted font size */
            font-weight: bold;
            color: #00ff88;
        }
        .price {
            font-size: 14px; /* Adjusted font size */
            animation: priceFlicker 0.5s ease-in-out infinite alternate;
        }
        @keyframes priceFlicker {
            0% { opacity: 0.8; }
            100% { opacity: 1; }
        }
        .main-content {
            flex: 1;
            display: flex;
        }
        .chart-area {
            flex: 2;
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            border-right: 1px solid #333;
        }
        .grid-lines {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
        }
        .grid-line {
            position: absolute;
            width: 100%;
            height: 1px;
            background: #444;
            animation: gridPulse 2s ease-in-out infinite;
        }
        @keyframes gridPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
        .price-line {
            position: absolute;
            width: 100%;
            height: 2px;
            background: #00ff88;
            animation: priceMove 3s ease-in-out infinite;
            box-shadow: 0 0 10px #00ff88;
        }
        @keyframes priceMove {
            0% { top: 60%; }
            25% { top: 45%; }
            50% { top: 55%; }
            75% { top: 40%; }
            100% { top: 60%; }
        }
        .order-book {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            padding: 10px; /* Adjusted padding */
            display: flex;
            flex-direction: column;
            font-size: 10px; /* Adjusted font size */
        }
        .order-book-header {
            text-align: center;
            margin-bottom: 10px; /* Adjusted margin */
            font-size: 12px; /* Adjusted font size */
            color: #00ff88;
        }
        .orders-section {
            margin-bottom: 10px; /* Adjusted margin */
        }
        .section-title {
            font-size: 10px; /* Adjusted font size */
            margin-bottom: 5px; /* Adjusted margin */
            color: #888;
        }
        .order-row {
            display: flex;
            justify-content: space-between;
            padding: 2px 0; /* Adjusted padding */
            border-bottom: 1px solid #222;
            animation: orderFlash 2s ease-in-out infinite;
        }
        .order-row.buy {
            color: #00ff88;
        }
        .order-row.sell {
            color: #ff4444;
        }
        @keyframes orderFlash {
            0%, 90% { opacity: 0.8; }
            95% { opacity: 1; background: rgba(255, 255, 255, 0.05); }
            100% { opacity: 0.8; }
        }
        .trading-bot {
            position: absolute;
            width: 15px;
            height: 15px;
            background: #00ff88;
            border-radius: 50%;
            animation: botMove 4s ease-in-out infinite;
            box-shadow: 0 0 15px #00ff88;
        }
        @keyframes botMove {
            0% { left: 10%; top: 60%; transform: scale(1); }
            25% { left: 30%; top: 45%; transform: scale(1.2); }
            50% { left: 50%; top: 55%; transform: scale(1); }
            75% { left: 70%; top: 40%; transform: scale(1.2); }
            100% { left: 90%; top: 60%; transform: scale(1); }
        }
        .transaction {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: transactionPop 1s ease-out;
        }
        .transaction.buy {
            background: #00ff88;
            box-shadow: 0 0 10px #00ff88;
        }
        .transaction.sell {
            background: #ff4444;
            box-shadow: 0 0 10px #ff4444;
        }
        @keyframes transactionPop {
            0% { transform: scale(0); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.8; }
            100% { transform: scale(0); opacity: 0; }
        }
        .profit-loss {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px; /* Adjusted padding */
            border-radius: 5px; /* Adjusted radius */
            border: 1px solid #333;
            font-size: 10px; /* Adjusted font size */
        }
        .pnl-value {
            font-size: 14px; /* Adjusted font size */
            font-weight: bold;
            animation: pnlFlicker 1s ease-in-out infinite;
        }
        .pnl-value.positive {
            color: #00ff88;
        }
        .pnl-value.negative {
            color: #ff4444;
        }
        @keyframes pnlFlicker {
            0%, 50% { opacity: 0.8; }
            100% { opacity: 1; }
        }
        .status-indicator {
            position: absolute;
            top: 10px;
            left: 10px;
            display: flex;
            align-items: center;
            gap: 5px; /* Adjusted gap */
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px; /* Adjusted padding */
            border-radius: 20px;
            border: 1px solid #333;
            font-size: 10px; /* Adjusted font size */
        }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #00ff88;
            animation: statusBlink 1s ease-in-out infinite;
        }
        @keyframes statusBlink {
            0%, 50% { opacity: 1; }
            100% { opacity: 0.3; }
        }
        .grid-levels {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .grid-level {
            position: absolute;
            width: 100%;
            height: 1px;
            background: rgba(255, 255, 255, 0.2);
            animation: gridLevelPulse 3s ease-in-out infinite;
        }
        @keyframes gridLevelPulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
        }
        .dynamic-status {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.5);
            padding: 5px 15px;
            border-radius: 5px;
            font-size: 12px;
            animation: fadeInOut 10s infinite;
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            10%, 90% { opacity: 1; }
        }
      `}</style>
      <div className="trading-container">
        <div className="header">
            <div className="ticker">TOTAL BALANCE</div>
            <div className="price">${price.toFixed(2)}</div>
        </div>
        <div className="main-content">
            <div className="chart-area" ref={chartAreaRef}>
                <div className="grid-lines">
                    <div className="grid-line" style={{ top: '20%' }}></div>
                    <div className="grid-line" style={{ top: '40%' }}></div>
                    <div className="grid-line" style={{ top: '60%' }}></div>
                    <div className="grid-line" style={{ top: '80%' }}></div>
                </div>
                <div className="grid-levels">
                    <div className="grid-level" style={{ top: '25%', animationDelay: '0s' }}></div>
                    <div className="grid-level" style={{ top: '35%', animationDelay: '0.5s' }}></div>
                    <div className="grid-level" style={{ top: '45%', animationDelay: '1s' }}></div>
                    <div className="grid-level" style={{ top: '55%', animationDelay: '1.5s' }}></div>
                    <div className="grid-level" style={{ top: '65%', animationDelay: '2s' }}></div>
                    <div className="grid-level" style={{ top: '75%', animationDelay: '2.5s' }}></div>
                </div>
                <div className="price-line"></div>
                <div className="trading-bot"></div>
                <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>GRID ACTIVE</span>
                </div>
                <div className="profit-loss">
                    <div>PROFIT</div>
                    <div className={`pnl-value ${pnl >= 0 ? 'positive' : 'negative'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-400">({profitPercentage.toFixed(4)}%)</div>
                </div>
                {transactions.map(t => (
                  <div key={t.id} className={`transaction ${t.type}`} style={{ left: `${t.x}%`, top: `${t.y}%` }}></div>
                ))}
                <div className="dynamic-status">{statusText}</div>
            </div>
            <div className="order-book">
                <div className="order-book-header">ORDER BOOK</div>
                <div className="orders-section">
                    <div className="section-title">SELL ORDERS</div>
                    <div className="order-row sell"><span>{(totalBalance * 1.0005).toFixed(2)}</span><span>0.125</span></div>
                    <div className="order-row sell"><span>{(totalBalance * 1.0003).toFixed(2)}</span><span>0.234</span></div>
                    <div className="order-row sell"><span>{(totalBalance * 1.0001).toFixed(2)}</span><span>0.456</span></div>
                </div>
                <div className="orders-section">
                    <div className="section-title">BUY ORDERS</div>
                    <div className="order-row buy"><span>{(totalBalance * 0.9999).toFixed(2)}</span><span>0.345</span></div>
                    <div className="order-row buy"><span>{(totalBalance * 0.9997).toFixed(2)}</span><span>0.567</span></div>
                    <div className="order-row buy"><span>{(totalBalance * 0.9995).toFixed(2)}</span><span>0.789</span></div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
