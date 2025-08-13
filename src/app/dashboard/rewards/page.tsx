import { RewardsViewMobile } from '@/components/dashboard/rewards-view-mobile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rewards - AstralCore",
    description: "Claim rewards for your achievements and squad referrals.",
};

export default function RewardsPage() {
  return (
    <RewardsViewMobile />
  );
}
