import { InboxView } from '@/components/dashboard/inbox-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Inbox - AstralCore",
    description: "View your notifications, announcements, and active promotions.",
};

export default function InboxPage() {
  return (
    <QuantumPageWrapper
      title="Inbox"
      description="View your notifications, announcements, and active promotions"
    >
      <InboxView />
    </QuantumPageWrapper>
  );
}
