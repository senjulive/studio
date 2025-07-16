
'use client';

import * as React from 'react';

const AdminContext = React.createContext({
    adminPassword: null
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    // In a real app, this would be a more secure way to manage the admin's session or proof of auth.
    // For this prototype, we'll just keep it simple.
    const [adminPassword, setAdminPassword] = React.useState(null);

    return (
        <AdminContext.Provider value={{ adminPassword, setAdminPassword }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => React.useContext(AdminContext);
