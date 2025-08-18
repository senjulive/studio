import { ComprehensiveMarket } from '@/components/dashboard/comprehensive-market';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Global Markets - AstralCore",
    description: "Real-time data for Crypto, Stocks, Commodities, and Forex markets.",
};

export default function MarketPage() {
  return (
    <ComprehensiveMarket />
  );
}
