'use client';

import { VerifyIdentityView } from "@/components/dashboard/verify-identity-view";
import { ProfilePageAdmin } from "@/components/admin/profile-page-admin";
import { useAdminStatus } from "@/hooks/use-admin-status";
import type { Metadata } from 'next';

export default function VerifyPage() {
    const { isAdmin, canVerifyProfiles } = useAdminStatus();

    return (
        <div className="space-y-6">
            {(isAdmin || canVerifyProfiles) && <ProfilePageAdmin />}
            <VerifyIdentityView />
        </div>
    );
}
