import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Forgot Password - Astral Core",
    description: "Reset your password.",
};


export default function ForgotPasswordPage() {
  return (
    <main
      className="relative flex min-h-dvh items-center justify-center bg-contain bg-no-repeat bg-center p-4 bg-black"
      style={{ backgroundImage: "url('https://czbzm.wapaxo.com/filedownload/82571/pngwing-com-7-(czbzm.wapaxo.com).png')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
