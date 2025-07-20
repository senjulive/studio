
'use client';

import * as React from 'react';

// A generic user type for when Supabase is removed.
type User = {
    id: string;
    email: string;
    // Add other user properties as needed
};

type UserContextType = {
    user: User | null;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, value }: { children: React.ReactNode, value: UserContextType }) => {
    return (
        <UserContext.Provider value={value}>
            {children}
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
