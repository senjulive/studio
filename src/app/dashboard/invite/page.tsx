import { InviteView } from '@/components/dashboard/invite-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Invite - AstralCore",
    description: "Invite new members to your squad and earn rewards.",
};

export default function InvitePage() {
  return (
    <QuantumPageWrapper
      title="Invite Friends"
      description="Invite new members to your squad and earn rewards"
    >
      <InviteView />
    </QuantumPageWrapper>
  );
}
