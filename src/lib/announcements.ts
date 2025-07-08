
export type Announcement = {
  id: string;
  title: string;
  date: string;
  content: string;
};

// Default announcements used as a fallback if the database is empty.
export const defaultAnnouncements: Omit<Announcement, 'id' | 'date'>[] = [
  {
    title: '🎉 Welcome to the New AstralCore Platform!',
    content: 'We are thrilled to launch our redesigned platform. Explore the new features, including the Squad System and AI Growth Engine. We appreciate your feedback!',
  },
  {
    title: 'Security Update: Withdrawal Addresses',
    content: 'For your security, once a withdrawal address is saved, it cannot be changed directly. Please contact support if you need to update your address. This measure helps protect your assets from unauthorized access.',
  },
  {
    title: 'Scheduled Maintenance on July 20th',
    content: 'The platform will undergo scheduled maintenance on July 20th from 02:00 to 04:00 UTC. The AI Growth Engine may be temporarily unavailable during this period. Thank you for your understanding.',
  },
];
