
'use client';

import * as React from 'react';

type AdminContextType = {
    adminPassword: string | null;
    setAdminPassword: React.Dispatch<React.SetStateAction<string | null>> | null;
}

const AdminContext = React.createContext<AdminContextType>({
    adminPassword: null,
    setAdminPassword: null,
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    // In a real app, this would be a more secure way to manage the admin's session or proof of auth.
    // For this prototype, we'll just keep it simple and store the password in context for API calls.
    const [adminPassword, setAdminPassword] = React.useState<string | null>(null);

    return (
        <AdminContext.Provider value={{ adminPassword, setAdminPassword }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => React.useContext(AdminContext);
