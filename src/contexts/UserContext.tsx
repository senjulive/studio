
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

type User = {
    id: string;
    email: string;
    username?: string;
};

type UserContextType = {
    user: User | null;
    isLoading: boolean;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                    // Redirect to login if not on an auth page
                    if (!['/', '/register', '/forgot-password'].includes(pathname)) {
                         router.push('/');
                    }
                }
            } catch (error) {
                setUser(null);
                if (!['/', '/register', '/forgot-password'].includes(pathname)) {
                    router.push('/');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [pathname, router]);

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <AstralLogo className="h-16 w-16 animate-pulse" />
                </div>
            ) : children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Dummy logo to prevent breaking during loading
const AstralLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
);
