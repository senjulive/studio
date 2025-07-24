import { ProfileView } from "@/components/dashboard/profile-view";
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: "Profile - AstralCore",
    description: "Manage your profile, verification status, and view notifications.",
};

export default function ProfilePage() {
    return (
        <>
            <Script
                src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js"
                type="module"
                strategy="lazyOnload"
            />
            <ProfileView />
        </>
    );
}
