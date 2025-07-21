#!/bin/bash

# Crypto Trading Platform Startup Script
# This script handles both development and production deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
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

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Check for Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check for npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f backend/.env ]; then
        print_warning ".env file not found. Creating from example..."
        cp backend/.env.example backend/.env
        print_warning "Please edit backend/.env and add your API keys before running the application."
    fi
    
    # Create logs directory
    mkdir -p backend/logs
    
    print_success "Environment setup complete!"
}

# Function to build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    cd frontend
    npm run build
    cd ..
    print_success "Frontend built successfully!"
}

# Function to start development server
start_development() {
    print_status "Starting development environment..."
    
    # Check if ports are available
    if ! check_port 3001; then
        print_error "Port 3001 is already in use. Please stop the process using this port."
        exit 1
    fi
    
    if ! check_port 5173; then
        print_error "Port 5173 is already in use. Please stop the process using this port."
        exit 1
    fi
    
    # Start backend in background
    print_status "Starting backend server on port 3001..."
    cd backend
    NODE_ENV=development npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    print_status "Starting frontend server on port 5173..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started!"
    print_status "Backend: http://localhost:3001"
    print_status "Frontend: http://localhost:5173"
    print_status "API Health Check: http://localhost:3001/api/health"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Shutting down servers..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Servers stopped."
        exit 0
    }
    
    # Register cleanup function
    trap cleanup SIGINT SIGTERM
    
    # Wait for user to stop
    print_status "Press Ctrl+C to stop the servers..."
    wait
}

# Function to start production server
start_production() {
    print_status "Starting production environment..."
    
    # Build frontend first
    build_frontend
    
    # Check if port is available
    if ! check_port 3001; then
        print_error "Port 3001 is already in use. Please stop the process using this port."
        exit 1
    fi
    
    # Check if PM2 is installed for production
    if command_exists pm2; then
        print_status "Starting with PM2 process manager..."
        cd backend
        NODE_ENV=production pm2 start ecosystem.config.js
        cd ..
        print_success "Production server started with PM2!"
        print_status "Server: http://localhost:3001"
        print_status "API Health Check: http://localhost:3001/api/health"
        print_status "Use 'pm2 stop crypto-trading-backend' to stop the server"
        print_status "Use 'pm2 logs crypto-trading-backend' to view logs"
    else
        print_warning "PM2 not found. Starting with node directly..."
        cd backend
        NODE_ENV=production npm start
        cd ..
    fi
}

# Function to stop production server
stop_production() {
    if command_exists pm2; then
        print_status "Stopping PM2 processes..."
        pm2 stop crypto-trading-backend 2>/dev/null || print_warning "No PM2 process found"
        pm2 delete crypto-trading-backend 2>/dev/null || true
        print_success "Production server stopped!"
    else
        print_warning "PM2 not found. Please manually stop the node process."
    fi
}

# Function to show help
show_help() {
    echo "Crypto Trading Platform Startup Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install all dependencies"
    echo "  setup       Setup environment files"
    echo "  dev         Start development servers"
    echo "  build       Build frontend for production"
    echo "  start       Start production server"
    echo "  stop        Stop production server"
    echo "  restart     Restart production server"
    echo "  logs        Show production server logs (requires PM2)"
    echo "  status      Show server status (requires PM2)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install && $0 setup && $0 dev    # Setup and start development"
    echo "  $0 build && $0 start                # Build and start production"
}

# Function to show logs
show_logs() {
    if command_exists pm2; then
        pm2 logs crypto-trading-backend
    else
        print_error "PM2 not found. Cannot show logs."
        exit 1
    fi
}

# Function to show status
show_status() {
    if command_exists pm2; then
        pm2 status crypto-trading-backend
    else
        print_error "PM2 not found. Cannot show status."
        exit 1
    fi
}

# Main script logic
case "${1:-help}" in
    install)
        install_dependencies
        ;;
    setup)
        setup_environment
        ;;
    dev)
        install_dependencies
        setup_environment
        start_development
        ;;
    build)
        build_frontend
        ;;
    start)
        start_production
        ;;
    stop)
        stop_production
        ;;
    restart)
        stop_production
        sleep 2
        start_production
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac