# FlashTicket Engine - Developer Task Automation

.PHONY: help test test-parallel analyze lint lint-fix types format dev up down

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

test: ## Run Pest / PHPUnit tests
	php artisan test

test-parallel: ## Run test suite in parallel
	php artisan test --parallel

analyze: ## Run PHPStan static analysis (Level 8)
	./vendor/bin/phpstan analyse --memory-limit=2G

lint: ## Check backend & frontend formatting and linting
	./vendor/bin/pint --test
	npm run lint:check
	npm run format:check

lint-fix: ## Automatically fix backend and frontend styling
	./vendor/bin/pint
	npm run lint
	npm run format

types: ## Validate TypeScript type definitions
	npm run types:check

dev: ## Start local Vite development server
	npm run dev

up: ## Start local Docker dependencies (PostgreSQL, Redis, Mailpit)
	docker compose up -d

down: ## Stop local Docker dependencies
	docker compose down

