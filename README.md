# Ground Token

Expo (SDK 57, expo-router) Android app plus a Node/Express/Postgres API.

```
app/            expo-router routes
components/     sheets, map, shared UI
constants/      theme + config.ts (the single source of truth for API_URL)
utils/          notifications
backend/        Express API + Postgres, deployed to Render
render.yaml     Render blueprint (web service + Postgres)
```

---

## Switching between your laptop and Render

Two targets, two files, no commenting anything out. Only `SERVER_MODE` decides
which one is read, and real environment variables always beat both files.

| Where you run | Command | File used |
| --- | --- | --- |
| Backend, local | `npm run dev` | `backend/.env` |
| Backend, against Render | `npm run dev:online` | `backend/.env.production`, falling back to `.env` |
| App, local | `npm start` | `.env` (your LAN address) |
| App, production build | `eas build --profile preview` | `env` block in `eas.json` |

First run, once:

```bash
cd backend
copy .env.example .env                  # offline: localhost Postgres
copy .env.production.example .env.production   # online: Render's internal DB URL
cd ..
```

`.env` and `.env.production` are git-ignored. Only the `.example` templates are
tracked, so real credentials can never be committed by accident.

### What to keep in sync

`EXPO_PUBLIC_API_URL` appears in two places, because two different systems read
it:

- `.env.production` — what `expo export` uses locally
- the `env` block on the profile in `eas.json` — what EAS cloud builds use

Both must name the same service, and that name must match `services[0].name` in
`render.yaml`.

---

## Backend

```bash
cd backend
npm install

npm run dev          # ts-node, local Postgres
npm run dev:online   # same, but pointed at Render
npm run build        # tsc -> server.js
npm start            # node server.js  (this is what Render runs)
```

The server refuses to start if it cannot reach Postgres; it retries
`DB_CONNECT_ATTEMPTS` times (default 10) with a growing delay, because Render's
free tier cold-starts slowly.

| Variable | Notes |
| --- | --- |
| `DB_HOST` `DB_PORT` `DB_USER` `DB_PASSWORD` `DB_NAME` | connection details |
| `DB_SSL` | `true` for managed Postgres — Render requires it, local does not |
| `DB_CONNECT_ATTEMPTS` | retry budget for the first connection (default 10) |
| `UPLOAD_DIR` | where images are written (default `./uploads`) |
| `PORT` `HOST` | Render injects these |
| `PAYCHANGU_SECRET_KEY` `WEBHOOK_SECRET` | set in the Render dashboard, not in git |

### Migrations

`backend/schema.sql` and `backend/seed-data.sql` are the source of truth — both
are `pg_dump` output from the database you developed against, committed so a
brand new database is reproducible.

```bash
npm run db:migrate    # schema + data into an empty database
npm run db:reset      # DROP everything first, then rebuild
npm run db:migrate -- --schema-only
```

`schema.sql` uses plain `CREATE TABLE`, so it is deliberately **not**
idempotent — re-running over a populated database stops and tells you to use
`db:reset`. To refresh the dumps after changing your local database:

```bash
pg_dump -h localhost -U postgres -d postgres_ground_token --schema-only --no-owner --no-privileges > schema.sql
pg_dump -h localhost -U postgres -d postgres_ground_token --data-only --inserts --no-owner --no-privileges > seed-data.sql
```

> `--inserts` matters: the default `COPY ... FROM stdin` form is psql-only and
> cannot be executed through the `pg` client.

---

## Deploying to Render

1. Push to `main` (see branching below).
2. Render dashboard → **New → Blueprint** → pick this repo. `render.yaml`
   creates the Postgres and the web service together and wires the connection
   details across automatically.
3. Set `PAYCHANGU_SECRET_KEY` and `WEBHOOK_SECRET` on the service (they are
   `sync: false`, so Render will not invent them).
4. Confirm the generated hostname matches `EXPO_PUBLIC_API_URL` in `eas.json`
   and `.env.production`, and update both if it differs.
5. Seed the database from the service's **Shell** tab:

   ```bash
   npm run db:reset
   ```

   Pre-deploy hooks need a paid plan, and the internal database URL is only
   reachable from inside Render's network — hence the Shell tab rather than your
   machine.

6. Check it:

   ```bash
   curl https://<service>.onrender.com/ping        # liveness, no database
   curl https://<service>.onrender.com/api/health  # readiness, real query
   ```

### Two things about the free plan

- **The database expires 30 days after creation**, then deletes its data after a
  14-day grace period. Render emails you before it happens. Because
  `schema.sql` and `seed-data.sql` are committed, recovering is one
  `npm run db:reset` — but the uploaded images are gone.
- **The web service sleeps after ~15 minutes idle** and takes roughly a minute
  to wake. The token screen polls every 5s (`app/(visitor-tabs)/myTokensScreen.tsx`),
  so the first poll after a nap will stall noticeably. A paid `starter` instance
  removes it.

### Uploaded images are ephemeral

Activity images are written to `./uploads` on the service's own disk, which
Render discards on every redeploy. Re-upload after deploying. To make them
persist, move the service off the free plan, attach a disk, and point
`UPLOAD_DIR` at it — the blueprint comments show the exact block.

---

## Building the app

```bash
npm install
npx eas-cli login
eas build --profile preview --platform android     # APK, internal testing
eas build --profile production --platform android  # APK, auto-incremented
```

`preview` and `production` already set `EXPO_PUBLIC_API_URL` in `eas.json`, so
a cloud build does not depend on any local file. The `development` profile
intentionally does not — it stays pointed at your LAN address.

Free EAS accounts get 15 Android and 15 iOS builds a month on a low-priority
queue, with a 45-minute timeout. Expect a 15–30 minute wait.

Notes:

- The `development` profile sets `developmentClient: true` but `expo-dev-client`
  is not installed, so that profile will fail. Ignore it or add the dependency.
- iOS has no `bundleIdentifier` in `app.json` yet; the first iOS build prompts
  for one.
- `patches/expo-notifications+57.0.21.patch` is required for the app to boot
  outside a dev client. Do not add an `.easignore` that excludes `patches/`.

---

## Branching

`main` is what Render deploys and what release builds come from. `v2-rewrite`
is where work happens.

```bash
git checkout v2-rewrite      # ...work...
git checkout main
git merge --ff-only v2-rewrite
git push origin main          # triggers a Render deploy
```

Keep `main` a strict fast-forward of `v2-rewrite` — never merge back into
`v2-rewrite`, or the fast-forward stops working. The original pre-v2 code is
preserved on the `archive-main` branch.

---

## Known gaps

Left deliberately out of this deployment pass, for a later pass:

- **No authentication on any route.** No JWT, no middleware; passwords are
  stored and compared in plaintext (`backend/server.ts`), and identity is a
  client-supplied `userId`. Once the Render URL is public, anyone can call the
  admin and delete routes.
- **The payment webhook is not signature-verified.** `WEBHOOK_SECRET` is read
  but unused.
- **CORS is fully open.**
- **No offline support.** There is no local persistence — no SQLite, no
  AsyncStorage. All state lives in an in-memory Zustand store and is lost on
  restart; the nine store actions swallow errors to `console.error`.
- **`SESSION_DURATION_MS` is 60 seconds** (`backend/server.ts`), hardcoded for
  testing.
- **`backend/seed-data.sql` is committed** and contains your test users'
  plaintext passwords and PayChangu sandbox transaction records, including real
  phone numbers. It is in public git history.
