'use client';

import { CommunityBlog } from '@/components/dashboard/community-blog';
import { ChatPageAdmin } from '@/components/admin/chat-page-admin';
import { useAdminStatus } from '@/hooks/use-admin-status';
import type { Metadata } from 'next';

export default function ChatPage() {
  const { isAdminOrModerator } = useAdminStatus();

  return (
    <div className="space-y-6">
      {isAdminOrModerator && <ChatPageAdmin />}
      <CommunityBlog />
    </div>
  );
}
