import { MarketView } from '@/components/dashboard/market-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Global Markets - AstralCore",
    description: "Real-time data for Crypto, Stocks, Commodities, and Forex markets.",
};

export default function MarketPage() {
  return (
    <QuantumPageWrapper
      title="Global Markets"
      description="Real-time data for Crypto, Stocks, Commodities, and Forex markets"
    >
      <MarketView />
    </QuantumPageWrapper>
  );
}
