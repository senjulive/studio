import { ProTraderView } from '@/components/dashboard/pro-trader-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Astral Core Trading - Dashboard",
    description: "Engage with the CORE Nexus Quantum v3.76 trading bot.",
};

export default function DashboardPage() {
  return (
    <ProTraderView />
  );
}
