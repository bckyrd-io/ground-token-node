/**
 * Backend Server - Ground Token Application
 *
 * Environment Variables:
 * - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: Database config
 * - DB_SSL: 'true' to require TLS (Render Postgres requires it)
 * - DB_CONNECT_ATTEMPTS: how hard to retry the initial connection (default 10)
 * - UPLOAD_DIR: where uploaded images are written (default ./uploads)
 * - PORT: Server port (default: 5000)
 * - NODE_ENV: Environment (development/production)
 * - SERVER_MODE: 'local' | 'online' — selects which .env file to load
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// ──────────────────────────────────────────────
// Environment loading — SERVER_MODE
// ──────────────────────────────────────────────
// Two files, so switching targets never means editing config:
//
//   backend/.env            offline / LAN defaults (always loaded, as the base)
//   backend/.env.production Render deployment    (loaded only when online)
//
// Pick the target with SERVER_MODE=online or the --mode=online flag. The flag
// exists because `SERVER_MODE=x npm run dev` is POSIX shell syntax and silently
// does the wrong thing in PowerShell / cmd on Windows.
//
// Precedence, highest first:
//   real environment variables  >  .env.production (online only)  >  .env
// dotenv never overwrites a variable that is already set, so load order *is*
// the precedence order.
const SERVER_MODE = (() => {
    const flag = process.argv.find((arg) => arg.startsWith('--mode='));
    const fromFlag = flag ? flag.slice('--mode='.length) : '';
    const raw = (process.env.SERVER_MODE || fromFlag || 'local').trim().toLowerCase();
    return raw === 'online' ? 'online' : 'local';
})();

if (SERVER_MODE === 'online') {
    const { error } = dotenv.config({ path: '.env.production' });
    if (error) {
        console.warn('[env] backend/.env.production not found — falling back to .env and real env vars.');
    }
}

// Base config. Anything the file above already set is left alone.
dotenv.config();

// PayChangu Configuration
const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || '';
const PAYCHANGU_BASE_URL = process.env.PAYCHANGU_BASE_URL || 'https://api.paychangu.com';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

// SESSION_DURATION_MS: Time in milliseconds for play sessions
const SESSION_DURATION_MS = 60 * 1000; // 1 minute for testing

// HTTP_TIMEOUT_MS: Max time any outbound gateway request may take before we abort.
// Without this a stalled PayChangu call leaves the client's request hanging forever,
// which drains sockets and makes the server look dead.
const HTTP_TIMEOUT_MS = 15_000;

// fetchWithTimeout: fetch() with a hard deadline so no request can hang indefinitely
async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
    try {
        return await fetch(url, { ...init, signal: controller.signal });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request to ${url} timed out after ${HTTP_TIMEOUT_MS}ms`);
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}

// PayChangu API helper function
async function initiatePayChanguPayment(params: {
    amount: number;
    mobile: string;
    provider: string;
    chargeId: string;
}) {
    const { amount, mobile, provider, chargeId } = params;

    let cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.startsWith('0')) cleanMobile = cleanMobile.substring(1);
    if (cleanMobile.startsWith('265')) cleanMobile = cleanMobile.substring(3);

    const operators = await fetchMobileMoneyOperators();
    console.log('[PayChangu] Available operators:', operators.map(o => ({ name: o.name, ref_id: o.ref_id })));

    const providerLower = provider.toLowerCase();
    const operator = operators.find(op =>
        op.name.toLowerCase().includes(providerLower) ||
        providerLower.includes(op.name.toLowerCase().replace(' ', ''))
    );

    if (!operator) {
        throw new Error(`Mobile money operator not found for provider: ${provider}. Available: ${operators.map(o => o.name).join(', ')}`);
    }

    console.log(`[PayChangu] Using operator: ${operator.name} (${operator.ref_id})`);

    const response = await fetchWithTimeout(`${PAYCHANGU_BASE_URL}/mobile-money/payments/initialize`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: amount.toString(),
            mobile: cleanMobile,
            mobile_money_operator_ref_id: operator.ref_id,
            charge_id: chargeId,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayChangu API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

async function fetchMobileMoneyOperators(): Promise<Array<{ ref_id: string; name: string; country: string }>> {
    try {
        const response = await fetchWithTimeout(`${PAYCHANGU_BASE_URL}/mobile-money`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
            },
        });

        if (!response.ok) {
            console.error('[PayChangu] Failed to fetch operators:', response.status);
            return [];
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('[PayChangu] Error fetching operators:', error);
        return [];
    }
}

async function verifyPayChanguPayment(chargeId: string) {
    const response = await fetchWithTimeout(`${PAYCHANGU_BASE_URL}/mobile-money/payments/${chargeId}/verify`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayChangu verification error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

const app = express();
// process.env values are always strings — parse and validate instead of passing
// a raw string (or a bad value) into app.listen().
const PORT = (() => {
    const parsed = parseInt(process.env.PORT || '5000', 10);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
        console.error(`Invalid PORT "${process.env.PORT}" — falling back to 5000`);
        return 5000;
    }
    return parsed;
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploaded images are written to the local filesystem, so they live for exactly
// as long as the filesystem does. On Render that means they vanish on every
// redeploy. Set UPLOAD_DIR to a mounted persistent disk when that stops being
// acceptable — nothing else has to change.
const UPLOAD_DIR = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, 'uploads');

// Create it before the server ever accepts a request. express.static() cannot
// create the directory it serves, so on a fresh checkout every /uploads/*
// request would 404 until some admin happened to upload an image first.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype || extname) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    },
});

// ──────────────────────────────────────────────
// PostgreSQL Pool
// ──────────────────────────────────────────────
let pool: pg.Pool;

// Render's Postgres rejects plaintext connections, so TLS is mandatory there
// and pointless on a local socket. Gate it instead of hardcoding it — the local
// dev Postgres has no certificate to negotiate.
const DB_SSL = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

// Render's free tier spins a cold instance up from scratch, and Postgres is
// frequently not accepting connections yet when our first query lands. Retry
// generously before giving up, or the deploy fails on a race.
const DB_CONNECT_MAX_ATTEMPTS = (() => {
    const parsed = parseInt(process.env.DB_CONNECT_ATTEMPTS || '10', 10);
    if (!Number.isInteger(parsed) || parsed < 1) {
        console.warn(`Invalid DB_CONNECT_ATTEMPTS "${process.env.DB_CONNECT_ATTEMPTS}" — using 10`);
        return 10;
    }
    return parsed;
})();

async function initializeDatabase(attempt = 1, maxAttempts = DB_CONNECT_MAX_ATTEMPTS): Promise<boolean> {
    if (!pool) {
        // DATABASE_URL wins when present, because that is what Render injects
        // from the Blueprint and what managed platforms hand you in the
        // dashboard. The individual DB_* variables stay supported for local
        // work. Both paths must agree, or the app connects somewhere different
        // from the migration script and you get a mysteriously empty database.
        const connectionString = process.env.DATABASE_URL;
        const connection = connectionString
            ? { connectionString }
            : {
                  host: process.env.DB_HOST || 'localhost',
                  port: parseInt(process.env.DB_PORT || '5432'),
                  user: process.env.DB_USER || 'postgres',
                  password: process.env.DB_PASSWORD || 'postgres',
                  database: process.env.DB_NAME || 'db_ground_token',
              };

        pool = new Pool({
            ...connection,
            ssl: DB_SSL,
            max: 10,
            connectionTimeoutMillis: 5_000,
            idleTimeoutMillis: 30_000,
            allowExitOnIdle: false,
        });

        // CRITICAL: Pool is an EventEmitter. When an *idle* client hits a network
        // error Postgres emits 'error'; with no listener Node throws an uncaught
        // exception and the whole process dies with no useful log line.
        pool.on('error', (err) => {
            console.error('[DB] Idle client error (pool will recover):', err.message);
        });
    }

    try {
        await pool.query('SELECT 1');
        console.log('✓ Database connected successfully');
        return true;
    } catch (error) {
        const err = error as { message?: string; code?: string };
        console.error(
            `✗ Database connection failed (attempt ${attempt}/${maxAttempts}):`,
            err.code || err.message
        );

        if (attempt >= maxAttempts) {
            console.error(`Giving up on database after ${maxAttempts} attempts.`);
            console.error(
                process.env.DATABASE_URL
                    ? 'Check DATABASE_URL on the service (Render -> your service -> Environment).'
                    : `Check DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME in backend/.env${SERVER_MODE === 'online' ? '.production' : ''}`
            );
            return false;
        }

        // Postgres often needs a few seconds longer than the app to come up.
        // Retry with linear backoff instead of exiting on the first miss.
        const delayMs = Math.min(1000 * attempt, 5000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return initializeDatabase(attempt + 1, maxAttempts);
    }
}

// Convenience wrapper — returns rows array directly
async function query(sql: string, params?: any[]) {
    const result = await pool.query(sql, params);
    return result.rows;
}

const parseCoordinate = (value: unknown, type: 'latitude' | 'longitude'): number | null => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid ${type}.`);
    }

    if (type === 'latitude' && (parsed < -90 || parsed > 90)) {
        throw new Error('Latitude must be between -90 and 90.');
    }

    if (type === 'longitude' && (parsed < -180 || parsed > 180)) {
        throw new Error('Longitude must be between -180 and 180.');
    }

    return parsed;
};

app.disable('x-powered-by');
app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));

// Request logging — without this a hung request is invisible from the outside,
// which is exactly why the server "looks dead".
app.use((req, res, next) => {
    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
        const flag = res.statusCode >= 500 ? '[5xx]' : res.statusCode >= 400 ? '[4xx]' : '[ok]';
        console.log(`${flag} ${res.statusCode} ${ms.toFixed(0)}ms ${req.method} ${req.originalUrl}`);
    });
    res.on('close', () => {
        if (!res.writableEnded) {
            console.log(`[abort] client disconnected before response: ${req.method} ${req.originalUrl}`);
        }
    });
    next();
});

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// Liveness: process is up and the event loop is turning. Never touches the DB.
app.get('/ping', (_req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
});

// Readiness: process is up AND the database answers. Returns 503 when degraded so
// a load balancer / uptime check can actually detect a half-dead server.
app.get('/api/health', async (_req, res) => {
    let dbOk = false;
    let dbLatencyMs: number | null = null;

    if (pool) {
        const startedAt = process.hrtime.bigint();
        try {
            await pool.query('SELECT 1');
            dbOk = true;
            dbLatencyMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        } catch (error) {
            dbLatencyMs = null;
            console.error('[Health] DB check failed:', (error as Error).message);
        }
    }

    res.status(dbOk ? 200 : 503).json({
        status: dbOk ? 'OK' : 'DEGRADED',
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        database: { connected: dbOk, latencyMs: dbLatencyMs === null ? null : Math.round(dbLatencyMs) },
        memory: { rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024) },
    });
});

app.get('/api/test-upload', (req, res) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadPath)) {
        res.json({ uploadPath, exists: true, files: fs.readdirSync(uploadPath) });
    } else {
        res.json({ uploadPath, exists: false, message: 'Upload directory does not exist' });
    }
});

app.get('/api/time', (_req, res) => {
    res.json({ timestamp: Date.now(), iso: new Date().toISOString() });
});

// Fetch all activities
app.get('/api/activities', async (_req, res) => {
    try {
        const activities = await query('SELECT * FROM activities WHERE "isActive" = true');

        const formattedActivities = activities.map(a => ({
            id: a.id,
            name: a.name,
            description: a.description,
            type: a.type || 'play',
            price: a.price,
            currentOccupancy: a.currentOccupancy,
            capacity: a.capacity,
            image: a.image,
            isCapacityControlOpen: a.isCapacityControlOpen,
            latitude: a.latitude !== null ? Number(a.latitude) : null,
            longitude: a.longitude !== null ? Number(a.longitude) : null,
        }));

        res.json(formattedActivities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Fetch specific activity by ID
app.get('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const activities = await query('SELECT * FROM activities WHERE id = $1 AND "isActive" = true', [id]);

        if (activities.length === 0) return res.status(404).json({ error: 'Activity not found' });

        const a = activities[0];
        res.json({
            id: a.id,
            name: a.name,
            type: a.type || 'play',
            price: a.price,
            capacity: a.capacity,
            currentOccupancy: a.currentOccupancy,
            isCapacityControlOpen: a.isCapacityControlOpen,
            rating: a.rating,
            reviewCount: a.reviewCount,
            description: a.description,
            image: a.image,
            safetyRules: a.safetyRules ? JSON.parse(a.safetyRules) : [],
            latitude: a.latitude !== null ? Number(a.latitude) : null,
            longitude: a.longitude !== null ? Number(a.longitude) : null,
        });
    } catch (error) {
        console.error('Error fetching activity detail:', error);
        res.status(500).json({ error: 'Failed to fetch activity details' });
    }
});

// Admin: all activities with capacity info
app.get('/api/admin/activities', async (_req, res) => {
    try {
        const activities = await query('SELECT * FROM activities WHERE "isActive" = true');

        res.json(activities.map(a => ({
            id: a.id,
            name: a.name,
            type: a.type || 'play',
            capacity: `${a.currentOccupancy}/${a.capacity}`,
            percent: Number(a.capacity) > 0 ? (a.currentOccupancy / a.capacity) * 100 : 0,
            image: a.image,
            latitude: a.latitude !== null ? Number(a.latitude) : null,
            longitude: a.longitude !== null ? Number(a.longitude) : null,
        })));
    } catch (error) {
        console.error('Error fetching admin activities:', error);
        res.status(500).json({ error: 'Failed to fetch admin activities' });
    }
});

app.get('/api/locations', async (_req, res) => {
    try {
        const activities = await query('SELECT * FROM activities WHERE "isActive" = true');
        const locations = activities
            .filter(a => a.latitude !== null && a.longitude !== null)
            .map(a => ({
                id: a.id,
                name: a.name,
                latitude: Number(a.latitude),
                longitude: Number(a.longitude),
                image: a.image,
                currentOccupancy: a.currentOccupancy,
                capacity: a.capacity,
                status: Number(a.currentOccupancy) >= Number(a.capacity) ? 'Occupied' : 'Available',
            }));
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// Auto-queue processor
async function processAutoQueue() {
    try {
        const activities = await query('SELECT id, capacity FROM activities WHERE "isActive" = true');

        for (const act of activities) {
            // Expire timed-out in_use tokens
            await pool.query(
                `UPDATE tokens
                 SET status = 'completed'
                 WHERE "activityId" = $1
                   AND status = 'in_use'
                   AND "usedAt" + ($2 || ' milliseconds')::interval < NOW()`,
                [act.id, SESSION_DURATION_MS]
            );

            // Count active occupancy (in_use + ready)
            const activeRows = await query(
                `SELECT COUNT(*) AS cnt FROM tokens
                 WHERE "activityId" = $1 AND (status = 'in_use' OR status = 'ready')`,
                [act.id]
            );
            const activeCount = Number(activeRows[0].cnt);
            const availableSpots = act.capacity - activeCount;

            if (availableSpots > 0) {
                const queueRows = await query(
                    `SELECT id FROM tokens
                     WHERE "activityId" = $1 AND status = 'queue'
                     ORDER BY "createdAt" ASC
                     LIMIT $2`,
                    [act.id, availableSpots]
                );

                if (queueRows.length > 0) {
                    const ids = queueRows.map(r => r.id);
                    await pool.query(
                        `UPDATE tokens SET status = 'ready' WHERE id = ANY($1::int[])`,
                        [ids]
                    );
                }
            }

            // Refresh occupancy count
            const newActiveRows = await query(
                `SELECT COUNT(*) AS cnt FROM tokens
                 WHERE "activityId" = $1 AND (status = 'in_use' OR status = 'ready')`,
                [act.id]
            );
            await pool.query(
                `UPDATE activities SET "currentOccupancy" = $1 WHERE id = $2`,
                [Number(newActiveRows[0].cnt), act.id]
            );
        }
    } catch (err) {
        console.error('Error processing auto queue:', err);
    }
}

// Fetch tokens
app.get('/api/tokens', async (req, res) => {
    try {
        await processAutoQueue();
        const { userId } = req.query;

        const allTokens = await query(`
            SELECT t.*, COALESCE(a.name, 'Unknown Activity') AS "activityName",
                   COALESCE(a.type, 'play') AS "activityType", u.username
            FROM tokens t
            LEFT JOIN activities a ON t."activityId" = a.id
            JOIN users u ON t."userId" = u.id
            ORDER BY t."createdAt" ASC
        `);

        const queuePositions: Record<string, number> = {};
        const tokensWithPositions = allTokens.map(token => {
            let qPos: string | null = null;
            if (token.status === 'queue') {
                queuePositions[token.activityId] = (queuePositions[token.activityId] || 0) + 1;
                qPos = `#${queuePositions[token.activityId]}`;
            }

            let computedExpiresAt: string | null = null;
            if (token.usedAt) {
                const baseTime = new Date(token.usedAt);
                computedExpiresAt = new Date(baseTime.getTime() + SESSION_DURATION_MS).toISOString();
            }

            return {
                id: token.id,
                activityId: token.activityId,
                name: token.activityName || 'Unknown',
                code: token.code,
                status: token.status,
                queuePosition: qPos,
                qrImage: token.qrCode,
                username: token.username,
                createdAt: token.createdAt,
                expiresAt: computedExpiresAt,
                activityType: token.activityType || 'play',
            };
        });

        if (userId) {
            const userIdNum = parseInt(userId as string);
            const filtered = allTokens
                .filter(t => t.userId === userIdNum)
                .map(t => tokensWithPositions.find(tp => tp.id === t.id))
                .filter(Boolean);
            return res.json(filtered);
        }

        res.json(tokensWithPositions);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ error: 'Failed to fetch tokens' });
    }
});

// Validate token by code
app.get('/api/tokens/validate/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const tokens = await query(`
            SELECT t.*, COALESCE(a.name, 'Unknown Activity') AS "activityName",
                   COALESCE(a.type, 'play') AS "activityType", u.username
            FROM tokens t
            LEFT JOIN activities a ON t."activityId" = a.id
            JOIN users u ON t."userId" = u.id
            WHERE t.code = $1
        `, [code]);

        if (tokens.length === 0) {
            return res.status(404).json({ valid: false, message: 'Token not found' });
        }

        const token = tokens[0];
        let isExpired = false;
        let expiresAt: Date | null = null;

        if (token.status === 'in_use' && token.usedAt) {
            expiresAt = new Date(new Date(token.usedAt).getTime() + SESSION_DURATION_MS);
            isExpired = new Date() > expiresAt;
        } else if (token.status === 'ready') {
            expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
        }

        let isValid = false;
        let statusMessage = '';

        if (isExpired) {
            isValid = false;
            statusMessage = 'Token has expired';
        } else if (['completed', 'cancelled'].includes(token.status)) {
            isValid = false;
            statusMessage = `Token is ${token.status}`;
        } else if (token.status === 'queue') {
            isValid = false;
            statusMessage = 'Token is still in queue';
        } else if (token.status === 'pending') {
            isValid = false;
            statusMessage = 'Token is pending payment';
        } else if (token.status === 'in_use') {
            isValid = true;
            statusMessage = 'Token is valid and ready for use';
        } else if (token.status === 'ready') {
            isValid = true;
            statusMessage = 'Token is valid and ready for use';
            await pool.query(
                `UPDATE tokens SET status = 'in_use', "usedAt" = NOW() WHERE id = $1`,
                [token.id]
            );
        } else {
            isValid = false;
            statusMessage = 'Unknown token status';
        }

        let queuePosition = null;
        if (token.status === 'queue') {
            const qRows = await query(
                `SELECT COUNT(*) AS cnt FROM tokens
                 WHERE "activityId" = $1 AND status = 'queue' AND "createdAt" <= $2`,
                [token.activityId, token.createdAt]
            );
            queuePosition = qRows[0].cnt;
        }

        res.json({
            valid: isValid,
            message: statusMessage,
            token: {
                id: token.id,
                code: token.code,
                status: token.status,
                activityName: token.activityName,
                activityType: token.activityType || 'play',
                username: token.username,
                expiresAt: expiresAt ? expiresAt.toISOString() : null,
                isExpired,
                queuePosition,
            },
        });
    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ error: 'Failed to validate token' });
    }
});

// Start token session
app.post('/api/tokens/:id/start', async (req, res) => {
    try {
        const { id } = req.params;

        const tokens = await query(`
            SELECT t.*, a.name AS "activityName", a.type AS "activityType"
            FROM tokens t
            LEFT JOIN activities a ON t."activityId" = a.id
            WHERE t.id = $1
        `, [id]);

        if (tokens.length === 0) return res.status(404).json({ success: false, message: 'Token not found' });

        const token = tokens[0];

        if (token.status !== 'ready') {
            return res.status(400).json({ success: false, message: `Token cannot be started. Current status: ${token.status}` });
        }

        await pool.query(
            `UPDATE tokens SET status = 'in_use', "usedAt" = NOW() WHERE id = $1`,
            [id]
        );

        const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

        res.json({
            success: true,
            message: 'Session started successfully',
            token: {
                id: token.id,
                code: token.code,
                status: 'in_use',
                activityName: token.activityName,
                activityType: token.activityType || 'play',
                expiresAt,
            },
        });
    } catch (error) {
        console.error('Error starting token session:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// Fetch all staff
app.get('/api/staff', async (_req, res) => {
    try {
        const staff = await query(`
            SELECT u.id, u.username, u.email, u.phone, u.role,
                   s."staffId", s.status, u."isActive",
                   a.name AS zone
            FROM users u
            JOIN staff s ON u.id = s."userId"
            LEFT JOIN "staffActivities" sa ON s.id = sa."staffId" AND sa."isActive" = true
            LEFT JOIN activities a ON sa."activityId" = a.id AND a."isActive" = true
            WHERE u."isActive" = true AND s."isActive" = true
        `);

        res.json(staff.map(m => ({
            id: m.id,
            name: m.username,
            zone: m.zone || 'Unassigned',
            status: !m.zone ? 'Unassigned' : (m.status === 'active' ? 'Active' : m.status === 'off_duty' ? 'Off-Duty' : 'Inactive'),
            image: m.image || 'https://picsum.photos/200',
        })));
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Fetch staff member's assigned activity
app.get('/api/staff/:staffId/activity', async (req, res) => {
    try {
        const { staffId } = req.params;

        const activities = await query(`
            SELECT a.*, sa."staffId" AS "assignedStaffId"
            FROM activities a
            JOIN "staffActivities" sa ON a.id = sa."activityId"
            JOIN staff s ON sa."staffId" = s.id
            WHERE s."userId" = $1 AND sa."isActive" = true AND a."isActive" = true
            LIMIT 1
        `, [staffId]);

        if (activities.length === 0) return res.status(404).json({ error: 'No activity assigned to this staff member' });

        const a = activities[0];
        res.json({
            id: a.id,
            name: a.name,
            type: a.type || 'play',
            description: a.description,
            price: a.price,
            capacity: a.capacity,
            currentOccupancy: a.currentOccupancy,
            isCapacityControlOpen: a.isCapacityControlOpen,
            image: a.image,
            safetyRules: a.safetyRules ? JSON.parse(a.safetyRules) : [],
            latitude: a.latitude !== null ? Number(a.latitude) : null,
            longitude: a.longitude !== null ? Number(a.longitude) : null,
        });
    } catch (error) {
        console.error('Error fetching staff activity:', error);
        res.status(500).json({ error: 'Failed to fetch staff activity' });
    }
});

app.post('/api/staff/:staffId/activity', async (req, res) => {
    try {
        const { staffId } = req.params;
        const { activityId } = req.body || {};

        if (!activityId) return res.status(400).json({ error: 'Activity ID is required' });

        const staffRows = await query(
            `SELECT id FROM staff WHERE "userId" = $1 AND "isActive" = true LIMIT 1`,
            [staffId]
        );

        if (staffRows.length === 0) return res.status(404).json({ error: 'Staff member not found' });

        const activityRows = await query(
            `SELECT id, name FROM activities WHERE id = $1 AND "isActive" = true LIMIT 1`,
            [activityId]
        );

        if (activityRows.length === 0) return res.status(404).json({ error: 'Activity not found' });

        const internalStaffId = staffRows[0].id;

        await pool.query(
            `UPDATE "staffActivities"
             SET "isActive" = false
             WHERE "staffId" = $1 AND "isActive" = true`,
            [internalStaffId]
        );

        await pool.query(
            `INSERT INTO "staffActivities" ("staffId", "activityId", "isActive")
             VALUES ($1, $2, true)`,
            [internalStaffId, activityId]
        );

        await pool.query(
            `UPDATE staff
             SET status = 'active', "updatedAt" = NOW()
             WHERE id = $1`,
            [internalStaffId]
        );

        res.json({
            message: 'Staff assigned successfully',
            activity: activityRows[0],
        });
    } catch (error) {
        console.error('Assign staff activity error:', error);
        res.status(500).json({ error: 'Failed to assign staff activity' });
    }
});

// Update activity capacity control
app.put('/api/activities/:id/capacity-control', async (req, res) => {
    try {
        const { id } = req.params;
        const { isOpen } = req.body;

        if (typeof isOpen !== 'boolean') return res.status(400).json({ error: 'isOpen must be a boolean' });

        const result = await pool.query(
            `UPDATE activities SET "isCapacityControlOpen" = $1, "updatedAt" = NOW() WHERE id = $2`,
            [isOpen, id]
        );

        if (result.rowCount === 0) return res.status(404).json({ error: 'Activity not found' });

        if (!isOpen) {
            await pool.query(
                `UPDATE tokens SET status = 'expired'
                 WHERE "activityId" = $1 AND (status = 'in_use' OR status = 'ready')`,
                [id]
            );

            const queueRows = await query(
                `SELECT id FROM tokens WHERE "activityId" = $1 AND status = 'queue' ORDER BY "createdAt" ASC LIMIT 1`,
                [id]
            );

            if (queueRows.length > 0) {
                await pool.query(`UPDATE tokens SET status = 'ready' WHERE id = $1`, [queueRows[0].id]);
            }

            const newActiveRows = await query(
                `SELECT COUNT(*) AS cnt FROM tokens
                 WHERE "activityId" = $1 AND (status = 'in_use' OR status = 'ready')`,
                [id]
            );
            await pool.query(
                `UPDATE activities SET "currentOccupancy" = $1 WHERE id = $2`,
                [Number(newActiveRows[0].cnt), id]
            );
        }

        res.json({ message: 'Capacity control status updated successfully', isOpen });
    } catch (error) {
        console.error('Error updating capacity control:', error);
        res.status(500).json({ error: 'Failed to update capacity control status' });
    }
});

// Fetch user profile
app.get('/api/profile', async (req, res) => {
    try {
        const { userId } = req.query;

        let rows: any[];
        if (userId) {
            rows = await query(`SELECT * FROM users WHERE "isActive" = true AND id = $1`, [userId]);
        } else {
            rows = await query(`SELECT * FROM users WHERE "isActive" = true AND role = 'visitor' LIMIT 1`);
        }

        if (rows.length > 0) {
            const u = rows[0];
            return res.json({
                id: u.id,
                username: u.username || 'Guest',
                email: u.email || 'visitor@example.com',
                phone: u.phone || '+2651234572',
                avatar: 'https://picsum.photos/200',
                role: u.role,
                createdAt: u.createdAt,
            });
        }

        res.json({
            id: null,
            username: 'Guest',
            email: 'visitor@example.com',
            phone: '+2651234572',
            avatar: 'https://picsum.photos/200',
            role: 'visitor',
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.get('/api/feedback/options', (_req, res) => {
    res.json({
        quickTags: ['Cleanliness', 'Friendly Staff', 'Safety', 'Equipment'],
        ratingLabels: ['', 'Terrible', 'Bad', 'Okay', 'Great', 'Amazing'],
    });
});

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

        const users = await query(`
            SELECT u.*, s."staffId", s.status AS "staffStatus"
            FROM users u
            LEFT JOIN staff s ON u.id = s."userId"
            WHERE (u.username = $1 OR u.email = $1) AND u."isActive" = true
        `, [username]);

        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];

        if (password !== user.password) return res.status(401).json({ error: 'Invalid credentials' });

        if (user.role === 'staff' && (!user.staffId || user.staffStatus !== 'active')) {
            return res.status(401).json({ error: 'Staff account not active' });
        }

        res.json({
            success: true,
            user: { id: user.id, username: user.username, role: user.role, email: user.email, phone: user.phone },
        });
    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/register-staff', async (req, res) => {
    try {
        const { email, username, password, role, phone } = req.body;
        if (!email || !username || !password) return res.status(400).json({ error: 'Required fields missing' });

        const existing = await query('SELECT id FROM users WHERE username = $1', [username]);
        if (existing.length > 0) return res.status(409).json({ error: 'Username already exists' });

        const staffId = `STAFF${Date.now()}`;

        const userRows = await query(
            `INSERT INTO users (email, phone, username, password, role)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [email, phone, username, password, role || 'staff']
        );
        const userId = userRows[0].id;

        const staffRows = await query(
            `INSERT INTO staff ("userId", "staffId", status, "isActive")
             VALUES ($1, $2, 'active', true) RETURNING id`,
            [userId, staffId]
        );

        res.status(201).json({ message: 'Staff registered successfully', id: staffRows[0].id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ──────────────────────────────────────────────
// Activity Management
// ──────────────────────────────────────────────

app.post('/api/activities', async (req, res) => {
    try {
        const { name, description, type = 'play', price, capacity, rating = 0, reviewCount = 0, safetyRules = [], latitude, longitude } = req.body || {};

        if (!name || !description || !price || !capacity) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const parsedLatitude = parseCoordinate(latitude, 'latitude');
        const parsedLongitude = parseCoordinate(longitude, 'longitude');

        const rows = await query(
            `INSERT INTO activities (name, description, type, price, capacity, "currentOccupancy",
                                    image, rating, "reviewCount", "safetyRules", "isActive", latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, 0, NULL, $6, $7, $8, true, $9, $10) RETURNING id`,
            [name, description, type, price, capacity, rating, reviewCount, JSON.stringify(safetyRules), parsedLatitude, parsedLongitude]
        );

        res.status(201).json({
            message: 'Activity created successfully',
            activity: {
                id: rows[0].id,
                name,
                description,
                price,
                capacity,
                image: null,
                rating,
                reviewCount,
                safetyRules,
                latitude: parsedLatitude,
                longitude: parsedLongitude,
            },
        });
    } catch (error) {
        if (error instanceof Error && (error.message.includes('Latitude') || error.message.includes('Longitude') || error.message.includes('Invalid'))) {
            return res.status(400).json({ error: error.message });
        }
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

app.post('/api/activities/upload', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { name, description, type = 'play', price, capacity, rating = 0, reviewCount = 0, safetyRules = [], staff, latitude, longitude } = req.body || {};

        if (!name || !description || !price || !capacity) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const parsedLatitude = parseCoordinate(latitude, 'latitude');
        const parsedLongitude = parseCoordinate(longitude, 'longitude');

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const rows = await query(
            `INSERT INTO activities (name, description, type, price, capacity, "currentOccupancy",
                                    image, rating, "reviewCount", "safetyRules", "isActive", latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, 0, $6, $7, $8, $9, true, $10, $11) RETURNING id`,
            [name, description, type, price, capacity, imagePath, rating, reviewCount, JSON.stringify(safetyRules), parsedLatitude, parsedLongitude]
        );

        const activityId = rows[0].id;

        if (staff) {
            try {
                const staffIds = JSON.parse(staff);
                if (Array.isArray(staffIds)) {
                    for (const userId of staffIds) {
                        const staffRecords = await query(
                            `SELECT id FROM staff WHERE "userId" = $1 AND "isActive" = true`,
                            [userId]
                        );
                        if (staffRecords.length > 0) {
                            await pool.query(
                                `INSERT INTO "staffActivities" ("staffId", "activityId", "isActive") VALUES ($1, $2, true)`,
                                [staffRecords[0].id, activityId]
                            );
                        }
                    }
                }
            } catch (staffError) {
                console.error('Error assigning staff:', staffError);
            }
        }

        res.status(201).json({
            message: 'Activity created successfully',
            activity: {
                id: activityId,
                name,
                description,
                type,
                price,
                capacity,
                image: imagePath,
                rating,
                reviewCount,
                safetyRules,
                latitude: parsedLatitude,
                longitude: parsedLongitude,
            },
        });
    } catch (error) {
        if (error instanceof Error && (error.message.includes('Latitude') || error.message.includes('Longitude') || error.message.includes('Invalid'))) {
            return res.status(400).json({ error: error.message });
        }
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

app.delete('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE "staffActivities"
             SET "isActive" = false
             WHERE "activityId" = $1 AND "isActive" = true`,
            [id]
        );
        const result = await pool.query(
            `UPDATE activities
             SET "isActive" = false, "updatedAt" = NOW()
             WHERE id = $1 AND "isActive" = true`,
            [id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Activity not found' });
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const staffRows = await query(
            `SELECT id FROM staff WHERE "userId" = $1 AND "isActive" = true LIMIT 1`,
            [id]
        );

        if (staffRows.length === 0) return res.status(404).json({ error: 'Staff member not found' });

        const internalStaffId = staffRows[0].id;

        await pool.query(
            `UPDATE "staffActivities"
             SET "isActive" = false
             WHERE "staffId" = $1 AND "isActive" = true`,
            [internalStaffId]
        );

        await pool.query(
            `UPDATE staff
             SET "isActive" = false, "updatedAt" = NOW()
             WHERE id = $1`,
            [internalStaffId]
        );

        await pool.query(
            `UPDATE users
             SET "isActive" = false, "updatedAt" = NOW()
             WHERE id = $1 AND role = 'staff'`,
            [id]
        );

        res.json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({ error: 'Failed to delete staff' });
    }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, password } = req.body;

        if (!username || !email) return res.status(400).json({ error: 'Username and email required' });

        let result;
        if (password && password.trim()) {
            result = await pool.query(
                `UPDATE users SET username = $1, email = $2, phone = $3, password = $4, "updatedAt" = NOW()
                 WHERE id = $5 AND "isActive" = true`,
                [username, email, phone, password, id]
            );
        } else {
            result = await pool.query(
                `UPDATE users SET username = $1, email = $2, phone = $3, "updatedAt" = NOW()
                 WHERE id = $4 AND "isActive" = true`,
                [username, email, phone, id]
            );
        }

        if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User updated successfully', user: { id, username, email, phone } });
    } catch (error: any) {
        console.error('[User] Update error:', error);
        if (error?.code === '23505') {
            return res.status(409).json({ error: 'That email address is already in use' });
        }
        if (error?.code === '22001') {
            return res.status(400).json({ error: 'One of the fields exceeds the maximum allowed length' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// ──────────────────────────────────────────────
// Payments
// ──────────────────────────────────────────────

app.post('/api/payment/process', async (req, res) => {
    try {
        const { phoneNumber, amount, provider, activityId, userId } = req.body;

        if (!phoneNumber || !amount || !provider) return res.status(400).json({ error: 'Missing payment details' });
        if (!PAYCHANGU_SECRET_KEY) return res.status(500).json({ error: 'Payment gateway not configured' });

        let finalUserId = userId;
        let guestUser: any = null;

        if (!finalUserId) {
            const guestCode = 'GUEST-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            const newUser = await query(
                `INSERT INTO users (email, username, password, role, phone) VALUES ($1, $2, '', 'visitor', $3) RETURNING id`,
                [`${guestCode}@guest.example.com`, guestCode, phoneNumber]
            );
            finalUserId = newUser[0].id;
            guestUser = { id: finalUserId, username: guestCode, email: `${guestCode}@guest.example.com`, phone: phoneNumber, role: 'visitor' };
        }

        if (activityId) {
            const actCheck = await query('SELECT id FROM activities WHERE id = $1', [activityId]);
            if (actCheck.length === 0) return res.status(400).json({ error: 'Invalid activity ID' });
        }

        const transactionId = 'PC' + Date.now();

        let paychanguResponse;
        try {
            paychanguResponse = await initiatePayChanguPayment({ amount: parseInt(amount), mobile: phoneNumber, provider, chargeId: transactionId });
        } catch (apiError: any) {
            return res.status(500).json({ error: 'Payment gateway error', details: apiError.message });
        }

        const gatewayResponse = JSON.stringify(paychanguResponse);
        const chargeId = paychanguResponse.data?.charge_id || paychanguResponse.data?.ref_id || transactionId;
        const gatewayTransId = paychanguResponse.data?.trans_id || '';

        const paymentRows = await query(
            `INSERT INTO payments ("transactionId", "userId", "activityId", amount, currency, provider, "phoneNumber", status, "gatewayTransactionId", "processedAt", "gatewayResponse")
             VALUES ($1, $2, $3, $4, 'MWK', $5, $6, 'pending', $7, NOW(), $8) RETURNING id`,
            [chargeId, finalUserId, activityId || null, amount, provider, phoneNumber, gatewayTransId, gatewayResponse]
        );
        const paymentId = paymentRows[0].id;

        const tokenCode = 'GT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const tokenRows = await query(
            `INSERT INTO tokens (code, "activityId", "userId", status, "createdAt", "paymentId")
             VALUES ($1, $2, $3, 'pending', NOW(), $4) RETURNING id`,
            [tokenCode, activityId, finalUserId, paymentId]
        );

        const response: any = {
            success: true,
            pending: true,
            message: 'Payment initiated. Please check your phone and authorize the payment.',
            chargeId,
            paymentId,
            provider: 'PayChangu',
            token: { id: tokenRows[0].id, code: tokenCode, status: 'pending' },
        };

        if (guestUser) response.user = guestUser;

        res.json(response);
    } catch (error) {
        console.error('[Payment] Error initiating payment:', error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

app.post('/api/payment/webhook', async (req, res) => {
    try {
        const payload = req.body;
        const event = payload.event;
        const data = payload.data;

        if (!data || !data.charge_id) return res.status(400).json({ error: 'Invalid payload' });

        const chargeId = data.charge_id;
        const status = data.status || event;

        const payments = await query('SELECT * FROM payments WHERE "transactionId" = $1', [chargeId]);
        if (payments.length === 0) return res.status(404).json({ error: 'Payment not found' });

        const payment = payments[0];

        if (['successful', 'success'].includes(status) || event === 'charge.successful') {
            await pool.query(
                `UPDATE payments SET status = 'completed', "gatewayResponse" = "gatewayResponse" || $1, "processedAt" = NOW() WHERE "transactionId" = $2`,
                ['\nWebhook: ' + JSON.stringify(payload), chargeId]
            );

            const pendingTokens = await query(
                `SELECT t.id, t."activityId", a.capacity, a."currentOccupancy"
                 FROM tokens t JOIN activities a ON t."activityId" = a.id
                 WHERE t."paymentId" = $1 AND t.status = 'pending'`,
                [payment.id]
            );

            if (pendingTokens.length > 0) {
                const token = pendingTokens[0];
                const availableSpots = token.capacity - token.currentOccupancy;

                if (availableSpots > 0) {
                    await pool.query(`UPDATE tokens SET status = 'ready' WHERE id = $1`, [token.id]);
                    await pool.query(`UPDATE activities SET "currentOccupancy" = "currentOccupancy" + 1 WHERE id = $1`, [token.activityId]);
                } else {
                    await pool.query(`UPDATE tokens SET status = 'queue' WHERE id = $1`, [token.id]);
                }
            }

            return res.json({ received: true, status: 'success' });
        } else if (['failed', 'cancelled', 'declined'].includes(status)) {
            await pool.query(
                `UPDATE payments SET status = 'failed', "failedReason" = $1, "gatewayResponse" = "gatewayResponse" || $2, "processedAt" = NOW() WHERE "transactionId" = $3`,
                [status, '\nWebhook: ' + JSON.stringify(payload), chargeId]
            );
            await pool.query(`UPDATE tokens SET status = 'cancelled' WHERE "paymentId" = $1 AND status = 'pending'`, [payment.id]);

            return res.json({ received: true, status: 'failed' });
        } else {
            await pool.query(
                `UPDATE payments SET "gatewayResponse" = "gatewayResponse" || $1 WHERE "transactionId" = $2`,
                ['\nWebhook: ' + JSON.stringify(payload), chargeId]
            );
            return res.json({ received: true, status: 'acknowledged' });
        }
    } catch (error) {
        console.error('[Webhook] Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

app.get('/api/payment/status/:chargeId', async (req, res) => {
    try {
        const { chargeId } = req.params;

        const payments = await query('SELECT * FROM payments WHERE "transactionId" = $1', [chargeId]);
        if (payments.length === 0) return res.status(404).json({ error: 'Payment not found' });

        const payment = payments[0];

        if (payment.status === 'pending' && PAYCHANGU_SECRET_KEY) {
            try {
                const verification = await verifyPayChanguPayment(chargeId);
                const paychanguStatus = verification.data?.status;

                if (['successful', 'success'].includes(paychanguStatus)) {
                    await pool.query(`UPDATE payments SET status = 'completed' WHERE id = $1`, [payment.id]);

                    const pendingTokens = await query(
                        `SELECT t.id, t."activityId", a.capacity, a."currentOccupancy"
                         FROM tokens t JOIN activities a ON t."activityId" = a.id
                         WHERE t."paymentId" = $1 AND t.status = 'pending'`,
                        [payment.id]
                    );

                    if (pendingTokens.length > 0) {
                        const token = pendingTokens[0];
                        if (token.capacity - token.currentOccupancy > 0) {
                            await pool.query(`UPDATE tokens SET status = 'ready' WHERE id = $1`, [token.id]);
                            await pool.query(`UPDATE activities SET "currentOccupancy" = "currentOccupancy" + 1 WHERE id = $1`, [token.activityId]);
                        } else {
                            await pool.query(`UPDATE tokens SET status = 'queue' WHERE id = $1`, [token.id]);
                        }
                    }
                    payment.status = 'completed';
                } else if (['failed', 'cancelled'].includes(paychanguStatus)) {
                    await pool.query(`UPDATE payments SET status = 'failed', "failedReason" = $1 WHERE id = $2`, [paychanguStatus, payment.id]);
                    await pool.query(`UPDATE tokens SET status = 'cancelled' WHERE "paymentId" = $1 AND status = 'pending'`, [payment.id]);
                    payment.status = 'failed';
                }
            } catch (verifyError) {
                console.error(`[Payment Status] Verification error:`, verifyError);
            }
        }

        const tokens = await query('SELECT * FROM tokens WHERE "paymentId" = $1', [payment.id]);

        res.json({
            chargeId,
            status: payment.status,
            amount: payment.amount,
            createdAt: payment.createdAt,
            token: tokens.length > 0 ? { id: tokens[0].id, code: tokens[0].code, status: tokens[0].status } : null,
        });
    } catch (error) {
        console.error('[Payment Status] Error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

app.get('/api/payments', async (_req, res) => {
    try {
        const payments = await query(`
            SELECT p.*, u.username, a.name AS "activityName"
            FROM payments p
            JOIN users u ON p."userId" = u.id
            JOIN activities a ON p."activityId" = a.id
            WHERE p."isActive" = true
            ORDER BY p."createdAt" DESC
        `);
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// ──────────────────────────────────────────────
// Admin Dashboard
// ──────────────────────────────────────────────

app.get('/api/admin/dashboard', async (_req, res) => {
    try {
        const revenueRows = await query(`
            SELECT COUNT(*) AS "totalTokens",
                   COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS "completedTokens",
                   COALESCE(SUM(a.price), 0) AS "totalRevenue"
            FROM tokens t
            LEFT JOIN activities a ON t."activityId" = a.id
        `);
        const revenue = revenueRows[0];

        const capacityRows = await query(`
            SELECT SUM(capacity) AS "totalCapacity", SUM("currentOccupancy") AS "totalOccupancy"
            FROM activities WHERE "isActive" = true
        `);
        const capacity = capacityRows[0];

        const staffRows = await query(`
            SELECT COUNT(*) AS "activeStaff"
            FROM users u
            JOIN staff s ON u.id = s."userId"
            WHERE s.status = 'active' AND u."isActive" = true AND s."isActive" = true
        `);
        const staff = staffRows[0];

        const weeklyRows = await query(`
            SELECT TO_CHAR(d.dt, 'YYYY-MM-DD') AS date,
                   COALESCE(t.cnt, 0) AS visitors
            FROM (
                SELECT CURRENT_DATE - (seq || ' days')::interval AS dt
                FROM generate_series(0, 6) AS seq
            ) d
            LEFT JOIN (
                SELECT DATE("createdAt") AS token_date, COUNT(*) AS cnt
                FROM tokens
                WHERE "createdAt" >= CURRENT_DATE - interval '6 days'
                  AND "createdAt" < CURRENT_DATE + interval '1 day'
                GROUP BY DATE("createdAt")
            ) t ON t.token_date = d.dt::date
            ORDER BY d.dt ASC
        `);

        res.json({
            totalRevenue: Number(revenue.totalRevenue) || 0,
            totalTokens: Number(revenue.totalTokens) || 0,
            completedTokens: Number(revenue.completedTokens) || 0,
            totalCapacity: Number(capacity.totalCapacity) || 0,
            totalOccupancy: Number(capacity.totalOccupancy) || 0,
            activeStaff: Number(staff.activeStaff) || 0,
            weeklyData: weeklyRows.map(r => ({ date: r.date, visitors: Number(r.visitors) || 0 })),
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { userId, activityId, rating, comment } = req.body;

        if (!userId || !activityId || !rating) return res.status(400).json({ error: 'userId, activityId, and rating required' });
        if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });

        const rows = await query(
            `INSERT INTO feedback ("userId", "activityId", rating, comment) VALUES ($1, $2, $3, $4) RETURNING id`,
            [userId, activityId, rating, comment]
        );

        await pool.query(`
            UPDATE activities
            SET rating = (SELECT AVG(rating) FROM feedback WHERE "activityId" = $1),
                "reviewCount" = (SELECT COUNT(*) FROM feedback WHERE "activityId" = $1)
            WHERE id = $1
        `, [activityId]);

        res.status(201).json({ message: 'Feedback submitted successfully', id: rows[0].id });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

app.get('/api/admin/export-report', async (_req, res) => {
    try {
        const tokens = await query(`
            SELECT t.code, t.status, t."createdAt", t."usedAt",
                   a.name AS activity, a.price AS amount, u.username AS "userName"
            FROM tokens t
            JOIN activities a ON t."activityId" = a.id
            LEFT JOIN users u ON t."userId" = u.id
            ORDER BY t."createdAt" DESC
        `);

        const activities = await query(`
            SELECT name, capacity, "currentOccupancy", rating, "reviewCount"
            FROM activities WHERE "isActive" = true
        `);

        const staff = await query(`
            SELECT u.username AS name, u.email, u.role, s.status, a.name AS zone
            FROM users u
            JOIN staff s ON u.id = s."userId"
            LEFT JOIN "staffActivities" sa ON s.id = sa."staffId" AND sa."isActive" = true
            LEFT JOIN activities a ON sa."activityId" = a.id AND a."isActive" = true
            WHERE u."isActive" = true AND s."isActive" = true
        `);

        const totalRevenue = tokens.reduce((sum, t) => sum + (t.amount || 0), 0);

        res.json({
            summary: {
                totalTokens: tokens.length,
                completedTokens: tokens.filter(t => t.status === 'completed').length,
                totalRevenue,
                totalActivities: activities.length,
                totalStaff: staff.length,
                generatedDate: new Date().toLocaleDateString(),
            },
            recentTokens: tokens.slice(0, 50),
            activities,
            staff,
        });
    } catch (error) {
        console.error('Export report error:', error);
        res.status(500).json({ error: 'Failed to export report' });
    }
});

// ──────────────────────────────────────────────
// 404 + Central Error Handling
// ──────────────────────────────────────────────

app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

    if (res.headersSent) {
        res.end();
        return;
    }

    const status = (err as { status?: number; statusCode?: number }).status
        || (err as { statusCode?: number }).statusCode
        || 500;

    res.status(status >= 400 && status < 600 ? status : 500).json({
        error: status === 500 ? 'Internal Server Error' : err.message,
    });
});

// ──────────────────────────────────────────────
// Server Startup
// ──────────────────────────────────────────────

const HOST = process.env.HOST || '0.0.0.0';
let httpServer: import('http').Server | null = null;
let shuttingDown = false;

async function startServer(): Promise<void> {
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
        console.error('Could not start server: database connection failed');
        process.exit(1);
    }

    // Route is now registered at module level, not inside this function.
    httpServer = app.listen(PORT, HOST);

    // CRITICAL: 'error' on a net.Server is an EventEmitter error. Without a
    // listener Node treats it as an uncaught exception and the process dies —
    // this is what EADDRINUSE looks like from the outside ("server just died").
    httpServer.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`✗ Port ${PORT} is already in use. Another copy of the server (or a zombie process) is holding it.`);
            console.error(`  Find it:  netstat -ano | findstr :${PORT}`);
            console.error(`  Kill it:  taskkill /PID <pid> /F`);
        } else if (err.code === 'EACCES') {
            console.error(`✗ Permission denied binding port ${PORT}. Try a port above 1024 or run as an elevated shell.`);
        } else if (err.code === 'EADDRNOTAVAIL') {
            console.error(`✗ Host ${HOST} is not available on this machine.`);
        } else {
            console.error('✗ HTTP server error:', err);
        }
        process.exit(1);
    });

    httpServer.on('listening', () => {
        console.log(`✓ Server running on http://${HOST}:${PORT}  (pid ${process.pid})`);
        console.log(`  Mode     : ${SERVER_MODE}${SERVER_MODE === 'online' ? ' (backend/.env.production)' : ' (backend/.env)'}`);
        console.log(`  Database : ${process.env.DATABASE_URL ? 'DATABASE_URL (host redacted)' : `${process.env.DB_HOST}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME}`}  ssl=${DB_SSL ? 'on' : 'off'}`);
        console.log(`  Uploads  : ${UPLOAD_DIR}`);
        console.log(`  Liveness : http://localhost:${PORT}/ping`);
        console.log(`  Readiness: http://localhost:${PORT}/api/health`);
    });

    // A hung request must not hold a socket forever.
    httpServer.requestTimeout = 30_000;
    httpServer.headersTimeout = 20_000;
    httpServer.keepAliveTimeout = 10_000;
    httpServer.maxRequestsPerSocket = 1000;
}

// Graceful shutdown: stop accepting, drain, close the pool, then exit.
function shutdown(signal: string): void {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} received — shutting down gracefully…`);

    const forceExit = setTimeout(() => {
        console.error('Shutdown timed out after 10s — forcing exit.');
        process.exit(1);
    }, 10_000);
    forceExit.unref();

    const done = () => {
        clearTimeout(forceExit);
        process.exit(0);
    };

    if (httpServer) httpServer.close(done);
    else done();

    // Always drain the pool so Postgres doesn't keep the process alive.
    Promise.resolve(pool?.end()).catch(() => undefined).finally(done);
}

// Never let a stray rejection or throw take the whole process down silently.
process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught exception:', err);
    // The process is in an undefined state; drain and restart cleanly.
    shutdown('uncaughtException');
});

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
    console.error('Fatal startup error:', error);
    process.exit(1);
});
