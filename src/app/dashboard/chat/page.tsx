import { ChatViewMobile } from '@/components/dashboard/chat-view-mobile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Chat - AstralCore",
    description: "Chat with other AstralCore users about anything related to trading.",
};

export default function ChatPage() {
  return (
    <ChatViewMobile />
  );
}
