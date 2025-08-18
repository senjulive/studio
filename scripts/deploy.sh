#!/bin/bash

# AstralCore Deployment Script
# Supports Netlify, Vercel, and dual deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PLATFORM="both"
ENVIRONMENT="production"
SKIP_BUILD=false
SKIP_INSTALL=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_dependencies() {
    if [ "$SKIP_INSTALL" = false ]; then
        print_status "Installing dependencies..."
        if [ -f "package-lock.json" ]; then
            npm ci
        else
            npm install
        fi
        print_success "Dependencies installed"
    else
        print_warning "Skipping dependency installation"
    fi
}

# Function to run build
run_build() {
    if [ "$SKIP_BUILD" = false ]; then
        print_status "Building project..."
        
        # Set environment variables for build
        export NODE_ENV=production
        export NEXT_TELEMETRY_DISABLED=1
        export NODE_OPTIONS="--max-old-space-size=4096"
        
        npm run build
        print_success "Build completed successfully"
    else
        print_warning "Skipping build step"
    fi
}

# Function to validate environment
validate_environment() {
    print_status "Validating deployment environment..."
    
    # Check Node.js version
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_status "Node.js version: $NODE_VERSION"
    else
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm version
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_status "npm version: $NPM_VERSION"
    else
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_warning "Netlify CLI not found, installing..."
        npm install -g netlify-cli
    fi
    
    # Deploy to Netlify
    if [ "$ENVIRONMENT" = "production" ]; then
        netlify deploy --prod --dir=.next
    else
        netlify deploy --dir=.next
    fi
    
    print_success "Netlify deployment completed"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_warning "Vercel CLI not found, installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod
    else
        vercel
    fi
    
    print_success "Vercel deployment completed"
}

# Function to run deployment checks
run_deployment_checks() {
    print_status "Running deployment readiness checks..."
    
    if [ -f "scripts/deployment-readiness.mjs" ]; then
        node scripts/deployment-readiness.mjs
    else
        print_warning "Deployment readiness script not found, skipping checks"
    fi
}

# Function to display help
show_help() {
    echo "AstralCore Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --platform PLATFORM    Deployment platform (netlify, vercel, both) [default: both]"
    echo "  --environment ENV       Environment (production, staging) [default: production]"
    echo "  --skip-build           Skip build step"
    echo "  --skip-install         Skip dependency installation"
    echo "  --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --platform netlify"
    echo "  $0 --platform vercel --environment staging"
    echo "  $0 --platform both --skip-build"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate platform argument
case $PLATFORM in
    netlify|vercel|both)
        ;;
    *)
        print_error "Invalid platform: $PLATFORM. Must be netlify, vercel, or both"
        exit 1
        ;;
esac

# Validate environment argument
case $ENVIRONMENT in
    production|staging)
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT. Must be production or staging"
        exit 1
        ;;
esac

# Main deployment process
main() {
    print_status "Starting AstralCore deployment..."
    print_status "Platform: $PLATFORM"
    print_status "Environment: $ENVIRONMENT"
    echo ""
    
    validate_environment
    install_dependencies
    run_build
    run_deployment_checks
    
    # Deploy based on platform choice
    case $PLATFORM in
        netlify)
            deploy_netlify
            ;;
        vercel)
            deploy_vercel
            ;;
        both)
            deploy_netlify
            deploy_vercel
            ;;
    esac
    
    print_success "Deployment completed successfully!"
    print_status "Platform: $PLATFORM | Environment: $ENVIRONMENT"
}

# Run main function
main
