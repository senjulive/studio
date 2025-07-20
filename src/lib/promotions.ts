
'use server';

// This is a mock implementation. In a real app, this would query a database.

export type Promotion = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'Upcoming' | 'Active' | 'Expired';
};

// Mock data to be used in the absence of a database.
const mockPromotions: Promotion[] = [
    {
        id: 'promo-1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Summer Trading Bonus',
        description: 'Get a 10% bonus on all deposits made during the summer. Don\'t miss out on this limited-time offer!',
        image_url: 'https://placehold.co/600x400.png',
        status: 'Active',
    },
    {
        id: 'promo-2',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Referral Rewards',
        description: 'Invite your friends to join AstralCore and both of you will receive a $25 bonus when they make their first deposit.',
        image_url: 'https://placehold.co/600x400.png',
        status: 'Active',
    },
    {
        id: 'promo-3',
        created_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Upcoming: VIP Grid Challenge',
        description: 'Compete with other traders in our VIP Grid Challenge. Top performers will win exclusive prizes and a share of a $10,000 prize pool. Starts next week!',
        status: 'Upcoming',
    }
];

// Fetches all promotions from the mock data.
export async function getPromotions(): Promise<Promotion[]> {
    // Simulating an API call
    return Promise.resolve(mockPromotions);
}
