/**
 * Applies backend/schema.sql and a data file to the configured Postgres, so a
 * brand new database (Render's, or a fresh local one) can be brought up to the
 * shape of the machine you developed on.
 *
 *   npm run db:migrate              schema + data, into whatever SERVER_MODE points at
 *   npm run db:reset                drop everything first, then schema + data
 *   npm run db:migrate -- --schema-only
 *   npm run db:migrate -- --data=seed-data.local.sql   seed from your own dump
 *
 * Target selection matches server.ts: SERVER_MODE / --mode= picks
 * .env.production (online) or .env (local). On Render the dashboard's
 * DATABASE_URL wins automatically, so this needs no local config at all.
 *
 * seed-data.sql is scrubbed and safe to commit. seed-data.local.sql is your
 * real dump -- git-ignored, never deployed -- for seeding a throwaway
 * environment when you want the unredacted rows.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Client } = pg;
const root = path.resolve(import.meta.dirname, '..');

// ──────────────────────────────────────────────
// Target selection — kept in step with server.ts
// ──────────────────────────────────────────────
const flags = process.argv.slice(2);
const has = (name) => flags.includes(`--${name}`);
const valueOf = (name) => {
    const flag = flags.find((a) => a.startsWith(`--${name}=`));
    return flag ? flag.slice(name.length + 3) : undefined;
};

const SERVER_MODE = (() => {
    const raw = (process.env.SERVER_MODE || valueOf('mode') || 'local').trim().toLowerCase();
    return raw === 'online' ? 'online' : 'local';
})();

if (SERVER_MODE === 'online') {
    dotenv.config({ path: path.join(root, '.env.production') });
}
dotenv.config({ path: path.join(root, '.env') });

// Prefer a single connection URL when one exists — that is what Render injects.
const DATABASE_URL = process.env.DATABASE_URL;

const clientConfig = DATABASE_URL
    ? { connectionString: DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'db_ground_token',
    };

// Managed Postgres requires TLS; a local socket has nothing to negotiate.
if (process.env.DB_SSL === 'true') {
    clientConfig.ssl = { rejectUnauthorized: false };
}

const TABLES = ['feedback', 'staffActivities', 'payments', 'tokens', 'staff', 'activities', 'users'];

const client = new Client({
    ...clientConfig,
    connectionTimeoutMillis: 15_000,
});

/**
 * Runs a whole .sql file as a single simple-query call.
 *
 * Deliberately NOT split on semicolons: the payments rows embed gateway JSON
 * responses in string literals, and naive splitting corrupts them. The simple
 * query protocol takes multi-statement text as-is and wraps it in an implicit
 * transaction, so a failure part-way through rolls the whole file back rather
 * than leaving half a schema behind.
 */
async function applySql(label, file) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
        throw new Error(`${label}: ${file} not found at ${full}`);
    }
    const sql = fs.readFileSync(full, 'utf8');
    if (sql.trim().length === 0) {
        console.log(`- ${label}: ${file} is empty, skipped`);
        return;
    }
    await client.query(sql);
    console.log(`✓ ${label}: ${file} applied`);
}

async function main() {
    const where = DATABASE_URL
        ? DATABASE_URL.replace(/\/\/([^:]+):[^@]*@/, '//$1:***@')
        : `${clientConfig.host}:${clientConfig.port}/${clientConfig.database}`;

    console.log(`Migrate — mode=${SERVER_MODE}  target=${where}`);

    await client.connect();

    if (has('drop')) {
        // CASCADE order does not matter, but doing it in one statement keeps
        // this a single atomic operation.
        await client.query(`DROP TABLE IF EXISTS ${TABLES.map((t) => `public."${t}"`).join(', ')} CASCADE;`);
        console.log('✓ Dropped existing tables');
    } else {
        // A pg_dump schema is plain `CREATE TABLE`, not `CREATE TABLE IF NOT
        // EXISTS`, so re-running over a populated database aborts with a bare
        // "relation already exists" that tells you nothing about the fix.
        const { rows: existing } = await client.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1)`,
            [TABLES]
        );
        if (existing.length > 0) {
            throw new Error(
                `target already has ${existing.length} table(s): ${existing.map((r) => r.table_name).join(', ')}.\n` +
                `  schema.sql is not idempotent. Either:\n` +
                `    npm run db:reset            drop them and rebuild (DESTROYS ALL DATA)\n` +
                `    npm run db:migrate --schema-only   if the schema is already what you want`
            );
        }
    }

    await applySql('schema', 'schema.sql');

    if (has('schema-only')) {
        console.log('- Data: skipped (--schema-only)');
    } else {
        // Default to the scrubbed, committed seed. --data=<file> points at a
        // different dump, which is how you seed a throwaway environment from
        // your own unredacted rows.
        const dataFile = valueOf('data') ?? 'seed-data.sql';
        if (!fs.existsSync(path.join(root, dataFile))) {
            throw new Error(
                `data file "${dataFile}" not found in ${root}.\n` +
                `  Check the --data=<path> spelling, or drop the flag to use the committed seed-data.sql.`
            );
        }
        await applySql('data', dataFile);
    }

    const { rows: tables } = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('\n--- Result ---');
    for (const { table_name: name } of tables) {
        const { rows } = await client.query(`SELECT count(*)::int AS count FROM public."${name}"`);
        console.log(`  ${name}: ${rows[0].count}`);
    }

    await client.end();
    console.log('--- Migrate complete ---');
}

main()
    .then(() => {
        process.exitCode = 0;
    })
    .catch(async (err) => {
        console.error('✗ Migrate failed:', err.message);
        try {
            await client.end();
        } catch {
            // connection may already be gone
        }
        // Set exitCode rather than calling process.exit(): when stdout is a pipe
        // or a file the writes are asynchronous, and process.exit() discards
        // whatever has not flushed yet — losing the diagnostics you need most.
        process.exitCode = 1;
    });
