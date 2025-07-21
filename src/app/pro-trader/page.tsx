import { ProTraderView } from '@/components/dashboard/pro-trader-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Pro Trader - AstralCore",
    description: "Advanced grid trading interface for pro users.",
};

export default function ProTraderPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4 sm:p-6 bg-slate-900">
      <ProTraderView />
    </main>
  );
}
