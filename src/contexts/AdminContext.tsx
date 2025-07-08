
'use client';

import * as React from 'react';

const AdminContext = React.createContext<{ adminPassword: string | null }>({
  adminPassword: null,
});

export const AdminProvider = AdminContext.Provider;

export const useAdmin = () => React.useContext(AdminContext);
