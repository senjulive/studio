import { TradingBotMobile } from '@/components/dashboard/trading-bot-mobile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore Trading Bot - Advanced AI Trading",
    description: "Control your AI-powered trading bot with advanced features and real-time analytics.",
};

export default function TradingPage() {
  return (
    <TradingBotMobile />
  );
}
