import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Forgot Password - Astral Core",
    description: "Reset your password.",
};


export default function ForgotPasswordPage() {
  return (
    <main
      className="relative flex min-h-dvh items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('https://czbzm.wapaxo.com/filedownload/82581/pngwing-com-12-(czbzm.wapaxo.com).png')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
