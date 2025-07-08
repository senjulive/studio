import { supabase } from '@/lib/supabase';

export type Announcement = {
  id: string;
  title: string;
  date: string;
  content: string;
};

const ANNOUNCEMENTS_KEY = 'announcements';

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

const initialAnnouncements: Announcement[] = defaultAnnouncements.map((ann, index) => ({
    ...ann,
    id: `default-${index}-${Date.now()}`,
    date: new Date(Date.now() - (defaultAnnouncements.length - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
})).reverse();


async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    // If not found, insert the default value and return it
    await supabase.from('settings').upsert({ key, value: defaultValue as any });
    return defaultValue;
  }
  return data.value as T;
}

async function saveSetting<T>(key: string, value: T): Promise<void> {
  const { error } = await supabase.from('settings').upsert({ key, value: value as any });
  if (error) {
    console.error(`Error saving setting ${key}:`, error);
    throw new Error(`Failed to save setting ${key}.`);
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const announcements = await getSetting<Announcement[]>(ANNOUNCEMENTS_KEY, initialAnnouncements);
  return announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addAnnouncement(title: string, content: string): Promise<void> {
    const announcements = await getAnnouncements();
    const newAnnouncement: Announcement = {
        id: `announcement-${Date.now()}`,
        title,
        content,
        date: new Date().toISOString().split('T')[0],
    };
    const updatedAnnouncements = [newAnnouncement, ...announcements];
    await saveSetting(ANNOUNCEMENTS_KEY, updatedAnnouncements);
}

export async function deleteAnnouncement(id: string): Promise<void> {
    let announcements = await getAnnouncements();
    announcements = announcements.filter(ann => ann.id !== id);
    await saveSetting(ANNOUNCEMENTS_KEY, announcements);
}