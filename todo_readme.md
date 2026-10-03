# What To Do Next

Working notes for future sessions. Read this before starting new work on
Ground Token, then check off items as they land.

**Last updated:** after commit `04139f4` (package rename + configurable session
duration). Everything in "Done" below is verified working against production.

---

## Current state

| Thing | Value |
| --- | --- |
| Live API | `https://ground-token-node.onrender.com` |
| Android package | `io.bckyrd.groundtoken` |
| iOS bundle id | **not set yet** |
| Session length | 5 min (`SESSION_DURATION_MS=300000`) |
| Play session default | 5 minutes, env-configurable |
| Expo project | `@bckyrd/Ground-Token` |
| EAS project id | `2bc6c58d-b23d-43c7-bcb2-1b13781ac5ab` |
| Keystore | remote, `KC2StiNQOA` |
| Render service | `ground-token-node` / `srv-d8fvjg99rddc73aurig0` |
| Render DB | `gtn-pg` / `dpg-davuu7m0tbcc73fgo1cg-a` (PG 18.6) |
| DB expires | **2026-11-01**, then 14-day grace, then deleted |
| APK (internal) | [link](https://expo.dev/artifacts/eas/bJA_4vEnpmIT41Z858q9naaTcE7oJbjuNMHdN1YTD48.apk) |
| EAS build | `87bf76db-1233-454b-8f17-93ca1e98797b` |

### Done

- [x] Backend deployed to Render and passing all `verify-deploy.mjs` checks
- [x] `DATABASE_URL` takes precedence over individual `DB_*` vars
- [x] Android package renamed to `io.bckyrd.groundtoken`, verified in the shipped
      APK's binary manifest
- [x] `SESSION_DURATION_MS` made env-configurable (was hardcoded 60s)
- [x] Seed data scrubbed; real dump gitignored and never deployed
- [x] EAS remote keystore set up; Android preview builds succeeding
- [x] API hostname de-hardcoded (`EXPO_PUBLIC_API_URL`) in `eas.json`,
      `constants/config.ts`, `app.json`

---

## 1. Add authentication — highest priority

The API is **publicly reachable with no auth on any route**. This is the one
thing that must be fixed before real users or real payments.

Current problems in `backend/server.ts`:

- Passwords stored and compared in **plaintext**
- Identity is a **client-supplied `userId`** — trivially spoofable
- No JWT, no auth middleware
- Anyone can call the admin and delete routes
- Anyone can read every user's phone number

Suggested order:

- [ ] Add `bcrypt`/`argon2` password hashing; migrate existing rows
- [ ] Issue + verify JWTs (`jsonwebtoken`)
- [ ] Add auth middleware; apply to every non-public route
- [ ] Derive `userId` from the token, never from the request body
- [ ] Role-based guards for `admin` / `manager` / staff routes
- [ ] Move role/permission checks out of the client

## 2. Payments

- [ ] Verify the PayChangu webhook signature (`WEBHOOK_SECRET` is currently
      read but **unused**)
- [ ] Make webhook handling idempotent
- [ ] Swap TEST keys for **live** keys (only after #1 lands)
- [ ] Handle failed/expired payments and refunds

## 3. CORS

- [ ] Lock CORS down to the real app origins (currently fully open)

## 4. Git history hygiene — needs your explicit go-ahead

The original **unredacted** seed dump (real phone numbers, passwords, payment
references) is still recoverable from Git history at commit `41187a6`.
`backend/seed-data.local.sql` still holds it locally.

- [ ] Rotate the Render DB password — it was printed in an earlier terminal
      output during setup
- [ ] Decide whether to purge history (`git filter-repo` / BFG) — this needs a
      **force-push**, so do not do it without confirming
- [ ] Coordinate with anyone else who has cloned the repo

## 5. Render durability

- [ ] Upgrade off the free DB plan, or accept the **2026-11-01** expiry
- [ ] Note: uploaded images live on ephemeral disk and are **already lost** on
      every deploy/restart — needs S3/Cloudflare R2 or similar
- [ ] Free web service sleeps after ~15 min idle, so the first request is slow

## 6. Real seed data

- [ ] Decide whether the real dump should ever reach the shared DB — currently
      it has **not**, by design. Sanitized seed is live:
      5 activities, 4 users, 2 staff, 2 staff assignments, 2 tokens, 0 payments
- [ ] If yes, use a **separate non-public database** — do not put real user
      records on the same public endpoint as #1 is unresolved
- [ ] `GT-DEMO1` may be left `in_use` from a session-duration test; it releases
      itself, or reset with `npm run db:reset`

## 7. App completeness

- [ ] **Set `ios.bundleIdentifier`** in `app.json` before any iOS build — it is
      currently missing and the first iOS build will prompt for it
- [ ] `development` profile fails without `expo-dev-client`; add it as a
      dependency if you want dev builds
- [ ] No offline support: state lives in an in-memory Zustand store and is lost
      on restart
- [ ] Nine store actions swallow errors to `console.error` only — surface these
      to the user
- [ ] Play Store: the package name is **permanent once a listing exists**;
      current `io.bckyrd.groundtoken` is the one to keep
- [ ] An APK with a different package name will **not** upgrade-install over an
      older one

---

## Useful commands

```powershell
# backend typecheck
cd backend; npx tsc --noEmit

# verify the live deployment
cd backend; node scripts/verify-deploy.mjs https://ground-token-node.onrender.com

# point local .env.production at Render, then run against the real DB
cd backend; npm run dev:online

# reset + reseed a database from the sanitized seed
npm run db:reset

# build the Android APK
$env:CI="1"; eas build --platform android --profile preview --non-interactive --no-wait
eas build:view <build-id> --json
```

## Workflow rules for this repo

- Develop on **`v2-rewrite`**, then fast-forward `main` and push
- `archive-main` holds the pre-rewrite history — do not touch it
- Render auto-deploys from `main`
- Never commit `.env*` files, `backend/seed-data.local.sql`, or `backend/_*.mjs`
- The Render API key lives in the `agent-render-key` user env var. **Never print
  or commit it.**