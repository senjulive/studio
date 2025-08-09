import { DepositView } from '@/components/dashboard/deposit-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';

export default function DepositPage() {
  return (
    <QuantumPageWrapper
      title="Deposit Funds"
      description="Add funds to your AstralCore wallet to start trading"
    >
      <DepositView />
    </QuantumPageWrapper>
  );
}
