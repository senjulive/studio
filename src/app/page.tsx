import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { LearnMoreModal } from '@/components/ui/learn-more-modal';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { ArrowRight, Zap, Brain, TrendingUp, Shield, Cpu, Sparkles, Globe, ChevronDown, Play, Star, CheckCircle, Rocket, Atom, Waves, Wifi } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="purple relative min-h-dvh overflow-hidden bg-black">
      {/* Dynamic Neural Background */}
      <div className="fixed inset-0 z-0">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-purple-950/80 to-cyan-950/70 animate-pulse" 
             style={{animationDuration: '4s'}} />
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>

        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="rgb(147,51,234)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          
          {/* Dynamic neural connections */}
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none"/>
          <path d="M100,400 Q300,300 500,400 T900,400" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '0.8s'}}/>
          <path d="M100,600 Q300,500 500,600 T900,600" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '1.6s'}}/>
          <path d="M100,800 Q300,700 500,800 T900,800" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '2.4s'}}/>
          
          {/* Neural nodes */}
          <circle cx="200" cy="200" r="4" fill="rgb(59,130,246)" className="animate-pulse" opacity="0.8"/>
          <circle cx="500" cy="300" r="4" fill="rgb(147,51,234)" className="animate-pulse" opacity="0.8" style={{animationDelay: '0.5s'}}/>
          <circle cx="800" cy="500" r="4" fill="rgb(6,182,212)" className="animate-pulse" opacity="0.8" style={{animationDelay: '1s'}}/>
        </svg>

        {/* Holographic grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Top Status Bar */}
      <div className="relative z-40 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Live AI Status */}
          <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-red-500/30">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            <span className="text-red-400 font-bold text-xs sm:text-sm tracking-wider">● QUANTUM AI LIVE</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Badge variant="outline" className="hidden sm:flex border-green-400/40 text-green-300 bg-green-400/10 px-3 py-1">
              <Wifi className="w-3 h-3 mr-1" />
              99.9% Uptime
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative z-30 flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-4 text-center">
        
        {/* Quantum Logo Animation */}
        <div className="relative mb-8 sm:mb-12">
          {/* Rotating energy rings */}
          <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40">
            <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute inset-2 border-2 border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
            <div className="absolute inset-4 border-2 border-cyan-400/50 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
            
            {/* Pulsing core */}
            <div className="absolute inset-6 bg-gradient-radial from-blue-500/20 to-transparent rounded-full animate-pulse"></div>
          </div>
          
          {/* Central logo */}
          <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
            <AstralLogo className="h-16 w-16 sm:h-20 sm:w-20 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{animationDelay: '0s'}} />
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(147,51,234,0.8)]" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.8)]" style={{animationDelay: '1.5s'}} />
        </div>

        {/* Main Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3 leading-tight tracking-tight">
            AstralCore
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Atom className="w-5 h-5 text-blue-400 animate-spin" style={{animationDuration: '3s'}} />
            <p className="text-lg sm:text-xl text-blue-300 font-light tracking-[0.2em] uppercase">
              Quantum Nexus v4.0
            </p>
            <Atom className="w-5 h-5 text-purple-400 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}} />
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-lg">
          <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-400/10 px-3 py-1.5">
            <Brain className="w-3 h-3 mr-1" />
            Neural AI
          </Badge>
          <Badge variant="outline" className="border-purple-400/50 text-purple-300 bg-purple-400/10 px-3 py-1.5">
            <Rocket className="w-3 h-3 mr-1" />
            Quantum Trading
          </Badge>
          <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 bg-cyan-400/10 px-3 py-1.5">
            <Sparkles className="w-3 h-3 mr-1" />
            Auto Profits
          </Badge>
        </div>

        {/* Main Description */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
          Harness the power of 
          <span className="text-blue-400 font-semibold"> Quantum AI</span> to transform
          market volatility into <span className="text-cyan-400 font-semibold">autonomous profits</span> with 
          next-generation neural trading algorithms.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)] transition-all duration-300 rounded-xl border border-blue-400/30">
            <Link href="/login">
              <Rocket className="mr-2 h-5 w-5" />
              Launch Trading
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <LearnMoreModal>
            <Button variant="outline" size="lg" className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50 px-8 py-4 text-lg backdrop-blur-xl hover:border-blue-400/50 transition-all duration-300 rounded-xl">
              <Brain className="mr-2 h-5 w-5" />
              Explore AI
            </Button>
          </LearnMoreModal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-blue-400 opacity-60" />
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="relative z-30 py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
              Meet Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum Assistant</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Powered by cutting-edge quantum algorithms that process millions of market signals 
              in real-time to execute profitable trades 24/7.
            </p>
          </div>

          {/* Enhanced AI Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            
            {/* Neural Core Card */}
            <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Faa19381a004d49dabf38b45dce30fd13?format=webp&width=800"
                    alt="Quantum Neural Core"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-blue-500/10 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Floating AI indicators */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-blue-300 text-xs font-medium">NEURAL</span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-400" />
                      Quantum Neural Core
                    </h3>
                    <p className="text-blue-300 text-sm leading-relaxed">Advanced pattern recognition with quantum-enhanced prediction algorithms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adaptive Engine Card */}
            <Card className="group relative overflow-hidden border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(147,51,234,0.2)] hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fe6907f8837fa4ec59f563ce0222ba35c?format=webp&width=800"
                    alt="Adaptive Learning Engine"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-500/10 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-purple-300 text-xs font-medium">ADAPTIVE</span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      Adaptive Engine
                    </h3>
                    <p className="text-purple-300 text-sm leading-relaxed">Self-evolving AI that learns from market conditions and optimizes strategies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Matrix Card */}
            <Card className="group relative overflow-hidden border-cyan-400/20 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(6,182,212,0.2)] hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F52f48e5632374229b8d5254907e7dc34?format=webp&width=800"
                    alt="Risk Management Matrix"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-cyan-500/10 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-cyan-300 text-xs font-medium">MATRIX</span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      Risk Matrix
                    </h3>
                    <p className="text-cyan-300 text-sm leading-relaxed">Intelligent position sizing with quantum-secured portfolio protection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-blue-400/20 bg-blue-900/10 backdrop-blur-xl hover:bg-blue-900/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-12 h-12 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center border border-blue-400/30">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Quantum Processing</h3>
                <p className="text-gray-400 text-xs sm:text-sm">10M+ data points per second with quantum-inspired algorithms</p>
              </CardContent>
            </Card>

            <Card className="border-purple-400/20 bg-purple-900/10 backdrop-blur-xl hover:bg-purple-900/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-12 h-12 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center border border-purple-400/30">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Grid Mastery</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Advanced grid strategies profit from any market direction</p>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20 bg-cyan-900/10 backdrop-blur-xl hover:bg-cyan-900/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-12 h-12 mx-auto bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-400/30">
                    <Shield className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">Risk Protection</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Multi-layer security with real-time portfolio monitoring</p>
              </CardContent>
            </Card>

            <Card className="border-green-400/20 bg-green-900/10 backdrop-blur-xl hover:bg-green-900/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-12 h-12 mx-auto bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center border border-green-400/30">
                    <Sparkles className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-white mb-2">24/7 Automation</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Never miss opportunities with continuous market analysis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Performance Stats */}
      <section className="relative z-30 py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Floating stats cards */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Quantum Performance Metrics
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
                    99.9%
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base">Uptime Reliability</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-bold text-purple-400 mb-2 flex items-center justify-center gap-2">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                    3.2%
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base">Daily Return Avg</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-bold text-cyan-400 mb-2 flex items-center justify-center gap-2">
                    <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />
                    75ms
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base">Execution Speed</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                    75K+
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base">Active Traders</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-30 border-t border-gray-800/50 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          
          {/* Trust Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Leading <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Crypto Exchanges</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Our quantum AI technology powers trading strategies across the world's most prestigious platforms
            </p>
          </div>

          {/* Enhanced Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              <div className="relative text-center p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quantum Security</h3>
                <p className="text-gray-300 text-sm">Military-grade encryption with quantum-resistant protocols</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl" />
              <div className="relative text-center p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-400/30">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Proven Results</h3>
                <p className="text-gray-300 text-sm">$5.2B+ trading volume with consistent profitable outcomes</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
              <div className="relative text-center p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-400/30">
                  <Globe className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Network</h3>
                <p className="text-gray-300 text-sm">Trusted by 75,000+ traders across 180+ countries worldwide</p>
              </div>
            </div>
          </div>

          {/* Enhanced Exchange Icons */}
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col items-center space-y-6">
              
              {/* Copyright */}
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm animate-pulse" />
                    <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                      <AstralLogo className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-bold text-lg">AstralCore</span>
                    <div className="text-gray-500 text-sm">Quantum Nexus v4.0</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  © 2024 AstralCore Technologies. All rights reserved.
                </div>
              </div>

              {/* Enhanced Exchange Icons */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-4">
                {/* Modern styled exchange icons with improved mobile layout */}
                <div className="group transition-all duration-300 hover:scale-110">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl flex items-center justify-center border border-yellow-400/30 backdrop-blur-xl">
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                      <path d="M16 2L8 10L10 12L16 6L22 12L24 10L16 2Z" fill="#F3BA2F"/>
                      <path d="M2 16L4 14L6 16L4 18L2 16Z" fill="#F3BA2F"/>
                      <path d="M10 16L16 10L22 16L20 18L16 14L12 18L10 16Z" fill="#F3BA2F"/>
                      <path d="M26 16L28 14L30 16L28 18L26 16Z" fill="#F3BA2F"/>
                      <path d="M22 20L16 26L10 20L12 18L16 22L20 18L22 20Z" fill="#F3BA2F"/>
                    </svg>
                  </div>
                </div>

                <div className="group transition-all duration-300 hover:scale-110">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center border border-blue-400/30 backdrop-blur-xl">
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="white">
                      <circle cx="16" cy="16" r="12" fill="white"/>
                      <rect x="12" y="12" width="8" height="8" rx="1" fill="#0052FF"/>
                    </svg>
                  </div>
                </div>

                <div className="group transition-all duration-300 hover:scale-110">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl flex items-center justify-center border border-orange-400/30 backdrop-blur-xl">
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                      <path d="M4 8L16 2L28 8V24L16 30L4 24V8Z" fill="#F7931A"/>
                      <path d="M10 12L16 9L22 12V20L16 23L10 20V12Z" fill="white"/>
                      <circle cx="16" cy="16" r="2.5" fill="#F7931A"/>
                    </svg>
                  </div>
                </div>

                <div className="group transition-all duration-300 hover:scale-110">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl flex items-center justify-center border border-purple-400/30 backdrop-blur-xl">
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="12" fill="#5741D9"/>
                      <path d="M8 12C8 12 12 8 16 12C20 8 24 12 24 12C24 16 20 20 16 16C12 20 8 16 8 12Z" fill="white"/>
                      <circle cx="16" cy="14" r="1.5" fill="#5741D9"/>
                    </svg>
                  </div>
                </div>

                <div className="group transition-all duration-300 hover:scale-110">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl flex items-center justify-center border border-green-400/30 backdrop-blur-xl">
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="12" fill="#24AE8F"/>
                      <path d="M12 8L16 12L20 8L24 12L20 16L24 20L20 24L16 20L12 24L8 20L12 16L8 12L12 8Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
