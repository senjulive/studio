import { TradingInfoView } from '@/components/dashboard/trading-info-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Trading Tiers & Ranks - AstralCore",
    description: "Learn about the trading tiers and account ranks on the AstralCore platform.",
};

export default function TradingInfoPage() {
  return (
    <QuantumPageWrapper
      title="Trading Tiers & Ranks"
      description="Learn about the trading tiers and account ranks on the AstralCore platform"
    >
      <TradingInfoView />
    </QuantumPageWrapper>
  );
}
