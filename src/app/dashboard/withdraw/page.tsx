import { WithdrawView } from '@/components/dashboard/withdraw-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';

export default function WithdrawPage() {
  return (
    <QuantumPageWrapper
      title="Withdraw Funds"
      description="Transfer your earnings to your external wallet"
    >
      <WithdrawView />
    </QuantumPageWrapper>
  );
}
