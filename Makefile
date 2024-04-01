.PHONY: build-dev
build-dev: ## Build the development docker image.
	docker build -f docker/production/Dockerfile -t easypanel-nextjs:0.0.1 --target development .

.PHONY: start-dev
start-dev: ## Start the development docker container.
	docker run -d -p 3000:3000 -v ./_data:/data --env-file .env.development --restart unless-stopped easypanel-nextjs:0.0.1

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	docker stop $$(docker ps -a -q --filter ancestor=easypanel-nextjs:0.0.1)

.PHONY: build-staging
build-staging: ## Build the staging docker image.
	docker build -f docker/production/Dockerfile -t easypanel-nextjs:0.0.1 .

.PHONY: start-staging
start-staging: ## Start the staging docker container.
	docker run -d -p 3000:3000 -v ./_data:/data --env-file .env.staging --restart unless-stopped easypanel-nextjs:0.0.1

.PHONY: stop-staging
stop-staging: ## Stop the staging docker container.
	docker stop $$(docker ps -a -q --filter ancestor=easypanel-nextjs:0.0.1)

.PHONY: build-prod
build-prod: ## Build the production docker image.
	docker build -f docker/production/Dockerfile -t easypanel-nextjs:0.0.1 .

.PHONY: start-prod
start-prod: ## Start the production docker container.
	docker run -d -p 3000:3000 -v ./_data:/data --env-file .env.production --restart unless-stopped easypanel-nextjs:0.0.1

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	docker stop $$(docker ps -a -q --filter ancestor=easypanel-nextjs:0.0.1)
