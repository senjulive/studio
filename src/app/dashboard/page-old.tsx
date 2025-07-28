import { WalletView } from '@/components/dashboard/wallet-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Dashboard - AstralCore",
    description: "View your crypto wallet, assets, and recent transactions.",
};

export default function DashboardPage() {
  return (
    <WalletView />
  );
}
