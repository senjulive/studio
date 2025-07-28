import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Welcome to AstralCore
          </h1>
          <p className="max-w-2xl text-lg">
            Your intelligent crypto management platform.
          </p>
          <Link href="/login" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
