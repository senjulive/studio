'use client';

import { ProfileView } from "@/components/dashboard/profile-view";
import { ProfilePageAdmin } from "@/components/admin/profile-page-admin";
import { useAdminStatus } from "@/hooks/use-admin-status";
import type { Metadata } from 'next';

export default function ProfilePage() {
    const { isAdmin } = useAdminStatus();

    return (
        <div className="space-y-6">
            {isAdmin && <ProfilePageAdmin />}
            <ProfileView />
        </div>
    );
}
