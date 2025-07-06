'use client';

// This file simulates a basic auth system using localStorage.

const CURRENT_USER_KEY = 'astral-current-user';

export async function login(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, email);
    }
}

export async function logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    if (typeof window !== 'undefined') {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
}

export function getCurrentUserEmail(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem(CURRENT_USER_KEY);
}
