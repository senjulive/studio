import { SquadSystem } from '@/components/dashboard/squad-system';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';

export default function SquadPage() {
  return (
    <QuantumPageWrapper
      title="Squad System"
      description="Join a clan and compete with other traders"
    >
      <SquadSystem />
    </QuantumPageWrapper>
  );
}
