import { ModernProfileView } from "@/components/dashboard/modern-profile-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Profile - AstralCore",
    description: "Manage your profile, verification status, and view notifications.",
};

export default function ProfilePage() {
    return (
        <ModernProfileView />
    );
}
