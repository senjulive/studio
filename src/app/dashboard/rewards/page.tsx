import { RewardsView } from '@/components/dashboard/rewards-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rewards - AstralCore",
    description: "Claim rewards for your achievements and squad referrals.",
};

export default function RewardsPage() {
  return (
    <QuantumPageWrapper
      title="Rewards Center"
      description="Claim rewards for your achievements and squad referrals"
    >
      <RewardsView />
    </QuantumPageWrapper>
  );
}
