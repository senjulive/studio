import { ProfileView } from "@/components/dashboard/profile-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Profile - AstralCore",
    description: "Manage your profile and view notifications.",
};

export default function ProfilePage() {
    return (
        <ProfileView />
    );
}
