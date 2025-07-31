import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AstralLogo } from "@/components/icons/astral-logo";
import { Brain, Zap, Shield, TrendingUp } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Top Banner with AI Brain */}
      <div className="relative h-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F455981bebcca4f578c6e51a508f1d4e7?format=webp&width=1920')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back to <span className="text-blue-400">AstralCore</span>
            </h1>
            <p className="text-gray-300 text-sm">Access your quantum trading intelligence</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left Side - Image Cards */}
          <div className="hidden lg:block space-y-6">
            {/* AI Robot Card */}
            <Card className="group relative overflow-hidden border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fd72854716aa64419b8ee08255a39ecea?format=webp&width=800"
                    alt="AI Trading Robot"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">Quantum AI Assistant</h3>
                    <p className="text-purple-300 text-sm">Advanced neural networks analyzing market patterns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Bitcoin Security Card */}
              <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fa2491b59a9954c639f7ba11de7b12709?format=webp&width=800"
                      alt="Secure Bitcoin Wallet"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white mb-1">Secure Wallet</h4>
                      <p className="text-blue-300 text-xs">Bank-level encryption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crypto Network Card */}
              <Card className="group relative overflow-hidden border-green-400/20 bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm hover:border-green-400/40 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Ff2f1e22fb1424efbade2ab911a446901?format=webp&width=800"
                      alt="Cryptocurrency Network"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white mb-1">Multi-Asset</h4>
                      <p className="text-green-300 text-xs">50+ cryptocurrencies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-blue-900/20 border border-blue-400/20">
                <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-blue-300">Quantum AI</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-900/20 border border-purple-400/20">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-purple-300">24/7 Trading</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-cyan-900/20 border border-cyan-400/20">
                <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-cyan-300">Secure</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-900/20 border border-green-400/20">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-green-300">Profitable</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Mobile Banner - Only visible on small screens */}
              <div className="lg:hidden mb-6">
                <Card className="border-blue-400/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AstralLogo className="h-10 w-10 text-blue-400" />
                      <div>
                        <h2 className="text-lg font-bold text-white">Quantum Trading</h2>
                        <p className="text-xs text-gray-300">Powered by AI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <LoginForm />

              {/* Stats Footer */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-400">99.7%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">50K+</div>
                  <div className="text-xs text-gray-400">Users</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">2.8%</div>
                  <div className="text-xs text-gray-400">Daily Avg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-1/4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/3 right-12 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-1/4 left-12 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-1/3 right-8 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60" />
    </main>
  );
}
