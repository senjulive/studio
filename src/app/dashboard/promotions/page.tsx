import { PromotionsView } from '@/components/dashboard/promotions-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Promotions - AstralCore",
    description: "Check out the latest promotions and special offers.",
};

export default function PromotionsPage() {
  return (
    <QuantumPageWrapper
      title="Promotions"
      description="Check out the latest promotions and special offers"
    >
      <PromotionsView />
    </QuantumPageWrapper>
  );
}
