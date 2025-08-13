import { NotificationCenterMobile } from '@/components/dashboard/notification-center-mobile';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Inbox - AstralCore",
    description: "View your notifications, announcements, and active promotions.",
};

export default function InboxPage() {
  return (
    <NotificationCenterMobile />
  );
}
