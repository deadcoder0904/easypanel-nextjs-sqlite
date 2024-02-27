### easypanel-nextjs-sqlite

> Trying to get Next.js + SQLite combo working on [Easypanel](https://easypanel.io) with Docker

In real app, do not commit `.env.development` & `.env.production` to source control like Git. Add it to `.gitignore` & `.dockerignore` or better yet use [dotenvx](https://dotenvx.com) for environment variables.

Create `.env.development` & `.env.production` using `.env.example` format.

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

### SQLite WAL Mode Caveats

I noticed SQLite WAL Mode on Docker Container doesn't work too well & results in data loss when opened in a file browser.

Reproduction steps to see this issue after enabling WAL mode which is commented out in 2 places (search `journal_mode=WAL` in VSCode):

1. Click `Add` in `localhost:3000`
2. Click `Get All`
3. Open the Desktop app `SQLite Database` by installing it from https://sqlitebrowser.org/
4. Click `Add` again multiple times & try to refresh database inside `SQLite Database` Desktop app
5. Notice, how the data doesn't update in the Desktop app but works fine in `localhost:3000`
6. Now close the Docker Container resulting in a data loss

For this reason, I'll be avoiding WAL mode for now. When the time comes & I need multiple writes, I'll use PostgreSQL instead of SQLite if I need multiple writers on a database but since the process of multiple writes is instantanious (milliseconds) so I'll be going with SQLite for now anyways.
