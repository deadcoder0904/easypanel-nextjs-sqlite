### easypanel-nextjs-sqlite

> Trying to get Next.js + SQLite combo working on [Easypanel](https://easypanel.io) with Docker

In real app, do not commit `.env.development` & `.env.production` to source control like Git. Add it to `.gitignore` & `.dockerignore` or better yet use [dotenvx](https://dotenvx.com) for environment variables.

NPM Scripts appended with `:prod` are production scripts and those without anything appended are scripts to be used in development.

### Development Side

1. `pnpm db:generate` generates migration files for `development` at `/src/app/db/migrations`
2. `pnpm db:migrate` generates `users.dev.sqlite` for `development`
3. `pnpm turbo` or `pnpm dev` runs the local server.
4. if you try to interact with database by clicking add, delete, or get buttons, then it creates `*.sqlite-shm` or `*.sqlite-wal` files. read more about [wal mode](https://www.sqlite.org/wal.html) at https://til.simonwillison.net/sqlite/enabling-wal-mode.

### Production Side

1. `make build-production` to build a Docker Container for `production`
2. `make start-production` to start the Docker Container
3. `make stop-production` to stop the Docker Container
4. `docker system prune -f && docker builder prune -f` to delete all images & container