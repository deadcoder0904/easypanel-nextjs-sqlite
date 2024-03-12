.PHONY: build-dev
build-dev: ## Build the development docker image.
	BUILDKIT_PROGRESS=plain docker compose -f docker/development/docker-compose.yml build

.PHONY: start-dev
start-dev: ## Start the development docker container.
	BUILDKIT_PROGRESS=plain docker compose -f docker/development/docker-compose.yml up -d

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	BUILDKIT_PROGRESS=plain docker compose -f docker/development/docker-compose.yml down

.PHONY: build-stag
build-stag: ## Build the staging docker image.
	BUILDKIT_PROGRESS=plain docker compose -f docker/staging/docker-compose.yml build

.PHONY: start-stag
start-stag: ## Start the staging docker container.
	BUILDKIT_PROGRESS=plain docker compose -f docker/staging/docker-compose.yml up -d

.PHONY: stop-stag
stop-stag: ## Stop the staging docker container.
	BUILDKIT_PROGRESS=plain docker compose -f docker/staging/docker-compose.yml down

.PHONY: build-prod
build-prod: ## Build the production docker image.
	BUILDKIT_PROGRESS=plain docker compose -f docker/production/docker-compose.yml build

.PHONY: start-prod
start-prod: ## Start the production docker container.
	BUILDKIT_PROGRESS=plain docker compose -f docker/production/docker-compose.yml up -d

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	BUILDKIT_PROGRESS=plain docker compose -f docker/production/docker-compose.yml down
