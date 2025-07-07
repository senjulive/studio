'use client';

export type Announcement = {
  id: string;
  title: string;
  date: string;
  content: string;
};

const ANNOUNCEMENTS_STORAGE_KEY = 'astral-announcements';

const defaultAnnouncements: Omit<Announcement, 'id' | 'date'>[] = [
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

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch (e) {
    return fallback;
  }
}

// Function to initialize default announcements if none exist
function initializeAnnouncements() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    if (!stored || JSON.parse(stored).length === 0) {
        const announcementsToStore: Announcement[] = defaultAnnouncements.map((ann, index) => ({
            ...ann,
            id: `default-${index}-${Date.now()}`,
            date: new Date(Date.now() - (defaultAnnouncements.length - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        })).reverse();
        localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcementsToStore));
    }
}

// Run initialization once
if (typeof window !== 'undefined') {
    initializeAnnouncements();
}

export function getAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
  const announcements = safeJsonParse<Announcement[]>(stored, []);
  return announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addAnnouncement(title: string, content: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (typeof window === 'undefined') return;

    const announcements = getAnnouncements();
    const newAnnouncement: Announcement = {
        id: `announcement-${Date.now()}`,
        title,
        content,
        date: new Date().toISOString().split('T')[0],
    };
    announcements.unshift(newAnnouncement);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
}

export async function deleteAnnouncement(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (typeof window === 'undefined') return;

    let announcements = getAnnouncements();
    announcements = announcements.filter(ann => ann.id !== id);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
}
