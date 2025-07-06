"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { type WalletData, updateWallet } from "@/lib/wallet";

export function TradingBotCard({
  walletData,
  onUpdate,
}: {
  walletData: WalletData;
  onUpdate: (data: WalletData) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const progressBarRef = React.useRef<SVGCircleElement>(null);
  const logRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const candlesRef = React.useRef<any[]>([]);
  const priceRef = React.useRef(100);
  const offsetRef = React.useRef(0);
  const animationFrameId = React.useRef<number>();

  const [isAnimating, setIsAnimating] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [progressText, setProgressText] = React.useState("0%");

  const { toast } = useToast();

  const totalBalance =
    walletData.balances.usdt + walletData.balances.eth * 2500; // Assuming ETH price for calculation
  const canStart =
    totalBalance >= 100 && walletData.growth.clicksLeft > 0 && !isAnimating;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const CANDLE_WIDTH = 6;
    const SPACING = 3;
    const SPEED = 0.3;

    const newCandle = () => {
      let open = priceRef.current + (Math.random() * 2 - 1);
      let close = open + (Math.random() * 3 - 1.5);
      let high = Math.max(open, close) + Math.random();
      let low = Math.min(open, close) - Math.random();
      priceRef.current = close;
      return { open, high, low, close };
    };

    if (candlesRef.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        candlesRef.current.push(newCandle());
      }
    }

    const drawCandles = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, W, H);
      const candles = candlesRef.current;
      const maxPrice = Math.max(...candles.map((c) => c.high));
      const minPrice = Math.min(...candles.map((c) => c.low));
      const range = maxPrice - minPrice;
      const scaleY = (p: number) => H - ((p - minPrice) / range) * H;

      offsetRef.current -= SPEED;
      if (offsetRef.current <= -CANDLE_WIDTH - SPACING) {
        offsetRef.current += CANDLE_WIDTH + SPACING;
        candles.shift();
        candles.push(newCandle());
      }

      candles.forEach((c, i) => {
        const x = i * (CANDLE_WIDTH + SPACING) + offsetRef.current;
        const openY = scaleY(c.open);
        const closeY = scaleY(c.close);
        const highY = scaleY(c.high);
        const lowY = scaleY(c.low);

        const isBull = c.close >= c.open;
        const color = isBull ? "#00ff99" : "#ff4444";

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + CANDLE_WIDTH / 2, highY);
        ctx.lineTo(x + CANDLE_WIDTH / 2, lowY);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillRect(
          x,
          Math.min(openY, closeY),
          CANDLE_WIDTH,
          Math.max(1, Math.abs(closeY - openY))
        );
      });

      animationFrameId.current = requestAnimationFrame(drawCandles);
    };

    drawCandles();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const addLogLine = (text: string) => {
    setLogs((prev) => [...prev, text]);
  };

  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStart = async () => {
    if (!canStart) {
      if (isAnimating) {
        toast({ title: "Bot is already running." });
      } else if (totalBalance < 100) {
        toast({
          title: "Insufficient Balance",
          description: "You need at least $100 to run the bot.",
        });
      } else if (walletData.growth.clicksLeft <= 0) {
        toast({
          title: "Limit Reached",
          description: "You've used all your runs for today.",
        });
      }
      return;
    }

    setIsAnimating(true);
    setLogs([]);

    const circumference = 2 * Math.PI * 45;
    const progressBar = progressBarRef.current;
    if (progressBar) {
      progressBar.style.strokeDasharray = `${circumference}`;
      progressBar.style.strokeDashoffset = `${circumference}`;
    }
    setProgressText("0%");

    const milestones = [
      { percent: 5, text: "🔗 Logging into Market..." },
      { percent: 15, text: "✅ Connected to Exchange" },
      { percent: 30, text: "💰 Buying USDT on Market A at $0.999" },
      { percent: 60, text: "📈 Selling USDT on Market B at $1.003" },
      { percent: 85, text: "🧮 Calculating Profit: +0.4%" },
      { percent: 100, text: "✅ Trade Complete" },
    ];

    let loggedMilestones = new Set();
    let animationRequestId: number;

    const duration = 8000;
    const startTime = performance.now();

    const updateAnimation = (time: number) => {
      const elapsed = time - startTime;
      const percent = Math.min(100, (elapsed / duration) * 100);

      if (progressBar) {
        progressBar.style.strokeDashoffset = `${
          circumference * (1 - percent / 100)
        }`;
      }
      setProgressText(`${Math.floor(percent)}%`);

      milestones.forEach((m) => {
        if (percent >= m.percent && !loggedMilestones.has(m.percent)) {
          loggedMilestones.add(m.percent);
          addLogLine(m.text);
        }
      });

      if (percent < 100) {
        animationRequestId = requestAnimationFrame(updateAnimation);
      } else {
        const rate = totalBalance >= 500 ? 0.03 : 0.025;
        const earnings = totalBalance * rate;

        const newWalletData: WalletData = {
          ...walletData,
          balances: {
            ...walletData.balances,
            usdt: walletData.balances.usdt + earnings,
          },
          growth: {
            ...walletData.growth,
            clicksLeft: walletData.growth.clicksLeft - 1,
          },
        };

        updateWallet(newWalletData);
        onUpdate(newWalletData);

        toast({
          title: "Trade Successful!",
          description: `You've earned $${earnings.toFixed(2)}.`,
        });

        setIsAnimating(false);
      }
    };

    animationRequestId = requestAnimationFrame(updateAnimation);
  };
  
  const getProgressText = () => {
    if (isAnimating) return progressText;
    if (totalBalance < 100) return "Need $100";
    if (walletData.growth.clicksLeft <= 0) return "No runs";
    return "Tap to Start";
  }

  return (
    <>
      <style>{`
        .trading-bot-card {
          position: relative;
          width: 192px;
          height: 192px;
          background: #121212;
          border-radius: 16px;
          border: 1px solid #00ff99;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 0 8px #00ff99;
          font-family: 'Orbitron', monospace;
          color: #00ff99;
          user-select: none;
        }
        .trading-bot-card:not([data-can-start="true"]) {
          cursor: not-allowed;
          filter: grayscale(80%);
        }
        .trading-bot-card canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          opacity: 0.15;
          border-radius: 16px;
        }
        .trading-bot-card .ai-avatar {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #0d0d0d;
          border: 2px solid #00ff99;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }
        .trading-bot-card .ai-avatar svg {
          width: 20px;
          height: 20px;
          fill: #00ff99;
        }
        .trading-bot-card .log {
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
          flex: 1;
          padding-right: 2px;
          margin-top: 4px;
          max-height: 72px;
          font-size: 0.7rem;
          line-height: 1rem;
          scrollbar-width: thin;
          scrollbar-color: #00ff99 #0d0d0d;
        }
        .trading-bot-card .log-line {
          opacity: 0;
          transform: translateY(12px);
          background: rgba(0, 255, 153, 0.08);
          padding: 4px 8px;
          border-radius: 10px;
          border-left: 3px solid #00ff99;
          font-size: 0.7rem;
          animation: slideIn 0.4s forwards;
          word-break: break-word;
          line-height: 1rem;
        }
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .trading-bot-card .progress-container {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 255, 153, 0.1);
          padding: 4px 8px;
          border-radius: 30px;
          border: 1.5px solid #00ff99;
          width: 110px;
          height: 36px;
          box-shadow: 0 0 8px #00ff99;
          user-select: none;
          font-size: 0.85rem;
        }
        .trading-bot-card .progress-circle {
          width: 30px;
          height: 30px;
          transform: rotate(-90deg);
          flex-shrink: 0;
        }
        .trading-bot-card .progress-bg,
        .trading-bot-card .progress-bar {
          fill: none;
          stroke-width: 4;
        }
        .trading-bot-card .progress-bg {
          stroke: #003322;
          opacity: 0.4;
        }
        .trading-bot-card .progress-bar {
          stroke: #00ff99;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }
        .trading-bot-card .progress-text {
          font-family: 'Orbitron', monospace;
          color: #00ff99;
          user-select: none;
          white-space: nowrap;
          min-width: 30px;
          text-align: left;
          font-weight: 600;
        }
      `}</style>
      <div
        className="trading-bot-card"
        ref={cardRef}
        onClick={handleStart}
        data-can-start={canStart}
        title={
          canStart
            ? `Click to start trading bot. ${walletData.growth.clicksLeft} run(s) left.`
            : "Conditions not met to start bot"
        }
      >
        <canvas ref={canvasRef}></canvas>

        <div className="ai-avatar">
          <svg
            viewBox="0 0 64 64"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M16 32 Q24 16 40 16 Q48 32 40 48 Q24 48 16 32"
              fill="none"
              stroke="#00ff99"
              strokeWidth="2"
            />
            <circle cx="24" cy="28" r="3" fill="#00ff99" />
            <circle cx="40" cy="28" r="3" fill="#00ff99" />
            <line
              x1="24"
              y1="36"
              x2="40"
              y2="36"
              stroke="#00ff99"
              strokeWidth="2"
            />
            <line
              x1="32"
              y1="48"
              x2="32"
              y2="56"
              stroke="#00ff99"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="progress-container">
          <svg viewBox="0 0 100 100" className="progress-circle">
            <circle className="progress-bg" cx="50" cy="50" r="45"></circle>
            <circle
              className="progress-bar"
              ref={progressBarRef}
              cx="50"
              cy="50"
              r="45"
            ></circle>
          </svg>
          <div className="progress-text">{getProgressText()}</div>
        </div>

        <div ref={logRef} className="log">
          {logs.map((log, index) => (
            <div key={index} className="log-line">
              {log}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
