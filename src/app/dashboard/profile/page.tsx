import { ProfileView } from "@/components/dashboard/profile-view";
import { ProfilePageAdmin } from "@/components/admin/profile-page-admin";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Profile - AstralCore",
    description: "Manage your profile, KYC status, and view notifications.",
};

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <ProfilePageAdmin />
            <ProfileView />
        </div>
    );
}
