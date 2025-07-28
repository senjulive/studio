
import { NextResponse } from 'next/server';
import users from '@/data/users.json';

export async function POST() {
    // This is a mock. In a real app, this would be a protected admin route.
    // We transform the data to match what the client component expects.
    const userList = Object.values(users).map(u => ({
        id: u.id,
        email: u.email,
        user_metadata: {
            username: u.username
        }
    }));
    return NextResponse.json(userList);
}
