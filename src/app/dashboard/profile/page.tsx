import { ProfileView } from "@/components/dashboard/profile-view";
import { QuantumPageWrapper } from '@/components/layout/quantum-page-wrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Profile - AstralCore",
    description: "Manage your profile, verification status, and view notifications.",
};

export default function ProfilePage() {
    return (
        <QuantumPageWrapper
            title="User Profile"
            description="Manage your account settings and verification status"
        >
            <ProfileView />
        </QuantumPageWrapper>
    );
}
