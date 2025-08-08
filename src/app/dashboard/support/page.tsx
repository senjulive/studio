import { CustomerSupportView } from "@/components/dashboard/customer-support-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Customer Support - AstralCore",
    description: "Get expert help from our AstralCore support team.",
};

export default function SupportPage() {
    return <CustomerSupportView />;
}
