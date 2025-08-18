'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap,
  Target,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface AnimatedTradingBotProps {
  isRunning: boolean;
  profit: number;
  trades: number;
  className?: string;
}

interface TradeAnimation {
  id: string;
  x: number;
  y: number;
  type: 'buy' | 'sell';
  amount: number;
  timestamp: number;
}

interface GridLevel {
  id: string;
  price: number;
  y: number;
  type: 'buy' | 'sell';
  active: boolean;
}

export function AnimatedTradingBot({ isRunning, profit, trades, className }: AnimatedTradingBotProps) {
  const [tradeAnimations, setTradeAnimations] = React.useState<TradeAnimation[]>([]);
  const [gridLevels, setGridLevels] = React.useState<GridLevel[]>([]);
  const [currentPrice, setCurrentPrice] = React.useState(67850);
  const [priceHistory, setPriceHistory] = React.useState<number[]>([]);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Initialize grid levels
  React.useEffect(() => {
    const basePrice = 67850;
    const levels: GridLevel[] = [];
    
    for (let i = 0; i < 10; i++) {
      levels.push({
        id: `buy-${i}`,
        price: basePrice - (i + 1) * 100,
        y: 60 + i * 25,
        type: 'buy',
        active: Math.random() > 0.6
      });
      
      levels.push({
        id: `sell-${i}`,
        price: basePrice + (i + 1) * 100,
        y: 60 + i * 25,
        type: 'sell',
        active: Math.random() > 0.6
      });
    }
    
    setGridLevels(levels);
  }, []);

  // Price simulation
  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 20;
        const newPrice = Math.max(60000, Math.min(80000, prev + change));
        
        setPriceHistory(prevHistory => {
          const newHistory = [...prevHistory, newPrice];
          return newHistory.slice(-50); // Keep last 50 points
        });
        
        return newPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Trade animations
  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of trade
        const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
        const newTrade: TradeAnimation = {
          id: Date.now().toString(),
          x: Math.random() * 280 + 20,
          y: Math.random() * 200 + 50,
          type: tradeType,
          amount: Math.random() * 1000 + 100,
          timestamp: Date.now()
        };

        setTradeAnimations(prev => [...prev, newTrade]);

        // Remove animation after 3 seconds
        setTimeout(() => {
          setTradeAnimations(prev => prev.filter(t => t.id !== newTrade.id));
        }, 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Grid level updates
  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGridLevels(prev => prev.map(level => ({
        ...level,
        active: Math.random() > 0.7
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const PriceChart = () => {
    if (priceHistory.length < 2) return null;

    const minPrice = Math.min(...priceHistory);
    const maxPrice = Math.max(...priceHistory);
    const priceRange = maxPrice - minPrice || 1;

    const pathData = priceHistory
      .map((price, index) => {
        const x = (index / (priceHistory.length - 1)) * 280;
        const y = 150 - ((price - minPrice) / priceRange) * 100;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        <path
          d={pathData}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          className="drop-shadow-sm"
        />
        
        <path
          d={`${pathData} L 280 150 L 0 150 Z`}
          fill="url(#priceGradient)"
        />
      </svg>
    );
  };

  return (
    <div className={cn("relative w-full h-64 bg-gradient-to-br from-background to-card rounded-2xl border border-primary/20 overflow-hidden", className)}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-bg w-full h-full" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Price chart */}
      <div className="relative w-full h-full" ref={canvasRef}>
        <PriceChart />
        
        {/* Grid levels */}
        {isRunning && gridLevels.map((level) => (
          <div
            key={level.id}
            className={cn(
              "absolute w-full h-0.5 transition-all duration-500",
              level.type === 'buy' ? "bg-green-500/30" : "bg-red-500/30",
              level.active && "bg-opacity-100 shadow-lg",
              level.active && level.type === 'buy' && "shadow-green-500/50",
              level.active && level.type === 'sell' && "shadow-red-500/50"
            )}
            style={{ top: `${level.y}px` }}
          >
            {level.active && (
              <div className={cn(
                "absolute right-2 -top-2 text-xs font-bold px-2 py-0.5 rounded",
                level.type === 'buy' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                ${level.price.toLocaleString()}
              </div>
            )}
          </div>
        ))}

        {/* Current price line */}
        <div 
          className="absolute w-full h-0.5 bg-primary shadow-lg shadow-primary/50 z-10 transition-all duration-1000"
          style={{ top: '120px' }}
        >
          <div className="absolute right-2 -top-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-lg">
            ${currentPrice.toLocaleString()}
          </div>
          <div className="absolute left-0 -top-1 w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>

        {/* Trade animations */}
        {tradeAnimations.map((trade) => (
          <div
            key={trade.id}
            className={cn(
              "absolute w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs animate-bounce z-20",
              trade.type === 'buy' ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"
            )}
            style={{ 
              left: `${trade.x}px`, 
              top: `${trade.y}px`,
              animation: 'tradePopIn 3s ease-out forwards'
            }}
          >
            {trade.type === 'buy' ? '↗' : '↘'}
          </div>
        ))}

        {/* Profit animations */}
        {isRunning && profit > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <div className="text-green-400 font-bold text-sm animate-pulse">
              +${profit.toFixed(2)}
            </div>
          </div>
        )}

        {/* Bot status indicator */}
        <div className="absolute top-4 left-4 z-20">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm",
            isRunning 
              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
              : "bg-muted/50 text-muted-foreground border border-border"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isRunning ? "bg-green-400 animate-pulse" : "bg-muted-foreground"
            )} />
            {isRunning ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>

        {/* Trading stats overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Trades</div>
                <div className="font-bold text-sm">{trades}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Success</div>
                <div className="font-bold text-sm text-green-400">92%</div>
              </div>
            </div>
            
            {isRunning && (
              <div className="flex items-center gap-1 text-primary animate-pulse">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">Trading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Neural network visualization when running */}
        {isRunning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="neural-network">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/60 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 40}px`,
                    top: `${30 + Math.sin(i) * 20}px`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes tradePopIn {
          0% { 
            transform: scale(0) rotate(0deg); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.5) rotate(180deg); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(0) rotate(360deg); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}

// Advanced Grid Trading Animation Component
export function GridTradingAnimation() {
  const [gridOrders, setGridOrders] = React.useState<Array<{
    id: string;
    price: number;
    type: 'buy' | 'sell';
    amount: number;
    filled: boolean;
    y: number;
  }>>([]);

  React.useEffect(() => {
    // Initialize grid orders
    const orders = [];
    const basePrice = 67000;
    
    for (let i = 0; i < 8; i++) {
      // Buy orders below current price
      orders.push({
        id: `buy-${i}`,
        price: basePrice - (i + 1) * 50,
        type: 'buy' as const,
        amount: 100 + Math.random() * 400,
        filled: Math.random() > 0.7,
        y: 150 + i * 20
      });
      
      // Sell orders above current price
      orders.push({
        id: `sell-${i}`,
        price: basePrice + (i + 1) * 50,
        type: 'sell' as const,
        amount: 100 + Math.random() * 400,
        filled: Math.random() > 0.7,
        y: 130 - i * 20
      });
    }
    
    setGridOrders(orders);
  }, []);

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-background to-card/50 rounded-2xl border border-primary/20 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-5" />
      
      {/* Center price line */}
      <div className="absolute w-full h-0.5 bg-primary top-1/2 transform -translate-y-1/2 shadow-lg shadow-primary/50">
        <div className="absolute left-4 -top-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
          Current: $67,000
        </div>
      </div>
      
      {/* Grid orders */}
      {gridOrders.map((order) => (
        <div
          key={order.id}
          className={cn(
            "absolute left-4 right-4 h-0.5 transition-all duration-500",
            order.type === 'buy' ? "bg-green-500/30" : "bg-red-500/30",
            order.filled && "bg-opacity-100 shadow-lg"
          )}
          style={{ top: `${order.y}px` }}
        >
          <div className={cn(
            "absolute left-0 -top-2 text-xs px-2 py-0.5 rounded font-medium",
            order.type === 'buy' ? "text-green-400" : "text-red-400"
          )}>
            ${order.price.toLocaleString()}
          </div>
          
          <div className={cn(
            "absolute right-0 -top-2 text-xs px-2 py-0.5 rounded",
            order.filled ? "bg-primary/20 text-primary" : "text-muted-foreground"
          )}>
            {order.filled ? '✓' : `$${order.amount}`}
          </div>
          
          {order.filled && (
            <div className="absolute inset-0 bg-primary/50 rounded animate-pulse" />
          )}
        </div>
      ))}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500" />
              <span className="text-green-400">Buy Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-500" />
              <span className="text-red-400">Sell Orders</span>
            </div>
          </div>
          <div className="text-muted-foreground">Grid Trading Active</div>
        </div>
      </div>
    </div>
  );
}
