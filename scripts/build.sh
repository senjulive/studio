#!/bin/bash

# Build optimization script for Vercel and Netlify
echo "Starting AstralCore build process..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next
rm -rf out

# Install dependencies if needed
echo "Checking dependencies..."
npm ci

# Type checking
echo "Running type check..."
npm run typecheck

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
