'use server';

import {createAdminClient} from '@/lib/supabase/admin';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();

    const {
      data: {users},
      error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw error;

    // Filter out the admin user from the list
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const regularUsers = users.filter(u => u.email !== adminEmail);

    return NextResponse.json(regularUsers);
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
