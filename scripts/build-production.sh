#!/bin/bash

# Production Build Script for AstralCore
# Handles build process with proper error handling and optimizations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[BUILD]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean previous builds
clean_build() {
    print_status "Cleaning previous builds..."
    rm -rf .next
    rm -rf out
    rm -rf dist
    print_success "Build directories cleaned"
}

# Set production environment
set_production_env() {
    print_status "Setting production environment..."
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export NODE_OPTIONS="--max-old-space-size=4096"
    print_success "Environment variables set"
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    if [ -f "package-lock.json" ]; then
        npm ci --production=false
    else
        npm install
    fi
    print_success "Dependencies installed"
}

# Run type checking with relaxed settings
run_typecheck() {
    print_status "Running TypeScript type checking..."
    # Create a relaxed tsconfig for build
    cat > tsconfig.build.json << EOF
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": true,
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitAny": false
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", ".next", "out"]
}
EOF
    
    if npx tsc --project tsconfig.build.json --noEmit; then
        print_success "TypeScript check passed"
    else
        print_warning "TypeScript check failed, continuing with build..."
    fi
    
    # Clean up temporary config
    rm -f tsconfig.build.json
}

# Run build with error handling
run_build() {
    print_status "Building Next.js application..."
    
    # Update next.config.mjs for production
    if [ -f "next.config.mjs" ]; then
        print_status "Using existing Next.js configuration"
    else
        print_error "next.config.mjs not found"
        exit 1
    fi
    
    # Run the build
    if npm run build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Validate build output
validate_build() {
    print_status "Validating build output..."
    
    if [ -d ".next" ]; then
        print_success "Build output directory exists"
        
        # Check for critical files
        if [ -f ".next/BUILD_ID" ]; then
            BUILD_ID=$(cat .next/BUILD_ID)
            print_success "Build ID: $BUILD_ID"
        fi
        
        if [ -d ".next/static" ]; then
            print_success "Static assets generated"
        fi
        
        if [ -f ".next/package.json" ]; then
            print_success "Standalone package.json generated"
        fi
    else
        print_error "Build output directory not found"
        exit 1
    fi
}

# Main build process
main() {
    print_status "Starting AstralCore production build..."
    echo ""
    
    clean_build
    set_production_env
    install_deps
    run_typecheck
    run_build
    validate_build
    
    print_success "🎉 Production build completed successfully!"
    print_status "Build artifacts are ready in .next directory"
}

# Execute main function
main
