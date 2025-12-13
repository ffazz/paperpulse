#!/bin/bash

# PaperPulse Docker Setup Script
# Usage: ./docker-setup.sh [start|stop|build|logs|shell]

set -e

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="paperpulse"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if docker-compose is installed
check_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Build images
build_images() {
    print_info "Building Docker images..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME build
    print_success "Images built successfully"
}

# Start containers
start_containers() {
    print_info "Starting containers..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d
    print_success "Containers started"
    print_info "Application: http://localhost:3000"
    print_info "pgAdmin: http://localhost:5050 (admin@paperpulse.local / admin)"
    print_info "Database: localhost:5432"
}

# Stop containers
stop_containers() {
    print_info "Stopping containers..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down
    print_success "Containers stopped"
}

# View logs
view_logs() {
    print_info "Showing logs (Ctrl+C to exit)..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f app
}

# Run shell in app container
run_shell() {
    print_info "Opening shell in app container..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec app sh
}

# Run database migrations
run_migrations() {
    print_info "Running Prisma migrations..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec app npx prisma migrate deploy
    print_success "Migrations completed"
}

# Seed database
seed_database() {
    print_info "Seeding database..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME exec app npx prisma db seed
    print_success "Database seeded"
}

# Remove everything
cleanup() {
    print_info "Cleaning up containers and volumes..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down -v
    print_success "Cleanup completed"
}

# Main script logic
main() {
    local command=${1:-help}

    case $command in
        check)
            check_docker
            check_compose
            ;;
        build)
            check_docker
            check_compose
            build_images
            ;;
        start)
            check_docker
            check_compose
            build_images
            start_containers
            ;;
        stop)
            check_docker
            check_compose
            stop_containers
            ;;
        restart)
            check_docker
            check_compose
            stop_containers
            start_containers
            ;;
        logs)
            check_docker
            check_compose
            view_logs
            ;;
        shell)
            check_docker
            check_compose
            run_shell
            ;;
        migrate)
            check_docker
            check_compose
            run_migrations
            ;;
        seed)
            check_docker
            check_compose
            seed_database
            ;;
        clean)
            check_docker
            check_compose
            cleanup
            ;;
        help|*)
            echo "PaperPulse Docker Management"
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  check      - Check if Docker and Docker Compose are installed"
            echo "  build      - Build Docker images"
            echo "  start      - Build and start all containers"
            echo "  stop       - Stop all containers"
            echo "  restart    - Restart all containers"
            echo "  logs       - View application logs (live)"
            echo "  shell      - Open shell in app container"
            echo "  migrate    - Run database migrations"
            echo "  seed       - Seed database with initial data"
            echo "  clean      - Remove all containers and volumes"
            echo "  help       - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 start          # Build and start everything"
            echo "  $0 logs           # View live logs"
            echo "  $0 shell          # Access container shell"
            echo "  $0 migrate        # Run migrations"
            ;;
    esac
}

main "$@"
