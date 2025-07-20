
'use server';

// Mock implementation for promotions since Supabase is removed.

export type Promotion = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'Upcoming' | 'Active' | 'Expired';
};

const mockPromotions: Promotion[] = [
    {
        id: 'promo-1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        title: "Summer Trading Bonus",
        description: "Get a 10% bonus on all deposits made during the summer season. Don't miss out on this hot offer!",
        image_url: "https://placehold.co/600x400.png",
        status: "Active"
    },
    {
        id: 'promo-2',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        title: "New User Welcome Gift",
        description: "All new users who verify their account receive a free $25 trading voucher.",
        image_url: "https://placehold.co/600x400.png",
        status: "Active"
    }
];

// Fetches all promotions from the mock data
export async function getPromotions(): Promise<Promotion[]> {
    return mockPromotions;
}
