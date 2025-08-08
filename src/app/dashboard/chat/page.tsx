import { PublicChatView } from '@/components/dashboard/public-chat-view';
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Public Chat - AstralCore",
    description: "Engage with the AstralCore community in the public chat.",
};

export default function ChatPage() {
  return (
    <QuantumPageWrapper
      title="Community Chat"
      description="Engage with the AstralCore community"
    >
      <PublicChatView />
    </QuantumPageWrapper>
  );
}
