import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - AstralCore",
    description: "Create your AstralCore account.",
};

export default function RegisterPage() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center p-4 bg-background"
    >
      <RegisterForm />
    </main>
  );
}
