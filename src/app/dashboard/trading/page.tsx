import { ComprehensiveTradingBot } from '@/components/dashboard/comprehensive-trading-bot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore Trading Bot - Advanced AI Trading",
    description: "Control your AI-powered trading bot with advanced features and real-time analytics.",
};

export default function TradingPage() {
  return (
    <ComprehensiveTradingBot />
  );
}
