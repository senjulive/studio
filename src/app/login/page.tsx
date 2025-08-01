import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-500" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl animate-pulse delay-1500" />
      </div>

      <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md animate-fade-in">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
