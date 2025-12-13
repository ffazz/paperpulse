.PHONY: help docker-check docker-build docker-up docker-down docker-logs docker-shell docker-migrate docker-seed docker-clean dev-db-up dev-db-down

help:
	@echo "PaperPulse Docker Commands"
	@echo ""
	@echo "Docker Production:"
	@echo "  make docker-check    - Check Docker installation"
	@echo "  make docker-build    - Build production image"
	@echo "  make docker-up       - Start production containers"
	@echo "  make docker-down     - Stop production containers"
	@echo "  make docker-logs     - View production logs"
	@echo "  make docker-shell    - Shell into app container"
	@echo "  make docker-migrate  - Run migrations"
	@echo "  make docker-seed     - Seed database"
	@echo "  make docker-clean    - Remove all containers and volumes"
	@echo ""
	@echo "Development Database:"
	@echo "  make dev-db-up       - Start dev database only"
	@echo "  make dev-db-down     - Stop dev database"
	@echo "  make dev-db-logs     - View dev database logs"
	@echo ""

# Docker production targets
docker-check:
	@echo "Checking Docker installation..."
	@docker --version && echo "✓ Docker found"
	@docker-compose --version && echo "✓ Docker Compose found"

docker-build:
	@echo "Building Docker image..."
	@docker-compose build

docker-up:
	@echo "Starting containers..."
	@docker-compose up -d
	@echo "✓ Services started"
	@echo "  App: http://localhost:3000"
	@echo "  pgAdmin: http://localhost:5050"

docker-down:
	@echo "Stopping containers..."
	@docker-compose down

docker-logs:
	@docker-compose logs -f app

docker-shell:
	@docker-compose exec app sh

docker-migrate:
	@echo "Running migrations..."
	@docker-compose exec app npx prisma migrate deploy
	@echo "✓ Migrations completed"

docker-seed:
	@echo "Seeding database..."
	@docker-compose exec app npx prisma db seed
	@echo "✓ Database seeded"

docker-clean:
	@echo "Removing containers and volumes..."
	@docker-compose down -v
	@echo "✓ Cleanup completed"

# Development database targets
dev-db-up:
	@echo "Starting development database..."
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "✓ Database started on localhost:5432"

dev-db-down:
	@echo "Stopping development database..."
	@docker-compose -f docker-compose.dev.yml down

dev-db-logs:
	@docker-compose -f docker-compose.dev.yml logs -f postgres

dev-pgadmin:
	@echo "pgAdmin started at http://localhost:5050"
	@docker-compose -f docker-compose.dev.yml logs pgadmin
