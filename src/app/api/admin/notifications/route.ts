
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    
    // For this app, we will assume a single admin user model.
    // In a real app, this would be more sophisticated.
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;
    
    // A simple way to find an admin user.
    const adminUser = users.find(u => u.email?.startsWith('admin'));
    if (!adminUser) {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    const { data: notifications, error } = await supabaseAdmin
        .from('notifications')
        .select(`*, user:profiles(username, full_name)`)
        .eq('user_id', adminUser.id)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
