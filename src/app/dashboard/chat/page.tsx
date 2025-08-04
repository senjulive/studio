import { CommunityBlog } from '@/components/dashboard/community-blog';
import { ChatPageAdmin } from '@/components/admin/chat-page-admin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Community Blog - AstralCore",
    description: "Share insights, tips, and connect with the AstralCore community through our interactive blog platform.",
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <ChatPageAdmin />
      <CommunityBlog />
    </div>
  );
}
