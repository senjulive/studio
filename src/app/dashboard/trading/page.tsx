import { TradingInfoView } from '@/components/dashboard/trading-info-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Astral Core Trading - Tiers & Ranks",
    description: "Learn about the trading tiers and account ranks on the AstralCore platform.",
};

export default function TradingPage() {
  return (
    <div className="space-y-6">
      <TradingInfoView />
    </div>
  );
}
