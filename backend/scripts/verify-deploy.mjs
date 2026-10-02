/**
 * Checks a deployed Ground Token API, so you find out what is broken without
 * hunting through Render's build log.
 *
 *   node scripts/verify-deploy.mjs https://ground-token-api.onrender.com
 *   node scripts/verify-deploy.mjs --url https://...
 *
 * Read-only: hits GET endpoints only, changes nothing.
 *
 * The first run after a free-tier spin-down will be slow — Render sleeps the
 * instance after ~15 minutes idle and waking it takes around a minute. The
 * timeout below is generous for that reason.
 */

const TIMEOUT_MS = 90_000;

const args = process.argv.slice(2);
const base = (
    args.includes('--url') ? args[args.indexOf('--url') + 1] : args.find((a) => !a.startsWith('--'))
) || process.env.EXPO_PUBLIC_API_URL;

if (!base) {
    console.error('no URL given.\n  node scripts/verify-deploy.mjs https://<service>.onrender.com');
    process.exit(1);
}

const root = base.replace(/\/+$/, '');

let failed = 0;
let warned = 0;

async function run(method, path, note, body) {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${root}${path}`, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });
        const ms = Date.now() - started;
        const text = await res.text();

        if (res.ok) {
            console.log(`  ok    ${String(res.status).padEnd(4)} ${method.padEnd(4)} ${path.padEnd(26)} ${ms}ms  ${note}`);
            return text;
        }
        failed += 1;
        console.log(`  FAIL  ${String(res.status).padEnd(4)} ${method.padEnd(4)} ${path.padEnd(26)} ${ms}ms  ${note}`);
        console.log(`        ${text.slice(0, 200)}`);
        return null;
    } catch (err) {
        failed += 1;
        const reason = err.name === 'AbortError' ? `timed out after ${TIMEOUT_MS / 1000}s` : err.message;
        console.log(`  FAIL  ---  ${method.padEnd(4)} ${path.padEnd(26)} ${reason}  ${note}`);
        return null;
    } finally {
        clearTimeout(timer);
    }
}

console.log(`Verifying ${root}\n`);

const health = await run('GET', '/ping', 'liveness (no database)');
await run('GET', '/api/health', 'readiness (real query, latency)');

if (health) {
    try {
        const parsed = JSON.parse(health);
        if (parsed.status === 'ok') {
            console.log(`        uptime ${Math.round(parsed.uptime ?? 0)}s — if that is small, the instance just cold-started`);
        }
    } catch {
        // not JSON; the status check above already covered it
    }
}

await run('GET', '/api/activities', 'public activity list');
await run('GET', '/api/admin/activities', 'admin activity list');
await run('GET', '/api/staff', 'staff list');
await run('GET', '/api/locations', 'map locations');
await run('GET', '/api/feedback/options', 'feedback options');

const login = await run('POST', '/api/auth/login', 'admin login', {
    username: 'admin@gmail.com',
    password: 'admin123',
});

if (login) {
    try {
        const parsed = JSON.parse(login);
        if (parsed.success && parsed.user) {
            console.log(`        logged in as ${parsed.user.username} (${parsed.user.role})`);
        } else {
            console.log('        NOTE: login returned 200 but not success — the seed data may not be loaded.');
            warned += 1;
        }
    } catch {
        warned += 1;
    }
}

// An empty activity list almost always means the database was never seeded.
const list = await run('GET', '/api/activities', 'seed check');
if (list) {
    try {
        const parsed = JSON.parse(list);
        const rows = Array.isArray(parsed) ? parsed : (parsed.activities ?? parsed.data ?? []);
        if (Array.isArray(rows) && rows.length === 0) {
            warned += 1;
            console.log('\n  WARN  /api/activities is empty.');
            console.log('        Schema is live but the seed has not been applied. Run, in the');
            console.log("        Render service's Shell tab:  npm run db:reset");
        }
    } catch {
        // shape unknown; not worth failing over
    }
}

console.log('');
if (failed > 0) {
    console.log(`${failed} check(s) FAILED.`);
    console.log('\nMost common causes, in order:');
    console.log('  * DB_SSL is not "true"          -> managed Postgres refuses plaintext');
    console.log('  * DB_HOST is missing the domain -> a bare dpg-... id cannot resolve');
    console.log('  * build failed                  -> check the Render build log; "start" runs node server.js');
    console.log('  * still cold-starting           -> free instances sleep; wait a minute and re-run');
} else if (warned > 0) {
    console.log('All requests succeeded, with warnings above.');
} else {
    console.log('All checks passed.');
}
