'use client';

export type Announcement = {
  id: string;
  title: string;
  date: string;
  content: string;
  read: boolean; // This could be managed in user state later
};

const announcements: Announcement[] = [
  {
    id: '1',
    title: '🎉 Welcome to the New Astral Core Platform!',
    date: '2024-07-15',
    content: 'We are thrilled to launch our redesigned platform. Explore the new features, including the Squad System and AI Growth Engine. We appreciate your feedback!',
    read: false,
  },
  {
    id: '2',
    title: 'Security Update: Withdrawal Addresses',
    date: '2024-07-10',
    content: 'For your security, once a withdrawal address is saved, it cannot be changed directly. Please contact support if you need to update your address. This measure helps protect your assets from unauthorized access.',
    read: false,
  },
  {
    id: '3',
    title: 'Scheduled Maintenance on July 20th',
    date: '2024-07-05',
    content: 'The platform will undergo scheduled maintenance on July 20th from 02:00 to 04:00 UTC. The AI Growth Engine may be temporarily unavailable during this period. Thank you for your understanding.',
    read: true,
  },
];

export function getAnnouncements(): Announcement[] {
  // In a real app, this would fetch from a server and cross-reference read status.
  // For now, we return the static list.
  return announcements;
}
