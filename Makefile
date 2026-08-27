# ─────────────────────────────────────────────────────────────────
# Maze Runner Game — Developer CLI Shortcuts (Makefile)
# Usage: make <target>
# Prerequisites: Docker, Docker Compose, Java 21, Node 20, Maven
# ─────────────────────────────────────────────────────────────────

.PHONY: help infra-up infra-down dev backend-dev frontend-dev \
        backend-test backend-coverage frontend-test e2e-test test-all \
        build docker-build docker-push clean lint fmt check

# Detect OS for cross-platform compatibility
ifeq ($(OS),Windows_NT)
    OPEN := start
else
    OPEN := xdg-open
endif

## ─── Help ────────────────────────────────────────────────────────
help: ## Show this help message
	@echo ""
	@echo "  🧩 Maze Runner Game — Developer CLI"
	@echo "  ════════════════════════════════════"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2}'
	@echo ""

## ─── Infrastructure ──────────────────────────────────────────────
infra-up: ## Start infrastructure (PostgreSQL + Redis + Adminer + MailHog)
	docker-compose up -d postgres redis adminer mailhog
	@echo "✅ Infrastructure running:"
	@echo "   PostgreSQL: localhost:5432"
	@echo "   Redis:      localhost:6379"
	@echo "   Adminer:    http://localhost:8090"
	@echo "   MailHog:    http://localhost:8025"

infra-down: ## Stop infrastructure containers
	docker-compose stop postgres redis adminer mailhog

## ─── Development ─────────────────────────────────────────────────
dev: ## Start full stack with Docker Compose (all services)
	docker-compose up -d
	@echo "✅ Full stack running:"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8080"
	@echo "   Swagger:  http://localhost:8080/swagger-ui"
	@echo "   Adminer:  http://localhost:8090"
	@echo "   Grafana:  http://localhost:3001"
	@echo "   MailHog:  http://localhost:8025"

dev-down: ## Stop all Docker Compose services
	docker-compose down

dev-clean: ## Stop all services and remove volumes (WARNING: deletes data)
	docker-compose down -v --remove-orphans

backend-dev: ## Start backend in dev mode (requires infra-up first)
	cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

frontend-dev: ## Start frontend in dev mode (hot reload)
	cd frontend && npm run dev

## ─── Testing ─────────────────────────────────────────────────────
backend-test: ## Run backend unit tests
	cd backend && mvn clean test -Punit-tests --no-transfer-progress

backend-integration-test: ## Run backend integration tests (requires Docker)
	cd backend && mvn clean verify -Pintegration-tests --no-transfer-progress

backend-coverage: ## Run backend tests with JaCoCo coverage report
	cd backend && mvn clean verify -Pintegration-tests,coverage --no-transfer-progress
	@echo "Coverage report: backend/target/site/jacoco/index.html"

frontend-test: ## Run frontend unit tests (Vitest)
	cd frontend && npm run test

frontend-test-watch: ## Run frontend unit tests in watch mode
	cd frontend && npm run test:watch

frontend-coverage: ## Run frontend tests with coverage report
	cd frontend && npm run test:coverage
	@echo "Coverage report: frontend/coverage/index.html"

e2e-test: ## Run E2E tests (Cypress headless) — requires test stack running
	docker-compose -f docker-compose.test.yml up -d
	cd frontend && npm run cypress:run
	docker-compose -f docker-compose.test.yml down

e2e-open: ## Open Cypress interactive test runner
	cd frontend && npm run cypress:open

test-all: backend-coverage frontend-coverage e2e-test ## Run all tests with coverage

## ─── Build ───────────────────────────────────────────────────────
build: ## Build backend + frontend
	cd backend && mvn clean package -DskipTests --no-transfer-progress
	cd frontend && npm run build

docker-build: ## Build Docker images locally
	docker-compose build

docker-push: ## Push Docker images to GitHub Container Registry
	docker-compose push

## ─── Code Quality ────────────────────────────────────────────────
lint: ## Run linters (Checkstyle + SpotBugs + ESLint)
	cd backend && mvn checkstyle:check spotbugs:check --no-transfer-progress
	cd frontend && npm run lint

fmt: ## Format code (Prettier + Google Java Format)
	cd frontend && npm run format
	@echo "Java formatting: use your IDE or run spotless:apply"

check: ## Run all checks (lint + type-check + tests)
	cd frontend && npm run type-check && npm run lint
	cd backend && mvn checkstyle:check --no-transfer-progress

## ─── Utilities ───────────────────────────────────────────────────
clean: ## Clean build artifacts
	cd backend && mvn clean
	cd frontend && rm -rf dist coverage .nyc_output

logs: ## Tail Docker Compose logs
	docker-compose logs -f

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U $${POSTGRES_USER:-maze_user} -d $${POSTGRES_DB:-maze_runner}

redis-cli: ## Open Redis CLI
	docker-compose exec redis redis-cli -a $${REDIS_PASSWORD:-redis_password_dev}

swagger: ## Open Swagger UI in browser
	$(OPEN) http://localhost:8080/swagger-ui
