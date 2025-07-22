
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { UsdtLogoIcon } from '../icons/usdt-logo';

const statusMessages = [
    { text: "Connecting to Exchange...", progress: 3 },
    { text: "Analyzing Market...", progress: 15 },
    { text: "Placing Buy Orders...", progress: 30 },
    { text: "Placing Sell Orders...", progress: 45 },
    { text: "Executing Grid...", progress: 70 },
    { text: "Finalizing Grid...", progress: 95 }
];


export function GridTradingAnimation({ totalBalance, profitPerTrade, profitPercentage, setBotLog, isAnimating }: { totalBalance: number, profitPerTrade: number, profitPercentage: number, setBotLog: React.Dispatch<React.SetStateAction<{ message: string; time: Date; }[]>>, isAnimating: boolean }) {
  const [price, setPrice] = useState(totalBalance);
  const [pnl, setPnl] = useState(0);
  const [transactions, setTransactions] = useState<{ id: number; type: string; x: number; y: number; }[]>([]);
  const [statusText, setStatusText] = useState("");
  const chartAreaRef = useRef<HTMLDivElement>(null);
  let transId = 0;

  useEffect(() => {
    if (!isAnimating) {
        setPrice(totalBalance);
        setPnl(0);
        setStatusText("");
        return;
    };

    const priceInterval = setInterval(() => {
      setPrice(prevPrice => {
        const variation = (Math.random() - 0.5) * (totalBalance * 0.001);
        return totalBalance + variation;
      });
    }, 500);

    const pnlInterval = setInterval(() => {
        setPnl(prevPnl => {
            if (prevPnl < profitPerTrade) {
                return Math.min(prevPnl + profitPerTrade / 50, profitPerTrade);
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
        const updatedTransactions = [...currentTransactions.slice(-20), newTransaction];
        
        setTimeout(() => {
          setTransactions(trs => trs.filter(t => t.id !== newTransaction.id));
        }, 1000);

        return updatedTransactions;
      });

    }, 800);

    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        const currentStatus = statusMessages[statusIndex];
        setStatusText(currentStatus.text);
        setBotLog(prev => [...prev, {message: currentStatus.text, time: new Date()}]);

        setTimeout(() => setStatusText(""), 4000); // Display for 4 seconds

        statusIndex++;
        if (statusIndex >= statusMessages.length) {
            clearInterval(statusInterval);
        }
    }, 9000); // Change status every 9 seconds

    return () => {
      clearInterval(priceInterval);
      clearInterval(pnlInterval);
      clearInterval(transactionInterval);
      clearInterval(statusInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitPerTrade, totalBalance, isAnimating]);

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
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            font-family: 'Courier New', monospace;
            color: #ffffff;
            overflow: hidden;
            border-radius: var(--radius);
        }
        .main-content {
            flex: 1;
            display: flex;
        }
        .chart-area {
            flex: 2;
            position: relative;
            border-right: 1px solid #333;
        }
        .price-line {
            position: absolute;
            width: 100%;
            height: 1px;
            background: #3b82f6;
            animation: priceMove 3s ease-in-out infinite;
            box-shadow: 0 0 10px #3b82f6;
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
            background: rgba(0, 0, 0, 0.1);
            padding: 10px;
            display: flex;
            flex-direction: column;
            font-size: 10px;
        }
        .order-book-header {
            text-align: center;
            margin-bottom: 10px;
            font-size: 12px;
            color: #94a3b8;
        }
        .orders-section {
            margin-bottom: 10px;
        }
        .section-title {
            font-size: 10px;
            margin-bottom: 5px;
            color: #888;
        }
        .order-row {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
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
        .transaction {
            position: absolute;
            width: 24px;
            height: 24px;
            animation: transactionPop 1s ease-out;
            display: flex;
            align-items: center;
            justify-content: center;
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
            background: rgba(0, 0, 0, 0.5);
            padding: 5px 10px;
            border-radius: 5px;
            border: 1px dashed #64748b;
            font-size: 10px;
        }
        .pnl-value {
            font-size: 14px;
            font-weight: bold;
            animation: pnlFlicker 1s ease-in-out infinite;
        }
        .pnl-value.positive {
            color: #00ff88;
        }
        @keyframes pnlFlicker {
            0%, 50% { opacity: 0.8; }
            100% { opacity: 1; }
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
            background: rgba(255, 255, 255, 0.1);
            animation: gridLevelPulse 3s ease-in-out infinite;
        }
        @keyframes gridLevelPulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.4; }
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
            animation: fadeInOut 5s;
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            20%, 80% { opacity: 1; }
        }
      `}</style>
      <div className="trading-container">
        <div className="main-content">
            <div className="chart-area" ref={chartAreaRef}>
                <div className="grid-levels">
                    {[25, 35, 45, 55, 65, 75].map((top, i) => (
                        <div key={i} className="grid-level" style={{ top: `${top}%`, animationDelay: `${i * 0.5}s` }}></div>
                    ))}
                </div>
                <div className="price-line"></div>
                <div className="profit-loss">
                    <div>PROFIT</div>
                    <div className={`pnl-value positive`}>
                      +${pnl.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-400">({profitPercentage.toFixed(4)}%)</div>
                </div>
                {transactions.map(t => (
                  <div key={t.id} className={`transaction ${t.type}`} style={{ left: `${t.x}%`, top: `${t.y}%` }}>
                    <UsdtLogoIcon className="h-6 w-6"/>
                  </div>
                ))}
                {statusText && <div className="dynamic-status">{statusText}</div>}
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
