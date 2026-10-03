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

   The schema and the scrubbed seed both live in the repo, so this is the same
   command you ran locally. Pre-deploy hooks need a paid plan, and the internal
   database URL is only reachable from inside Render's network — hence the Shell
   tab rather than your machine.

6. Check it — this hits every endpoint plus a real login, and names whatever
   broke:

   ```bash
   npm run deploy:verify -- https://<service>.onrender.com
   ```

   The first run after the free instance sleeps will be slow while it wakes.

### Filling `.env.production` without hand-editing it

One URL replaces five hand-typed variables, which is where mistakes creep in:

```bash
npm run db:configure-online -- "postgresql://user:pass@host:5432/db"
```

It splits the URL, forces `DB_SSL=true`, keeps any PayChangu keys already in the
file, never prints the password, and warns on the two traps that produce
confusing failures much later — a bare `dpg-…` id with no domain, and an
*external* host instead of the internal one.

Run it on your machine to get a correct reference copy of
`backend/.env.production` (git-ignored). It cannot make `npm run dev:online`
reach the Render database: the internal host only resolves inside Render.

Both `server.ts` and the migration script read `DATABASE_URL` first and fall
back to the individual `DB_*` variables, so a platform that hands you one
connection string — Render, Heroku, Railway — works without editing anything.
They deliberately agree, because if the app and the migration script resolved
different hosts you would get a live service attached to an empty database.

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

The backend is already deployed at **https://ground-token-node.onrender.com**.
The Android app is built in EAS cloud, which is what `EXPO_PUBLIC_API_URL` in
`eas.json` points at:

```bash
npm install -g eas-cli     # or: npx eas-cli@latest ...
eas login
eas whoami                 # expect bckyrd
eas build --profile preview  --platform android --non-interactive
eas build --profile production --platform android --non-interactive
```

`preview` and `production` both set `EXPO_PUBLIC_API_URL` in `eas.json`, so a
cloud build needs no local file. The `development` profile intentionally does
not set it, so it stays empty and `constants/config.ts` prints a warning instead
of silently calling your LAN address.

Watch a queued build without blocking on it:

```bash
eas build:view <build-id> --json      # .status, .artifacts.buildUrl
eas build:list
```

Verified locally before the first cloud build
(`npx expo export --platform android`): the bundle contains
`ground-token-node.onrender.com`, no stale `ground-token-api` reference, no LAN
IP literals, and no PayChangu secret or webhook secret. Worth re-checking after
any config change — the bundle is what ships:

```bash
grep -o 'ground-token[a-z-]*\.onrender\.com' dist/_expo/static/js/android/*.hbc | sort -u
```

Free EAS accounts get 15 Android and 15 iOS builds a month on a low-priority
queue. Expect a long `IN_QUEUE` wait — the first build here sat queued for over
18 minutes, which is normal, not a failure. Builds time out after 45 minutes.

Notes:

- The `development` profile sets `developmentClient: true` but `expo-dev-client`
  is not installed, so that profile will fail. Ignore it or add the dependency.
- iOS has no `bundleIdentifier` in `app.json` yet; the first iOS build prompts
  for one.
- `android.package` is `io.bckyrd.groundtoken`. This is permanent once a Play
  Store listing exists, so confirm it before submitting anything. It is baked
  into the native build — changing it requires a new EAS build, and an APK with
  a different package will not upgrade-install over an older one.
- `patches/expo-notifications+57.0.21.patch` is applied by `postinstall`
  (`patch-package`) and is required for the app to boot outside a dev client. Do
  not add an `.easignore` that excludes `patches/`.

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

Left deliberately out of this pass. The first one is the one that matters:

- **No authentication on any route.** No JWT, no middleware; passwords are
  stored and compared in plaintext (`backend/server.ts`), and identity is a
  client-supplied `userId`. The API is now publicly reachable, so **anyone can
  call the admin and delete routes**, and can read every user's phone number out
  of the database. Fine for a private test build with scrubbed data — not fine
  for real users or real payment records.
- **The payment webhook is not signature-verified.** `WEBHOOK_SECRET` is read
  but unused.
- **CORS is fully open.**
- **No offline support.** There is no local persistence — no SQLite, no
  AsyncStorage. All state lives in an in-memory Zustand store and is lost on
  restart; the nine store actions swallow errors to `console.error`.
- **Uploaded images are ephemeral** on the free plan; see above.
- **Play sessions last 5 minutes** (`SESSION_DURATION_MS`, overridable by env
  var). It was hardcoded to 60s, which kicked children off a session mid-play.
  Set `SESSION_DURATION_MS=60000` for a fast demo.
- **The Render database expires 2026-11-01**, after which there is a 14-day
  grace period and then the data is deleted. `npm run db:reset` restores the
  scrubbed schema, but uploaded images are gone for good.

## About the seed data

`backend/seed-data.sql` is committed and **scrubbed**: the two guest accounts
created during phone testing and both `payments` rows are gone, every phone
number is a placeholder, and activity 5's uploaded image is nulled (the file it
pointed at was never committed). What remains is the four role accounts with
the credentials already documented in `backend/.env.example`, so local and
deployed logins behave the same.

Your unredacted dump lives at `backend/seed-data.local.sql`. It is git-ignored
and never deployed. Use it to seed a throwaway environment:

```bash
npm run db:migrate -- --data=seed-data.local.sql
```

That file was committed before it was scrubbed, so the original rows are still
in this repository's git history. If you need them gone, rewrite history
(`git filter-repo --path backend/seed-data.sql --invert-paths`) and force-push
all three branches — that rewrites SHAs and invalidates existing clones, so
decide before anyone else works on the repo.

