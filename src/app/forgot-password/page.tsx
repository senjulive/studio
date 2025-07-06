import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Forgot Password - Astral Core",
    description: "Reset your password.",
};


export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4">
      <ForgotPasswordForm />
    </main>
  );
}
