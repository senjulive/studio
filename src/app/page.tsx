import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { ArrowRight, Zap, Brain, TrendingUp, Shield, Cpu, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Top Banner */}
      <section className="relative z-10 h-32 sm:h-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F15d29863e19d4693b48a94b86f8336da?format=webp&width=1920')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold text-sm sm:text-base">● LIVE QUANTUM AI</span>
            </div>
            <div className="text-white font-medium text-sm sm:text-base">
              Next-Generation Trading Bot Active
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-400/10 animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              99.7% Uptime
            </Badge>
            <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-400/10">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.8% Daily Avg
            </Badge>
          </div>
        </div>

        {/* Floating AI Elements */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-300">
            <Brain className="w-4 h-4 animate-pulse" />
            <span>AI Neural Processing...</span>
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
      </section>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12 animate-in fade-in-50 duration-1000">
            <div className="flex items-center justify-center gap-3 mb-6">
              <AstralLogo className="h-16 w-16 text-blue-400" />
              <div className="text-left">
                <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AstralCore
                </h1>
                <p className="text-xl text-blue-300 font-light tracking-wider">QUANTUM NEXUS v3.76</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-400/10">
                <Cpu className="w-3 h-3 mr-1" />
                Quantum AI
              </Badge>
              <Badge variant="outline" className="border-purple-400/50 text-purple-300 bg-purple-400/10">
                <Brain className="w-3 h-3 mr-1" />
                Neural Grid Trading
              </Badge>
              <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 bg-cyan-400/10">
                <Sparkles className="w-3 h-3 mr-1" />
                Autonomous Profits
              </Badge>
            </div>

            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Experience the future of cryptocurrency trading with our revolutionary
              <span className="text-blue-400 font-semibold"> Quantum AI Bot</span> that transforms
              market volatility into consistent, automated profits using advanced neural networks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg shadow-2xl shadow-blue-500/25">
                <Link href="/login">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                <Brain className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Bot Showcase */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Meet Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum Trading Assistant</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by cutting-edge AI technology, our quantum bot analyzes millions of market data points
              in real-time to execute profitable trades 24/7.
            </p>
          </div>

          {/* Image Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Card 1 - Astral Quantum */}
            <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Faa19381a004d49dabf38b45dce30fd13?format=webp&width=800"
                    alt="Astral Quantum AI"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Quantum Neural Core</h3>
                    <p className="text-blue-300 text-sm">Advanced pattern recognition and market prediction algorithms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Astral Core */}
            <Card className="group relative overflow-hidden border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fe6907f8837fa4ec59f563ce0222ba35c?format=webp&width=800"
                    alt="Astral Core AI"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Adaptive Learning Engine</h3>
                    <p className="text-purple-300 text-sm">Self-improving AI that evolves with market conditions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Astral Core Advanced */}
            <Card className="group relative overflow-hidden border-cyan-400/20 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F52f48e5632374229b8d5254907e7dc34?format=webp&width=800"
                    alt="Astral Core Advanced AI"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Risk Management Matrix</h3>
                    <p className="text-cyan-300 text-sm">Intelligent position sizing and portfolio protection systems</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-400/20 bg-blue-900/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Quantum Processing</h3>
                <p className="text-gray-400 text-sm">Processes 10M+ data points per second using quantum-inspired algorithms</p>
              </CardContent>
            </Card>

            <Card className="border-purple-400/20 bg-purple-900/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Grid Trading Mastery</h3>
                <p className="text-gray-400 text-sm">Advanced grid strategies that profit from market volatility in any direction</p>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20 bg-cyan-900/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Risk Protection</h3>
                <p className="text-gray-400 text-sm">Multi-layer risk management with real-time portfolio monitoring</p>
              </CardContent>
            </Card>

            <Card className="border-green-400/20 bg-green-900/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">24/7 Automation</h3>
                <p className="text-gray-400 text-sm">Never miss an opportunity with continuous market analysis and execution</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
            Proven Performance Metrics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">99.7%</div>
              <div className="text-gray-300">Uptime Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-2">2.8%</div>
              <div className="text-gray-300">Average Daily Return</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">150ms</div>
              <div className="text-gray-300">Execution Speed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-2">50,000+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future of Trading?
          </h2>
        </div>
      </section>
    </main>
  );
}
