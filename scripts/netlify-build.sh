#!/bin/bash

# Netlify Build Script for AstralCore Crypto Trading Platform
# This script handles Netlify-specific build requirements

set -e

echo "🚀 Starting Netlify build for AstralCore..."

# Set environment variables for Netlify
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NETLIFY=true

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out node_modules/.cache

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci --only=production
fi

# Run the build
echo "🔨 Building application..."
npm run build

# Verify build success
if [ -d ".next" ]; then
  echo "✅ Build completed successfully!"
  echo "📁 Build directory: .next"
  echo "📊 Build stats:"
  ls -la .next/
else
  echo "❌ Build failed - .next directory not found"
  exit 1
fi

echo "🎉 Netlify build completed!"
