#!/bin/bash

# Enhanced Firebase Setup for ClinicalForge
# This script automates the complete Firebase setup process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
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

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_success "Node.js is installed ($(node --version))"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm is installed ($(npm --version))"
}

# Check if Firebase CLI is installed
check_firebase_cli() {
    print_status "Checking Firebase CLI installation..."
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI is not installed. Installing now..."
        npm install -g firebase-tools
        print_success "Firebase CLI installed"
    else
        print_success "Firebase CLI is installed ($(firebase --version))"
    fi
}

# Check if user is logged into Firebase
check_firebase_auth() {
    print_status "Checking Firebase authentication..."
    if ! firebase projects:list &> /dev/null; then
        print_warning "You are not logged into Firebase. Please run:"
        echo "firebase login"
        echo "Then run this script again."
        exit 1
    fi
    print_success "Firebase authentication verified"
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Run the appropriate setup script
run_setup() {
    print_status "Running Firebase setup..."
    
    # Check if we're in development mode
    if [ "$1" = "--dev" ] || [ "$1" = "-d" ]; then
        print_status "Running development setup..."
        npm run setup:firebase:quick
    else
        print_status "Running production setup..."
        npm run setup:firebase
    fi
}

# Main setup function
main() {
    print_header "Enhanced Firebase Setup for ClinicalForge"
    echo ""
    
    # Parse command line arguments
    SETUP_TYPE="production"
    if [ "$1" = "--dev" ] || [ "$1" = "-d" ]; then
        SETUP_TYPE="development"
    fi
    
    print_status "Setup type: $SETUP_TYPE"
    echo ""
    
    # Run checks
    check_node
    check_npm
    check_firebase_cli
    check_firebase_auth
    install_dependencies
    
    # Run setup
    run_setup "$1"
    
    echo ""
    print_header "Setup Complete!"
    echo ""
    
    if [ "$SETUP_TYPE" = "development" ]; then
        print_success "Development setup completed successfully!"
        echo ""
        print_status "Next steps:"
        echo "1. Run 'npm run dev:firebase:ui' to start development"
        echo "2. Open http://localhost:3000 to test the application"
        echo "3. Open http://localhost:4000 to view Firebase emulator UI"
        echo "4. Test the forms at http://localhost:3000/forms"
    else
        print_success "Production setup completed successfully!"
        echo ""
        print_status "Next steps:"
        echo "1. Update your .env.local with actual Firebase credentials"
        echo "2. Run 'npm run build' to build for production"
        echo "3. Run 'npm run firebase:deploy' to deploy to Firebase"
        echo "4. Test the forms in production"
    fi
    
    echo ""
    print_status "For more information, see:"
    echo "- FIREBASE_SETUP_GUIDE.md"
    echo "- ENHANCED_CLINICAL_DATABASE_DESIGN.md"
    echo "- DATABASE_IMPROVEMENTS_SUMMARY.md"
    echo ""
    print_success "Happy coding! 🚀"
}

# Show usage if help is requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Enhanced Firebase Setup for ClinicalForge"
    echo ""
    echo "Usage:"
    echo "  ./setup-firebase.sh          # Production setup"
    echo "  ./setup-firebase.sh --dev    # Development setup"
    echo "  ./setup-firebase.sh -d       # Development setup (short)"
    echo "  ./setup-firebase.sh --help   # Show this help"
    echo ""
    echo "Options:"
    echo "  --dev, -d    Run development setup with emulators"
    echo "  --help, -h   Show this help message"
    echo ""
    echo "Prerequisites:"
    echo "  - Node.js (v16 or higher)"
    echo "  - npm or yarn"
    echo "  - Git (for version control)"
    echo ""
    exit 0
fi

# Run the main function
main "$@" 