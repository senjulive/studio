
import { PublicChatView } from '@/components/dashboard/public-chat-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Public Chat - AstralCore",
    description: "Engage with the AstralCore community in real-time.",
};

export default function PublicChatPage() {
  return (
    <div className="h-[calc(100vh-10rem)]">
      <PublicChatView />
    </div>
  );
}
