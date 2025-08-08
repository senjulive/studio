import { ProTraderView } from '@/components/dashboard/pro-trader-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Astral Core Trading - Tiers & Ranks",
    description: "Learn about the trading tiers and account ranks on the AstralCore platform.",
};

export default function TradingPage() {
  return (
    <QuantumPageWrapper
      title="Astral Core Trading"
      description="Advanced trading bot with Grid Trading technology"
    >
      <ProTraderView />
    </QuantumPageWrapper>
  );
}
