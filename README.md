### easypanel-nextjs-sqlite

> Trying to get Next.js + SQLite combo working on [Easypanel](https://easypanel.io) with Docker

In real app, do not commit `.env.development` & `.env.production` to source control like Git. Add it to `.gitignore` & `.dockerignore` or better yet use [dotenvx](https://dotenvx.com) for environment variables.

Create `.env.development` & `.env.production` using `.env.example` format.

> NOTE: `SQLITE_DATABASE_NAME` should be equal to `users.${MODE}.sqlite` where `MODE` is an environment variable in `.env.*` as it is referenced in `run.sh`. For example, don't use `SQLITE_DATABASE_NAME=users.dev.sqlite` in `.env.development` if you are using `MODE=development` in the same file. You have to either use `MODE=dev` or `SQLITE_DATABASE_NAME=users.development.sqlite`. I like using long-form.

NPM Scripts appended with `:prod` are production scripts and those without anything appended are scripts to be used in development.

Use `/data` in `.env.production` like `SQLITE_DATABASE_PATH=/data/users.production.sqlite` & setup Cloudflare environment variables to have Database Backups using Litestream.

### TODOS

- [ ] Get `development/Dockerfile` to support HMR (Currently, Dockerfile in development does not work but `pnpm dev` is much better anyways)

> Note: If you need Redis, then only setup Redis in Docker & use local development environment for HMR as setting docker in development is very tedious & useless (at least it was in my case.)

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

### Hosting on Easypanel

1. Go to `Environment` & paste `.env.production` into `Environment Variables` & check `Create .env file` to create `.env` file.
2. Change port to `3001` as specified in `Dockerfile`. Go into `Domains`, click on `Edit` button, change `Internal Port` to `3001`. Make sure to use Custom Domain as Easypanel currently isn't working on `*.easypanel.host` domains.
3. Go to `Source`, add `Github` credentials, choose `Dockerfile` & paste `docker/production/Dockerfile` as the location.
4. Enable `Auto Deploy` by checking the box besides `Destroy` (delete icon) button.
5. Finally, click on `Deploy` to launch it.

### SQLite WAL Mode Caveats

I noticed SQLite WAL Mode on Docker Container doesn't work too well & results in data loss when the `*.sqlite` file is opened in a database browser like `SQLite Database` Desktop App.

Reproduction steps (you have to remove litestream specific code as WAL mode works with Litestream... see below) to see this issue after enabling WAL mode in 2 places (search `journal_mode=WAL` in VSCode):

1. Click `Add` in `localhost:3000`
2. Click `Get All`
3. Open the Desktop App `SQLite Database` by installing it from https://sqlitebrowser.org/
4. Click `Add` again multiple times & try to refresh database inside `SQLite Database` Desktop App
5. Notice, how the data doesn't update in the Desktop app but works fine in `localhost:3000`
6. Now close the Docker Container resulting in a data loss

For this reason, I'll be avoiding WAL mode for now. When the time comes & I need multiple writes, I'll use PostgreSQL instead of SQLite if I need multiple writers on a database but since the process of multiple writes is instantanious (milliseconds) so I'll be going with SQLite for now anyways.

### SQLite WAL Mode now works when used in combination with Litestream

I repeated the above 6 steps exactly as specified & there was no data loss.

I guess Litestream wrote it to its WAL Mode & when it found a wrong pointer, Litestream restored the database.

This was the log from Litestream that got me to this conclusion:

```bash
time=2024-02-28T05:44:50.247Z level=WARN msg="init: cannot determine last wal position, clearing generation" db=/data/users.prod.sqlite error="primary wal header: EOF"
time=2024-02-28T05:44:50.406Z level=INFO msg="sync: new generation" db=/data/users.prod.sqlite generation=ab8dd20a19bb28f7 reason="no generation exists"
time=2024-02-28T05:44:51.298Z level=INFO msg="write snapshot" db=/data/users.prod.sqlite replica=s3 position=ab8dd20a19bb28f7/00000000:4152
time=2024-02-28T05:44:51.720Z level=INFO msg="snapshot written" db=/data/users.prod.sqlite replica=s3 position=ab8dd20a19bb28f7/00000000:4152 elapsed=422.755427ms sz=1512
time=2024-02-28T05:44:52.234Z level=INFO msg="write wal segment" db=/data/users.prod.sqlite replica=s3 position=ab8dd20a19bb28f7/00000000:0
time=2024-02-28T05:44:52.602Z level=INFO msg="wal segment written" db=/data/users.prod.sqlite replica=s3 position=ab8dd20a19bb28f7/00000000:0 elapsed=367.834931ms sz=4152
```

#### Easypanel Volume Mount

1. Go to `Storage` > Click `Add Volume Mount` > Put `Name` as anything and `Mount Path` as `/etc/easypanel/projects/[project]/[services]/volumes/data/`
2. Use `/data` as directory

Hypothesis:

1. Use `/etc/easypanel/projects/[project]/[services]/volumes/data/` as `Data Path`
2. Use `/data` as directory

#### Easypanel Port fix

I used `Domains > Port` & added `3001` as internal port on my custom domain & it worked. It didn't work on `*.easypanel.host` domain for some reason.

I had `Mounts > Add Volume Mount` set to `data` as `Name` & `/data` as `Mount Path` which I don't think is needed if I use `VOLUMES ["/data"]` in `Dockerfile`.
