import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main
      className="relative flex min-h-dvh items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/auth-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </main>
  );
}
