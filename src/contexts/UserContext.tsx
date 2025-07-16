'use client';

import * as React from 'react';
import type { User } from '@supabase/supabase-js';

const UserContext = React.createContext<{ user: User | null }>({ user: null });

export const UserProvider = UserContext.Provider;

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
