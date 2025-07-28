
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import users from '../data/users.json';

const SESSION_COOKIE_NAME = 'astral-session';

export async function login(credentials: any) {
    if (!credentials.email || !credentials.password) {
        return { error: 'Email and password are required.' };
    }

    const user = (users as Record<string, any>)[credentials.email];

    if (!user || user.password !== credentials.password) {
        return { error: 'Invalid email or password.' };
    }

    const sessionData = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    
    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
    
    return { error: null };
}

export async function register(credentials: any) {
    if (!credentials.email || !credentials.password) {
        return { error: 'Email and password are required.' };
    }
    // In a real app, you would save the new user to the database.
    // For this mock, we don't persist new users.
    console.log("Mock Registration Attempt for:", credentials.email, credentials.options.data);
    
    // Automatically log in the new user
    const sessionData = {
        id: `new-user-${Date.now()}`,
        email: credentials.email,
        username: credentials.options.data.username,
    };

    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });
    
    return { error: null };
}

export async function logout() {
    cookies().delete(SESSION_COOKIE_NAME);
    redirect('/');
}

export async function resetPasswordForEmail(email: string) {
    console.log("Mock Password Reset requested for:", email);
    return null;
}
