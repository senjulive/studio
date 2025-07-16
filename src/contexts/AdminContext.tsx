'use client';

import * as React from 'react';

// The context is now simplified as auth is handled by Supabase session
const AdminContext = React.createContext({});

export const AdminProvider = AdminContext.Provider;

export const useAdmin = () => React.useContext(AdminContext);