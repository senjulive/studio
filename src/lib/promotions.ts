
'use server';

import { createClient } from "./supabase/server";

export type Promotion = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'Upcoming' | 'Active' | 'Expired';
};

// Fetches all promotions from Supabase
export async function getPromotions(): Promise<Promotion[]> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching promotions:", error);
            return [];
        }
        return data as Promotion[];
    } catch (e) {
        console.error("Exception fetching promotions:", e);
        return [];
    }
}
