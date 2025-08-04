'use client';

import { CommunityBlog } from '@/components/dashboard/community-blog';
import { ChatPageAdmin } from '@/components/admin/chat-page-admin';
import { useAdminStatus } from '@/hooks/use-admin-status';
import type { Metadata } from 'next';

export default function ChatPage() {
  const { isAdmin, canModerateChat } = useAdminStatus();

  return (
    <div className="space-y-6">
      {(isAdmin || canModerateChat) && <ChatPageAdmin />}
      <CommunityBlog />
    </div>
  );
}
