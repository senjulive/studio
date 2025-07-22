import { ProTraderView } from '@/components/dashboard/pro-trader-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Astral Core Trading - Tiers & Ranks",
    description: "Learn about the trading tiers and account ranks on the AstralCore platform.",
};

export default function TradingPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-slate-900">
        <ProTraderView />
    </main>
  );
}
