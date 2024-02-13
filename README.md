### easypanel-nextjs-sqlite

> Trying to get Next.js + SQLite combo working on [Easypanel](https://easypanel.io) with Docker

In real app, do not commit `.env.development` & `.env.production` to source control like Git. Add it to `.gitignore` & `.dockerignore` or better yet use [dotenvx](https://dotenvx.com) for environment variables.

1. `pnpm db:generate` generates migration files for `development` at `/src/app/db/migrations`
2. `pnpm db:migrate:dev` generates `users.dev.sqlite` for `development`
3. `make build-production` to build a Docker Container for `production`
