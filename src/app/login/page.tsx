import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center p-4 bg-background overflow-hidden"
    >
      <div className="relative">
        <div className="absolute -left-1/3 top-1/2 -translate-y-1/2 w-[300px] h-[300px] z-0 hidden md:block opacity-80">
          <dotlottie-wc 
              src="https://lottie.host/6f880ec6-a07a-43fb-9e71-505f775c31e0/J5KkqAUDYv.lottie" 
              style={{width: '300px', height: '300px'}} 
              speed="1" 
              autoplay 
              loop>
          </dotlottie-wc>
        </div>
        <div className="relative z-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
