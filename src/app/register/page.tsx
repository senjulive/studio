import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AstralLogo } from "@/components/icons/astral-logo";
import { Brain, Zap, Shield, TrendingUp, Users, Globe, Award, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - AstralCore",
    description: "Create your AstralCore account.",
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      {/* Hero Banner with Crypto Network */}
      <div className="relative h-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Ff2f1e22fb1424efbade2ab911a446901?format=webp&width=1920')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/60 to-blue-900/90" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Join the <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Quantum Revolution</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">Create your AstralCore account and start automated trading</p>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 sm:left-8">
          <Badge variant="outline" className="border-purple-400/50 text-purple-300 bg-purple-400/10 animate-pulse">
            <Users className="w-3 h-3 mr-1" />
            50K+ Traders
          </Badge>
        </div>
        <div className="absolute top-4 right-4 sm:right-8">
          <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-400/10 animate-pulse">
            <Award className="w-3 h-3 mr-1" />
            #1 AI Platform
          </Badge>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-10rem)] items-start justify-center p-4 py-8">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Left Side - Feature Cards */}
          <div className="hidden xl:block space-y-6">
            {/* AI Brain Card */}
            <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F455981bebcca4f578c6e51a508f1d4e7?format=webp&width=800"
                    alt="Artificial Intelligence"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">Quantum Intelligence</h3>
                    <p className="text-blue-300 text-sm">Advanced AI that learns and adapts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Square Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="group border-purple-400/20 bg-purple-900/10 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-white mb-1">Smart Trading</h4>
                  <p className="text-xs text-purple-300">AI-powered decisions</p>
                </CardContent>
              </Card>

              <Card className="group border-cyan-400/20 bg-cyan-900/10 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-white mb-1">Secure</h4>
                  <p className="text-xs text-cyan-300">Bank-level protection</p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits List */}
            <Card className="border-green-400/20 bg-green-900/10 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  Member Benefits
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span>$5 Welcome Bonus</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span>24/7 AI Trading</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <span>Squad Referral System</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    <span>VIP Tier Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Registration Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {/* Mobile Hero - Only visible on smaller screens */}
              <div className="xl:hidden mb-6">
                <Card className="border-purple-400/20 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AstralLogo className="h-8 w-8 text-purple-400" />
                        <div>
                          <h2 className="text-sm font-bold text-white">AstralCore AI</h2>
                          <p className="text-xs text-gray-300">Quantum Trading</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-400/10 text-xs">
                        Free Account
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <RegisterForm />
            </div>
          </div>

          {/* Right Side - Visual Elements */}
          <div className="hidden xl:block space-y-6">
            {/* AI Robot Card */}
            <Card className="group relative overflow-hidden border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fd72854716aa64419b8ee08255a39ecea?format=webp&width=800"
                    alt="AI Robot"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">Your AI Assistant</h3>
                    <p className="text-purple-300 text-sm">Ready to trade for you 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-blue-400/20 bg-blue-900/10 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">99.7%</div>
                  <div className="text-xs text-blue-300">Success Rate</div>
                </CardContent>
              </Card>

              <Card className="border-green-400/20 bg-green-900/10 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">2.8%</div>
                  <div className="text-xs text-green-300">Daily Return</div>
                </CardContent>
              </Card>
            </div>

            {/* Bitcoin Security */}
            <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500">
              <CardContent className="p-0">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fa2491b59a9954c639f7ba11de7b12709?format=webp&width=800"
                    alt="Secure Trading"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-bold text-white mb-1">Secure & Encrypted</h4>
                    <p className="text-blue-300 text-xs">Your funds are protected by military-grade security</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-1/4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/2 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-1/4 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-1/3 right-4 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-60" />
    </main>
  );
}
