.PHONY: build-production
build-production: ## Build the production docker image.
	BUILDKIT_PROGRESS=plain docker compose build

.PHONY: start-production
start-production: ## Start the production docker container.
	BUILDKIT_PROGRESS=plain docker compose up -d

.PHONY: start-migration
start-migration: ## Start the production docker container.
	BUILDKIT_PROGRESS=plain docker compose run web npm run db:migrate:prod

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	BUILDKIT_PROGRESS=plain docker compose down
