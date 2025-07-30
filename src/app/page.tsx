import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { LearnMoreModal } from '@/components/ui/learn-more-modal';
import { ArrowRight, Zap, Brain, TrendingUp, Shield, Cpu, Sparkles, Globe } from 'lucide-react';

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
              <LearnMoreModal>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </LearnMoreModal>
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

      {/* Exchange Partnerships Footer */}
      <footer className="relative z-10 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Partnerships Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Leading <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Crypto Exchanges</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our quantum AI technology powers trading strategies across the world's most prestigious cryptocurrency platforms
            </p>
          </div>

          {/* Exchange Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            {/* Binance */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-400 transition-colors">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-yellow-400 transition-colors">Binance</span>
            </div>

            {/* Coinbase */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-400 transition-colors">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-blue-400 transition-colors">Coinbase</span>
            </div>

            {/* Bybit */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-400 transition-colors">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-orange-400 transition-colors">Bybit</span>
            </div>

            {/* Kraken */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-400 transition-colors">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-purple-400 transition-colors">Kraken</span>
            </div>

            {/* KuCoin */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-400 transition-colors">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-green-400 transition-colors">KuCoin</span>
            </div>

            {/* Gate.io */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-400 transition-colors">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-indigo-400 transition-colors">Gate.io</span>
            </div>

            {/* Huobi */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-400 transition-colors">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-red-400 transition-colors">Huobi</span>
            </div>

            {/* OKX */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-400 transition-colors">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-cyan-400 transition-colors">OKX</span>
            </div>

            {/* Upbit */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-pink-400 transition-colors">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-pink-400 transition-colors">Upbit</span>
            </div>

            {/* Bitfinex */}
            <div className="group flex flex-col items-center p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-400 transition-colors">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-emerald-400 transition-colors">Bitfinex</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-400/20">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bank-Level Security</h3>
              <p className="text-gray-300 text-sm">Advanced encryption and multi-layer security protocols protect your assets</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg border border-green-400/20">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Proven Performance</h3>
              <p className="text-gray-300 text-sm">$2.1B+ trading volume with consistent profitable results</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-400/20">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Network</h3>
              <p className="text-gray-300 text-sm">Trusted by 50,000+ traders across 150+ countries worldwide</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="border-t border-gray-800/50 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">API Access</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Mobile App</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Status</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Compliance</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Telegram</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800/50">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <AstralLogo className="h-8 w-8 text-blue-400" />
                <span className="text-white font-semibold">AstralCore</span>
                <span className="text-gray-500">Quantum Nexus v3.76</span>
              </div>
              <div className="text-gray-400 text-sm">
                © 2024 AstralCore Technologies. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
