import { MarketView } from '@/components/dashboard/market-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Live Market - Astral Core",
    description: "Real-time cryptocurrency market data.",
};

export default function MarketPage() {
  return (
    <MarketView />
  );
}
