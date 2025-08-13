#!/bin/bash

# AstralCore Crypto Trading Platform - Deployment Script
# Supports both Netlify and Vercel deployments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
error() { echo -e "${RED}❌ Error: $1${NC}" >&2; }
success() { echo -e "${GREEN}✅ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Script header
echo -e "${BLUE}"
echo "================================================"
echo "  AstralCore Crypto Platform - Deploy Script"
echo "================================================"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Parse command line arguments
PLATFORM=""
ENVIRONMENT="production"
FORCE_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--platform)
            PLATFORM="$2"
            shift 2
            ;;
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -f|--force)
            FORCE_BUILD=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -p, --platform     Platform to deploy to (netlify|vercel|both)"
            echo "  -e, --environment  Environment (production|staging|preview)"
            echo "  -f, --force        Force rebuild even if no changes"
            echo "  -h, --help         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --platform vercel"
            echo "  $0 --platform netlify --environment staging"
            echo "  $0 --platform both --force"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Auto-detect platform if not specified
if [ -z "$PLATFORM" ]; then
    if [ -n "$VERCEL" ]; then
        PLATFORM="vercel"
        info "Detected Vercel environment"
    elif [ -n "$NETLIFY" ]; then
        PLATFORM="netlify"
        info "Detected Netlify environment"
    else
        warning "No platform specified and none detected"
        echo "Available platforms: netlify, vercel, both"
        read -p "Which platform would you like to deploy to? " PLATFORM
    fi
fi

# Validate platform
case $PLATFORM in
    netlify|vercel|both)
        info "Deploying to: $PLATFORM"
        ;;
    *)
        error "Invalid platform: $PLATFORM. Use 'netlify', 'vercel', or 'both'"
        exit 1
        ;;
esac

# Pre-deployment checks
info "Running pre-deployment checks..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE="20"
if [[ $(echo "$NODE_VERSION < $REQUIRED_NODE" | bc -l) -eq 1 ]]; then
    error "Node.js version $REQUIRED_NODE or higher required. Current: $NODE_VERSION"
    exit 1
fi
success "Node.js version check passed ($NODE_VERSION)"

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ "$FORCE_BUILD" = true ]; then
    info "Installing dependencies..."
    npm ci
    success "Dependencies installed"
else
    info "Dependencies already installed"
fi

# Environment file check
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    warning "No environment file found (.env.local or .env)"
    warning "Make sure environment variables are set in your deployment platform"
fi

# Type checking
info "Running TypeScript type check..."
if npm run typecheck; then
    success "Type check passed"
else
    error "Type check failed"
    exit 1
fi

# Linting (if ESLint is configured)
if command -v npx eslint &> /dev/null; then
    info "Running ESLint..."
    if npm run lint; then
        success "Linting passed"
    else
        warning "Linting issues found (not blocking deployment)"
    fi
fi

# Build the application
info "Building application for $ENVIRONMENT..."
export NODE_ENV=$ENVIRONMENT
export NEXT_TELEMETRY_DISABLED=1

if npm run build; then
    success "Build completed successfully"
else
    error "Build failed"
    exit 1
fi

# Platform-specific deployment
deploy_to_netlify() {
    info "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Check if site is linked
    if [ ! -f ".netlify/state.json" ]; then
        warning "Site not linked to Netlify. Please run 'netlify link' first"
        return 1
    fi
    
    # Deploy based on environment
    case $ENVIRONMENT in
        production)
            netlify deploy --prod --dir=.next
            ;;
        staging|preview)
            netlify deploy --dir=.next
            ;;
        *)
            netlify deploy --dir=.next
            ;;
    esac
    
    success "Netlify deployment completed"
}

deploy_to_vercel() {
    info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy based on environment
    case $ENVIRONMENT in
        production)
            vercel --prod
            ;;
        staging|preview)
            vercel
            ;;
        *)
            vercel
            ;;
    esac
    
    success "Vercel deployment completed"
}

# Execute deployment
case $PLATFORM in
    netlify)
        deploy_to_netlify
        ;;
    vercel)
        deploy_to_vercel
        ;;
    both)
        deploy_to_netlify
        deploy_to_vercel
        ;;
esac

# Post-deployment tasks
info "Running post-deployment tasks..."

# Warm up the application (optional)
if [ "$ENVIRONMENT" = "production" ]; then
    info "Warming up production deployment..."
    # Add your production URL here when you have one
    # curl -s "https://your-production-url.com" > /dev/null || true
fi

# Generate sitemap (if applicable)
if [ -f "scripts/generate-sitemap.js" ]; then
    info "Generating sitemap..."
    node scripts/generate-sitemap.js
fi

# Success message
echo -e "${GREEN}"
echo "================================================"
echo "🚀 Deployment completed successfully!"
echo "================================================"
echo -e "${NC}"

info "Platform: $PLATFORM"
info "Environment: $ENVIRONMENT"
info "Build time: $(date)"

# Display URLs if available
if [ "$PLATFORM" = "vercel" ] || [ "$PLATFORM" = "both" ]; then
    if [ -n "$VERCEL_URL" ]; then
        info "Vercel URL: https://$VERCEL_URL"
    fi
fi

if [ "$PLATFORM" = "netlify" ] || [ "$PLATFORM" = "both" ]; then
    if [ -n "$DEPLOY_PRIME_URL" ]; then
        info "Netlify URL: $DEPLOY_PRIME_URL"
    fi
fi

echo ""
success "🎉 AstralCore is ready for trading!"
