/**
 * Backend Server - Ground Token Application
 * 
 * Main Express server with TypeORM database integration.
 * 
 * Key Components:
 * 1. Database Connection (TypeORM): Initialized via AppDataSource
 * 2. Express Middleware: CORS for cross-origin requests, JSON parsing
 * 3. API Routes: RESTful endpoints for all features
 * 4. Error Handling: Global error handler with proper HTTP status codes
 * 
 * Architecture Notes:
 * - All database entities defined in schema.ts (single file for clarity)
 * - Migrations stored in migrations/ folder
 * - API routes query database entities directly via TypeORM repositories
 * - All endpoints use async/await for database operations
 * 
 * Environment Variables (.env):
 * - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME: Database config
 * - PORT: Server port (default: 5000)
 * - NODE_ENV: Environment (development/production)
 */

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

// PayChangu Configuration
const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || '';
const PAYCHANGU_BASE_URL = process.env.PAYCHANGU_BASE_URL || 'https://api.paychangu.com';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

// SESSION_DURATION_MS: Time in milliseconds for play sessions
// Sample values for testing/production:
// - 30 * 1000 = 30 seconds (current MVP testing)
// - 60 * 1000 = 1 minute (recommended for testing)
// - 5 * 60 * 1000 = 5 minutes (short sessions)
// - 10 * 60 * 1000 = 10 minutes (standard sessions)
// - 15 * 60 * 1000 = 15 minutes (extended sessions)
// - 30 * 60 * 1000 = 30 minutes (long sessions)
const SESSION_DURATION_MS = 60 * 1000; // 1 minute for testing

// PayChangu API helper function
async function initiatePayChanguPayment(params: {
  amount: number;
  mobile: string;
  provider: string;
  chargeId: string;
}) {
  const { amount, mobile, provider, chargeId } = params;
  
  // Convert phone to 9 digits (remove leading 0 or +265)
  let cleanMobile = mobile.replace(/\D/g, ''); // Remove non-digits
  if (cleanMobile.startsWith('0')) {
    cleanMobile = cleanMobile.substring(1); // Remove leading 0
  }
  if (cleanMobile.startsWith('265')) {
    cleanMobile = cleanMobile.substring(3); // Remove country code
  }
  
  // Fetch operators dynamically from PayChangu
  const operators = await fetchMobileMoneyOperators();
  console.log('[PayChangu] Available operators:', operators.map(o => ({ name: o.name, ref_id: o.ref_id })));
  
  // Find operator by name (case-insensitive partial match)
  const providerLower = provider.toLowerCase();
  const operator = operators.find(op => 
    op.name.toLowerCase().includes(providerLower) || 
    providerLower.includes(op.name.toLowerCase().replace(' ', ''))
  );
  
  if (!operator) {
    throw new Error(`Mobile money operator not found for provider: ${provider}. Available: ${operators.map(o => o.name).join(', ')}`);
  }
  
  console.log(`[PayChangu] Using operator: ${operator.name} (${operator.ref_id})`);
  
  const response = await fetch(`${PAYCHANGU_BASE_URL}/mobile-money/payments/initialize`, {
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

// Fetch Mobile Money Operators from PayChangu
async function fetchMobileMoneyOperators(): Promise<Array<{ref_id: string, name: string, country: string}>> {
  try {
    const response = await fetch(`${PAYCHANGU_BASE_URL}/mobile-money`, {
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

// Verify PayChangu payment status
async function verifyPayChanguPayment(chargeId: string) {
  const response = await fetch(`${PAYCHANGU_BASE_URL}/mobile-money/payments/${chargeId}/verify`, {
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
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        console.log('Upload destination path:', uploadPath);
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadPath)) {
            console.log('Creating uploads directory...');
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('Multer verifying:', file.originalname, file.mimetype);
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        // Let's be a bit more permissive on web uploads where extensions might be missing
        if (mimetype || extname) {
            return cb(null, true);
        } else {
            console.warn(`File rejected. Mimetype: ${file.mimetype}, Ext: ${path.extname(file.originalname)}`);
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Database connection
let db: mysql.Connection;

async function initializeDatabase() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'db_ground_token',
    });
    console.log('✓ Database connected successfully');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

/**
 * Middleware Configuration
 * 
 * CORS: Allow requests from frontend (update in production)
 * JSON: Parse incoming JSON payloads
 * URL-encoded: Parse form data
 * Static: Serve uploaded files
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * API Routes - All queries from TypeORM database
 * 
 * Updated to use real database connections instead of hardcoded data.
 * Each endpoint queries the appropriate entity from the database.
 */

// Test upload directory access
app.get('/api/test-upload', (req, res) => {
    try {
        const uploadPath = path.join(__dirname, 'uploads');
        
        console.log('Upload path:', uploadPath);
        console.log('Directory exists:', fs.existsSync(uploadPath));
        
        if (fs.existsSync(uploadPath)) {
            const files = fs.readdirSync(uploadPath);
            console.log('Files in uploads:', files);
            res.json({ 
                uploadPath, 
                exists: true, 
                files 
            });
        } else {
            res.json({ 
                uploadPath, 
                exists: false, 
                message: 'Upload directory does not exist' 
            });
        }
    } catch (error) {
        console.error('Upload test error:', error);
        res.status(500).json({ error: 'Upload test failed' });
    }
});

// Fetch all activities for visitor catalog
app.get('/api/activities', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM activities WHERE isActive = 1'
        );
        const activities = rows as any[];

        // Transform to frontend format
        const formattedActivities = activities.map(activity => ({
            id: activity.id,
            name: activity.name,
            description: activity.description,
            type: activity.type || 'play',
            price: activity.price,
            currentOccupancy: activity.currentOccupancy,
            capacity: activity.capacity,
            image: activity.image,
            isCapacityControlOpen: activity.isCapacityControlOpen,
            test: 'updated',
        }));

        console.log('Activities response:', formattedActivities[0]); // Debug log

        res.json(formattedActivities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Fetch specific activity details by ID
app.get('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(
            'SELECT * FROM activities WHERE id = ?', [id]
        );
        const activities = rows as any[];
        
        if (activities.length === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        const activity = activities[0];
        
        // Return activity with calculated stats
        res.json({
            id: activity.id,
            name: activity.name,
            type: activity.type || 'play',
            price: activity.price,
            capacity: activity.capacity,
            currentOccupancy: activity.currentOccupancy,
            rating: activity.rating,
            reviewCount: activity.reviewCount,
            description: activity.description,
            image: activity.image,
            safetyRules: activity.safetyRules ? JSON.parse(activity.safetyRules) : [],
        });
    } catch (error) {
        console.error('Error fetching activity detail:', error);
        res.status(500).json({ error: 'Failed to fetch activity details' });
    }
});

// Fetch all activities for admin dashboard with capacity info
app.get('/api/admin/activities', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM activities');
        const activities = rows as any[];
        
        // Transform to admin view with capacity info
        const adminActivities = activities.map(activity => ({
            id: activity.id,
            name: activity.name,
            type: activity.type || 'play',
            capacity: `${activity.currentOccupancy}/${activity.capacity}`,
            percent: (activity.currentOccupancy / activity.capacity) * 100,
            image: activity.image,
        }));
        
        res.json(adminActivities);
    } catch (error) {
        console.error('Error fetching admin activities:', error);
        res.status(500).json({ error: 'Failed to fetch admin activities' });
    }
});

// Fetch tokens for a specific user
async function processAutoQueue() {
    try {
        const [actRows] = await db.execute('SELECT id, capacity FROM activities WHERE isActive = 1');
        const activities = actRows as any[];

        for (const act of activities) {
            // Expire old tokens (only 'in_use' status, not 'ready')
            // Timer only starts when session begins (staff scan or visitor tap)
            await db.execute(
                `UPDATE tokens SET status = 'completed' WHERE activityId = ? AND status = 'in_use' AND DATE_ADD(usedAt, INTERVAL ? SECOND) < NOW()`,
                [act.id, SESSION_DURATION_MS / 1000]
            );

            // Count current occupancy (both 'in_use' and 'ready' occupy capacity)
            const [activeCountRows] = await db.execute(
                `SELECT COUNT(*) as cnt FROM tokens WHERE activityId = ? AND (status = 'in_use' OR status = 'ready')`,
                [act.id]
            );
            const activeCount = Number((activeCountRows as any[])[0].cnt);
            const availableSpots = act.capacity - activeCount;

            if (availableSpots > 0) {
                // Pull from queue and promote to 'ready' (timer NOT started yet)
                const [queueRows] = await db.execute(
                    `SELECT id FROM tokens WHERE activityId = ? AND status = 'queue' ORDER BY createdAt ASC LIMIT ?`,
                    [act.id, availableSpots]
                );
                const qTokens = queueRows as any[];
                if (qTokens.length > 0) {
                    const ids = qTokens.map((r: any) => r.id);
                    await db.execute(
                        `UPDATE tokens SET status = 'ready' WHERE id IN (${ids.join(',')})`
                    );
                }
            }

            // Update activities table to reflect accurate occupancy (count in_use + ready)
            const [newActiveRows] = await db.execute(
                `SELECT COUNT(*) as cnt FROM tokens WHERE activityId = ? AND (status = 'in_use' OR status = 'ready')`,
                [act.id]
            );
            const newActiveCount = Number((newActiveRows as any[])[0].cnt);
            await db.execute(
                `UPDATE activities SET currentOccupancy = ? WHERE id = ?`,
                [newActiveCount, act.id]
            );
        }
    } catch (err) {
        console.error('Error processing auto queue:', err);
    }
}

app.get('/api/tokens', async (req, res) => {
    try {
        await processAutoQueue();
        const { userId } = req.query;
        
        // Fetch ALL tokens first to calculate queue positions globally
        let query = `
            SELECT t.*, COALESCE(a.name, 'Unknown Activity') as activityName, 
                   COALESCE(a.type, 'play') as activityType, u.username 
            FROM tokens t 
            LEFT JOIN activities a ON t.activityId = a.id 
            JOIN users u ON t.userId = u.id 
            ORDER BY t.createdAt ASC
        `;
        
        const [rows] = await db.execute(query);
        const allTokens = rows as any[];

        console.log('[Tokens] Raw query result count:', allTokens.length);
        console.log('[Tokens] Sample raw token:', allTokens[0]);

        // Calculate queue positions globally for each activity
        const queuePositions: Record<string, number> = {};
        const tokensWithPositions = allTokens.map((token) => {
            let qPos = null;
            if (token.status === 'queue') {
                queuePositions[token.activityId] = (queuePositions[token.activityId] || 0) + 1;
                qPos = `#${queuePositions[token.activityId]}`;
            }

            // Only calculate expiresAt for tokens with usedAt set (status 'in_use')
            // 'ready' tokens don't have expiresAt yet - timer starts when session begins
            let computedExpiresAt = null;
            if (token.usedAt) {
                const baseTime = new Date(token.usedAt);
                computedExpiresAt = new Date(baseTime.getTime() + SESSION_DURATION_MS).toISOString();
            }

            return {
                id: token.id,
                activityId: token.activityId,
                name: token.activityName || 'Unknown',
                code: token.code,
                status: token.status, // Pass through as-is (ready, in_use, queue, completed, expired)
                queuePosition: qPos,
                qrImage: token.qrCode,
                username: token.username,
                createdAt: token.createdAt,
                expiresAt: computedExpiresAt,
                activityType: token.activityType || 'play',
            };
        });

        // Filter by userId if provided (after queue positions are calculated globally)
        if (userId) {
            const userIdNum = parseInt(userId as string);
            const filtered = allTokens
                .filter(token => token.userId === userIdNum)
                .map(token => {
                    const formatted = tokensWithPositions.find(t => t.id === token.id);
                    return formatted;
                })
                .filter(t => t !== undefined);
            res.json(filtered);
        } else {
            res.json(tokensWithPositions);
        }
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ error: 'Failed to fetch tokens' });
    }
});

// Validate token by code (for scanner)
app.get('/api/tokens/validate/:code', async (req, res) => {
    try {
        const { code } = req.params;
        
        const [rows] = await db.execute(`
            SELECT t.*, COALESCE(a.name, 'Unknown Activity') as activityName, 
                   COALESCE(a.type, 'play') as activityType, u.username 
            FROM tokens t 
            LEFT JOIN activities a ON t.activityId = a.id 
            JOIN users u ON t.userId = u.id 
            WHERE t.code = ?
        `, [code]);
        const tokens = rows as any[];
        
        if (tokens.length === 0) {
            return res.status(404).json({ 
                valid: false, 
                message: 'Token not found' 
            });
        }
        
        const token = tokens[0];
        
        // Check if token is expired
        const baseTime = token.usedAt ? new Date(token.usedAt) : new Date(token.createdAt);
        const expiresAt = new Date(baseTime.getTime() + SESSION_DURATION_MS);
        const now = new Date();
        const isExpired = now > expiresAt;

        // Determine validity
        let isValid = false;
        let statusMessage = '';

        if (isExpired) {
            isValid = false;
            statusMessage = 'Token has expired';
        } else if (token.status === 'completed' || token.status === 'cancelled') {
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
            // Token is ready - start the session by updating to 'in_use'
            isValid = true;
            statusMessage = 'Token is valid and ready for use';
            await db.execute(
                `UPDATE tokens SET status = 'in_use', usedAt = NOW() WHERE id = ?`,
                [token.id]
            );
            console.log(`[Validate] Token ${token.id} started session (ready → in_use)`);
        } else {
            isValid = false;
            statusMessage = 'Unknown token status';
        }
        
        // Calculate queue position if in queue
        let queuePosition = null;
        if (token.status === 'queue') {
            const [queueRows] = await db.execute(
                `SELECT COUNT(*) as cnt FROM tokens WHERE activityId = ? AND status = 'queue' AND createdAt <= ?`,
                [token.activityId, token.createdAt]
            );
            queuePosition = (queueRows as any[])[0].cnt;
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
                expiresAt: expiresAt.toISOString(),
                isExpired: isExpired,
                queuePosition: queuePosition,
            }
        });
    } catch (error) {
        console.error('Error validating token:', error);
        res.status(500).json({ error: 'Failed to validate token' });
    }
});

// Start token session (visitor taps QR code to begin)
app.post('/api/tokens/:id/start', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.execute(`
            SELECT t.*, a.name as activityName, a.type as activityType
            FROM tokens t
            LEFT JOIN activities a ON t.activityId = a.id
            WHERE t.id = ?
        `, [id]);
        const tokens = rows as any[];

        if (tokens.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Token not found'
            });
        }

        const token = tokens[0];

        // Only allow starting if token is in 'ready' state
        if (token.status !== 'ready') {
            return res.status(400).json({
                success: false,
                message: `Token cannot be started. Current status: ${token.status}`
            });
        }

        // Update token to 'in_use' and set usedAt timestamp
        await db.execute(
            `UPDATE tokens SET status = 'in_use', usedAt = NOW() WHERE id = ?`,
            [id]
        );

        console.log(`[Start Session] Token ${id} started by visitor (ready → in_use)`);

        // Return updated token with expiresAt
        const baseTime = new Date();
        const expiresAt = new Date(baseTime.getTime() + SESSION_DURATION_MS).toISOString();

        res.json({
            success: true,
            message: 'Session started successfully',
            token: {
                id: token.id,
                code: token.code,
                status: 'in_use',
                activityName: token.activityName,
                activityType: token.activityType || 'play',
                expiresAt: expiresAt,
            }
        });
    } catch (error) {
        console.error('Error starting token session:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// Fetch all staff members
app.get('/api/staff', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.username, u.email, u.phone, u.role,
                   s.staffId, s.status, u.isActive,
                   a.name as zone
            FROM users u 
            JOIN staff s ON u.id = s.userId 
            LEFT JOIN staffActivities sa ON s.id = sa.staffId AND sa.isActive = 1
            LEFT JOIN activities a ON sa.activityId = a.id AND a.isActive = 1
            WHERE u.isActive = 1 AND s.isActive = 1
        `);
        const staff = rows as any[];

        // Transform to frontend format
        const formattedStaff = staff.map(member => ({
            id: member.id,
            name: member.username,
            zone: member.zone || 'Unassigned',
            status: !member.zone ? 'Unassigned' : (member.status === 'active' ? 'Active' :
                   member.status === 'off_duty' ? 'Off-Duty' : 'Inactive'),
            image: member.image || 'https://picsum.photos/200',
        }));

        res.json(formattedStaff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Fetch staff member's assigned activity
app.get('/api/staff/:staffId/activity', async (req, res) => {
    try {
        const { staffId } = req.params;
        
        const [rows] = await db.execute(`
            SELECT a.*, sa.staffId as assignedStaffId
            FROM activities a
            JOIN staffActivities sa ON a.id = sa.activityId
            JOIN staff s ON sa.staffId = s.id
            WHERE s.userId = ? AND sa.isActive = 1 AND a.isActive = 1
            LIMIT 1
        `, [staffId]);
        const activities = rows as any[];
        
        if (activities.length === 0) {
            return res.status(404).json({ error: 'No activity assigned to this staff member' });
        }
        
        const activity = activities[0];
        res.json({
            id: activity.id,
            name: activity.name,
            type: activity.type || 'play',
            description: activity.description,
            price: activity.price,
            capacity: activity.capacity,
            currentOccupancy: activity.currentOccupancy,
            image: activity.image,
            safetyRules: activity.safetyRules ? JSON.parse(activity.safetyRules) : [],
        });
    } catch (error) {
        console.error('Error fetching staff activity:', error);
        res.status(500).json({ error: 'Failed to fetch staff activity' });
    }
});

// Update activity capacity control status
app.put('/api/activities/:id/capacity-control', async (req, res) => {
    try {
        const { id } = req.params;
        const { isOpen } = req.body;
        
        if (typeof isOpen !== 'boolean') {
            return res.status(400).json({ error: 'isOpen must be a boolean' });
        }
        
        // Update the capacity control flag
        const [result] = await db.execute(
            'UPDATE activities SET isCapacityControlOpen = ?, updatedAt = NOW() WHERE id = ?',
            [isOpen, id]
        );
        
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        // When capacity control is turned OFF, expire active visitors and promote queue #1
        if (!isOpen) {
            console.log(`[Capacity Control] Turning OFF for activity ${id} - expiring active visitors and promoting queue #1`);

            // Expire all currently active (in_use and ready) tokens for this activity
            await db.execute(
                `UPDATE tokens SET status = 'expired' WHERE activityId = ? AND (status = 'in_use' OR status = 'ready')`,
                [id]
            );

            // Get the first token in queue (ordered by creation time)
            const [queueRows] = await db.execute(
                `SELECT id FROM tokens WHERE activityId = ? AND status = 'queue' ORDER BY createdAt ASC LIMIT 1`,
                [id]
            );
            const queueTokens = queueRows as any[];

            if (queueTokens.length > 0) {
                // Promote the first queue token to 'ready' (timer NOT started yet)
                const firstQueueTokenId = queueTokens[0].id;
                await db.execute(
                    `UPDATE tokens SET status = 'ready' WHERE id = ?`,
                    [firstQueueTokenId]
                );
                console.log(`[Capacity Control] Promoted token ${firstQueueTokenId} from queue to ready`);
            }

            // Update currentOccupancy to reflect the new state (count in_use + ready)
            const [newActiveRows] = await db.execute(
                `SELECT COUNT(*) as cnt FROM tokens WHERE activityId = ? AND (status = 'in_use' OR status = 'ready')`,
                [id]
            );
            const newActiveCount = Number((newActiveRows as any[])[0].cnt);
            await db.execute(
                `UPDATE activities SET currentOccupancy = ? WHERE id = ?`,
                [newActiveCount, id]
            );
            console.log(`[Capacity Control] Updated occupancy to ${newActiveCount}`);
        } else {
            console.log(`[Capacity Control] Turning ON for activity ${id} - normal queue processing will handle capacity limits`);
        }
        
        res.json({ 
            message: 'Capacity control status updated successfully',
            isOpen: isOpen
        });
    } catch (error) {
        console.error('Error updating capacity control:', error);
        res.status(500).json({ error: 'Failed to update capacity control status' });
    }
});

// Fetch user profile by userId
app.get('/api/profile', async (req, res) => {
    try {
        const { userId } = req.query;
        
        let query = 'SELECT * FROM users WHERE isActive = 1';
        let params: any[] = [];
        
        // If userId provided, fetch that specific user
        if (userId) {
            query += ' AND id = ?';
            params.push(userId);
        } else {
            // Fallback: return first visitor (for backward compatibility)
            query += ' AND role = ? LIMIT 1';
            params.push('visitor');
        }
        
        const [rows] = await db.execute(query, params);
        const users = rows as any[];
        
        if (users.length > 0) {
            const user = users[0];
            res.json({
                id: user.id,
                username: user.username || 'Guest',
                email: user.email || 'visitor@gelatokids.com',
                phone: user.phone || '+2651234572',
                avatar: 'https://picsum.photos/200',
                role: user.role,
                createdAt: user.createdAt
            });
        } else {
            res.json({
                id: null,
                username: 'Guest',
                email: 'visitor@gelatokids.com',
                phone: '+2651234572',
                avatar: 'https://picsum.photos/200',
                role: 'visitor',
                createdAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Fetch feedback options (static data)
app.get('/api/feedback/options', (req, res) => {
    // Updated comment: Static options for feedback form
    res.json({
        quickTags: ['Cleanliness', 'Friendly Staff', 'Safety', 'Equipment'],
        ratingLabels: ['', 'Terrible', 'Bad', 'Okay', 'Great', 'Amazing'],
    });
});

/**
 * Authentication Routes
 */

// Universal login for all user types
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`[Auth] Login attempt: Username=${username}`);
        
        if (!username || !password) {
            console.log('[Auth] Login failed: Missing credentials');
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Query user from users table
        const [userRows] = await db.execute(`
            SELECT u.*, s.staffId, s.status as staffStatus 
            FROM users u 
            LEFT JOIN staff s ON u.id = s.userId 
            WHERE u.username = ? AND u.isActive = 1
        `, [username]);
        const users = userRows as any[];

        if (users.length === 0) {
            console.log(`[Auth] Login failed: User not found: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        
        // For now, accept any password (implement proper hashing in production)
        if (password !== user.password) {
            console.log(`[Auth] Login failed: Invalid password for user: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Additional check for staff users - they must be active in staff table
        if (user.role === 'staff' && (!user.staffId || user.staffStatus !== 'active')) {
            console.log(`[Auth] Login failed: Staff account not active: ${username}`);
            return res.status(401).json({ error: 'Staff account not active' });
        }

        console.log(`[Auth] Login successful: ${username}, Role=${user.role}, UserID=${user.id}`);

        // Return user info without JWT for MVP
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('[Auth] Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Register new staff
app.post('/api/auth/register-staff', async (req, res) => {
    try {
        const { 
            email, 
            username, 
            password, 
            role,
            phone
        } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        // Check if username already exists
        const [existingRows] = await db.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        const existing = existingRows as any[];

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Generate staff ID
        const staffId = `STAFF${Date.now()}`;

        // Insert new user first (auto-increment ID)
        const [userResult] = await db.execute(`
            INSERT INTO users (
                email, phone, username, password, role
            ) VALUES (?, ?, ?, ?, ?)
        `, [email, phone, username, password, role || 'staff']);

        const userId = (userResult as any).insertId;
        
        // Insert staff record linked to user (auto-increment ID)
        const [result] = await db.execute(`
            INSERT INTO staff (
                userId, staffId, status, isActive
            ) VALUES (?, ?, 'active', 1)
        `, [userId, staffId]);

        res.status(201).json({ 
            message: 'Staff registered successfully',
            id: (result as any).insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * Activity Management Routes
 */

// Create new activity (JSON only)
app.post('/api/activities', async (req, res) => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        
        // Handle JSON requests only
        const { 
            name, 
            description,
            type = 'play',
            price, 
            capacity, 
            rating = 0,
            reviewCount = 0,
            safetyRules = []
        } = req.body || {}; // Add fallback to empty object

        if (!name || !description || !price || !capacity) {
            console.log('Missing fields:', { name, description, price, capacity });
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const imagePath = null; // No file upload for JSON requests

        const [result] = await db.execute(`
            INSERT INTO activities (
                name, description, type, price, capacity, currentOccupancy, 
                image, rating, reviewCount, safetyRules, isActive
            ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, 1)
        `, [
            name, description, type, price, capacity, imagePath, 
            rating, reviewCount, JSON.stringify(safetyRules)
        ]);

        res.status(201).json({ 
            message: 'Activity created successfully',
            activity: {
                id: (result as any).insertId,
                name,
                description,
                price,
                capacity,
                image: imagePath,
                rating,
                reviewCount,
                safetyRules
            }
        });
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Create new activity with image upload
app.post('/api/activities/upload', (req, res, next) => {
    console.log('=== UPLOAD ROUTE DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    
    // Add error handling for multer
    upload.single('image')(req, res, (err) => {
        if (err) {
            // If multer fails (e.g., boundary not found), log and continue
            console.warn('Multer error in upload route:', err.message);
            console.warn('Multer error details:', err);
            return res.status(400).json({ error: err.message });
        } else {
            console.log('Multer processing successful');
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('Upload route - Request headers:', req.headers);
        console.log('Upload route - Request body:', req.body);
        console.log('Upload route - Request file:', req.file);
        console.log('Upload route - Files:', req.files);
        
        if (req.file) {
            console.log('File details:', {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            });
        }
        
        const { 
            name, 
            description,
            type = 'play',
            price, 
            capacity, 
            rating = 0,
            reviewCount = 0,
            safetyRules = [],
            staff
        } = req.body || {};

        if (!name || !description || !price || !capacity) {
            console.log('Upload route - Missing fields:', { name, description, price, capacity });
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        console.log('Final image path:', imagePath);

        const [result] = await db.execute(`
            INSERT INTO activities (
                name, description, type, price, capacity, currentOccupancy, 
                image, rating, reviewCount, safetyRules, isActive
            ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, 1)
        `, [
            name, description, type, price, capacity, imagePath, 
            rating, reviewCount, JSON.stringify(safetyRules)
        ]);

        const activityId = (result as any).insertId;
        console.log('Activity created with ID:', activityId);

        // Handle staff assignments
        if (staff) {
            try {
                const staffIds = JSON.parse(staff);
                console.log('Staff to assign:', staffIds);
                
                if (Array.isArray(staffIds) && staffIds.length > 0) {
                    for (const userId of staffIds) {
                        // Get staff.id from users.id
                        const [staffRows] = await db.execute(
                            'SELECT id FROM staff WHERE userId = ? AND isActive = 1',
                            [userId]
                        );
                        const staffRecords = staffRows as any[];
                        
                        if (staffRecords.length > 0) {
                            const staffId = staffRecords[0].id;
                            await db.execute(`
                                INSERT INTO staffActivities (staffId, activityId, isActive)
                                VALUES (?, ?, 1)
                            `, [staffId, activityId]);
                            console.log(`Assigned staff ${staffId} to activity ${activityId}`);
                        } else {
                            console.warn(`No staff record found for userId: ${userId}`);
                        }
                    }
                }
            } catch (staffError) {
                console.error('Error assigning staff:', staffError);
                // Don't fail the request if staff assignment fails
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
                safetyRules
            }
        });
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Delete activity
app.delete('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // ... rest of the code remains the same ...
        const [result] = await db.execute(
            'UPDATE activities SET isActive = 0 WHERE id = ?',
            [id]
        );

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({ error: 'Failed to delete activity' });
    }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, password } = req.body;
        console.log(`[User] Updating profile: UserID=${id}, Username=${username}, Email=${email}, HasPassword=${!!password}`);

        if (!username || !email) {
            console.log('[User] Update failed: Missing username or email');
            return res.status(400).json({ error: 'Username and email required' });
        }

        // Build update query dynamically based on provided fields
        let updateQuery = `
            UPDATE users SET 
                username = ?, email = ?, phone = ?, updatedAt = NOW()
        `;
        let updateParams = [username, email, phone, id];

        // Add password to update if provided
        if (password && password.trim()) {
            updateQuery = `
                UPDATE users SET 
                    username = ?, email = ?, phone = ?, password = ?, updatedAt = NOW()
            `;
            updateParams = [username, email, phone, password, id];
            console.log(`[User] Password will be updated for UserID=${id}`);
        }

        updateQuery += ' WHERE id = ? AND isActive = 1';

        const [result] = await db.execute(updateQuery, updateParams);

        if ((result as any).affectedRows === 0) {
            console.log(`[User] Update failed: User not found: ${id}`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`[User] Profile updated successfully: UserID=${id}`);

        res.json({ 
            message: 'User updated successfully',
            user: { id, username, email, phone }
        });
    } catch (error) {
        console.error('[User] Update error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * Payment Simulation Routes
 */

// Initiate payment with PayChangu
app.post('/api/payment/process', async (req, res) => {
    try {
        const { phoneNumber, amount, provider, activityId, userId } = req.body;
        console.log(`[Payment] Initiating PayChangu payment: Phone=${phoneNumber}, Amount=${amount}, Provider=${provider}, ActivityID=${activityId}, UserID=${userId || 'guest'}`);

        if (!phoneNumber || !amount || !provider) {
            console.log('[Payment] Failed: Missing payment details');
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // Check if PayChangu is configured
        if (!PAYCHANGU_SECRET_KEY) {
            console.error('[Payment] PayChangu not configured - PAYCHANGU_SECRET_KEY missing');
            return res.status(500).json({ error: 'Payment gateway not configured' });
        }

        // Determine the user ID - use provided userId or create new guest user
        let finalUserId = userId;
        let guestUser = null;
        
        // Only create guest user if no userId provided (no one logged in)
        if (!finalUserId) {
            // Guest checkout - create new anonymous user with generated code
            const guestCode = 'GUEST-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            console.log(`[Payment] Creating new guest user: ${guestCode}`);
            
            // Create new guest user
            const [newUser] = await db.execute(`
                INSERT INTO users (email, username, password, role, phone) 
                VALUES (?, ?, ?, ?, ?)
            `, [
                `${guestCode}@guest.gelatokids.com`,
                guestCode,
                '', // Empty password until they set it via profile update
                'visitor',
                phoneNumber // Still store phone for payment record
            ]);
            finalUserId = (newUser as any).insertId;
            guestUser = {
                id: finalUserId,
                username: guestCode,
                email: `${guestCode}@guest.gelatokids.com`,
                phone: phoneNumber,
                role: 'visitor'
            };
            console.log(`[Payment] Guest user created: ID=${finalUserId}, Username=${guestCode}`);
        } else {
            console.log(`[Payment] Using existing user ID: ${finalUserId}`);
        }

        // Validate activityId exists
        if (activityId) {
            const [activityCheck] = await db.execute('SELECT id FROM activities WHERE id = ?', [activityId]) as any[];
            if (activityCheck.length === 0) {
                return res.status(400).json({ error: 'Invalid activity ID' });
            }
        }

        // Format phone number for PayChangu (ensure +265 format)
        let formattedPhone = phoneNumber;
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '+265' + formattedPhone.substring(1);
        } else if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+265' + formattedPhone;
        }

        // Get user's email (use guest email or fetch from DB)
        let userEmail = guestUser?.email || `${finalUserId}@gelatokids.com`;
        if (!guestUser) {
            const [userRows] = await db.execute('SELECT email FROM users WHERE id = ?', [finalUserId]);
            const users = userRows as any[];
            if (users.length > 0 && users[0].email) {
                userEmail = users[0].email;
            }
        }

        // Generate transaction reference
        const transactionId = 'PC' + Date.now();
        
        // Construct webhook URL (use environment or default)
        const serverUrl = process.env.EXPO_PUBLIC_API_URL || `http://localhost:${PORT}`;
        const callbackUrl = `${serverUrl}/api/payment/webhook`;

        // Initiate PayChangu payment
        let paychanguResponse;
        try {
            paychanguResponse = await initiatePayChanguPayment({
                amount: parseInt(amount),
                mobile: phoneNumber,
                provider: provider,
                chargeId: transactionId,
            });
            console.log(`[Payment] PayChangu response:`, paychanguResponse);
        } catch (apiError: any) {
            console.error('[Payment] PayChangu API error:', apiError.message);
            return res.status(500).json({ 
                error: 'Payment gateway error', 
                details: apiError.message 
            });
        }

        // Store pending payment in database
        const gatewayResponse = JSON.stringify(paychanguResponse);
        const chargeId = paychanguResponse.data?.charge_id || paychanguResponse.data?.ref_id || transactionId;
        const gatewayTransId = paychanguResponse.data?.trans_id || '';
        
        const [paymentResult] = await db.execute(`
            INSERT INTO payments (
                transactionId, userId, activityId, amount, currency, 
                provider, phoneNumber, status, gatewayTransactionId, 
                processedAt, gatewayResponse
            ) VALUES (?, ?, ?, ?, 'MWK', ?, ?, 'pending', ?, NOW(), ?)
        `, [
            chargeId, finalUserId, activityId || null, amount, provider, phoneNumber, 
            gatewayTransId, gatewayResponse
        ]);

        const paymentId = (paymentResult as any).insertId;

        // Store pending token (will be activated on webhook confirmation)
        const tokenCode = 'GT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const [tokenResult] = await db.execute(`
            INSERT INTO tokens (code, activityId, userId, status, createdAt, paymentId) 
            VALUES (?, ?, ?, 'pending', NOW(), ?)
        `, [tokenCode, activityId, finalUserId, paymentId]);
        
        console.log(`[Payment] Pending token created: ${tokenCode} (ID=${(tokenResult as any).insertId})`);

        // Build response
        const response: any = {
            success: true,
            pending: true,
            message: 'Payment initiated. Please check your phone and authorize the payment.',
            chargeId: chargeId,
            paymentId: paymentId,
            provider: 'PayChangu',
            token: {
                id: (tokenResult as any).insertId,
                code: tokenCode,
                status: 'pending'
            }
        };

        // Include user data if guest checkout
        if (guestUser) {
            response.user = guestUser;
            console.log(`[Payment] Returning guest user data: ${guestUser.username}`);
        }

        console.log(`[Payment] Response sent: pending=true, ChargeID=${chargeId}`);
        res.json(response);

    } catch (error) {
        console.error('[Payment] Error initiating payment:', error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

// PayChangu Webhook Handler
app.post('/api/payment/webhook', async (req, res) => {
    try {
        const payload = req.body;
        console.log('[Webhook] Received PayChangu webhook:', JSON.stringify(payload));

        // Verify webhook signature if secret is configured
        if (WEBHOOK_SECRET) {
            const signature = req.headers['x-paychangu-signature'];
            // TODO: Implement signature verification if PayChangu provides it
            console.log('[Webhook] Signature verification skipped (not implemented)');
        }

        // Extract event data
        const event = payload.event;
        const data = payload.data;

        if (!data || !data.charge_id) {
            console.error('[Webhook] Invalid webhook payload: missing charge_id');
            return res.status(400).json({ error: 'Invalid payload' });
        }

        const chargeId = data.charge_id;
        const status = data.status || event;

        console.log(`[Webhook] Processing event: ${event}, ChargeID: ${chargeId}, Status: ${status}`);

        // Find payment by transactionId (charge_id)
        const [paymentRows] = await db.execute(
            'SELECT * FROM payments WHERE transactionId = ?',
            [chargeId]
        );
        const payments = paymentRows as any[];

        if (payments.length === 0) {
            console.error(`[Webhook] Payment not found for charge_id: ${chargeId}`);
            return res.status(404).json({ error: 'Payment not found' });
        }

        const payment = payments[0];

        if (status === 'successful' || status === 'success' || event === 'charge.successful') {
            // Payment successful - activate token
            console.log(`[Webhook] Payment successful for charge: ${chargeId}`);

            await db.execute(`
                UPDATE payments 
                SET status = 'completed', 
                    gatewayResponse = CONCAT(gatewayResponse, '\nWebhook: ', ?),
                    processedAt = NOW()
                WHERE transactionId = ?
            `, [JSON.stringify(payload), chargeId]);

            // Get the token and activity info
            const [tokenRows] = await db.execute(`
                SELECT t.id, t.activityId, a.capacity, a.currentOccupancy 
                FROM tokens t
                JOIN activities a ON t.activityId = a.id
                WHERE t.paymentId = ? AND t.status = 'pending'
            `, [payment.id]);
            const pendingTokens = tokenRows as any[];

            if (pendingTokens.length > 0) {
                const token = pendingTokens[0];
                const availableSpots = token.capacity - token.currentOccupancy;

                if (availableSpots > 0) {
                    // Capacity available - put in 'ready' state (timer NOT started yet)
                    // Timer starts when staff scans QR or visitor taps it
                    await db.execute(`
                        UPDATE tokens
                        SET status = 'ready'
                        WHERE id = ?
                    `, [token.id]);

                    // Update activity occupancy
                    await db.execute(`
                        UPDATE activities
                        SET currentOccupancy = currentOccupancy + 1
                        WHERE id = ?
                    `, [token.activityId]);

                    console.log(`[Webhook] Token ${token.id} activated (ready state, timer not started)`);
                } else {
                    // No capacity - put in queue
                    await db.execute(`
                        UPDATE tokens
                        SET status = 'queue'
                        WHERE id = ?
                    `, [token.id]);
                    console.log(`[Webhook] Token ${token.id} added to queue`);
                }
            }

            res.json({ received: true, status: 'success' });
        } else if (status === 'failed' || status === 'cancelled' || status === 'declined') {
            // Payment failed
            console.log(`[Webhook] Payment failed for charge: ${chargeId}`);

            await db.execute(`
                UPDATE payments 
                SET status = 'failed', 
                    failedReason = ?,
                    gatewayResponse = CONCAT(gatewayResponse, '\nWebhook: ', ?),
                    processedAt = NOW()
                WHERE transactionId = ?
            `, [status, JSON.stringify(payload), chargeId]);

            // Delete or mark the pending token as cancelled
            await db.execute(`
                UPDATE tokens 
                SET status = 'cancelled'
                WHERE paymentId = ? AND status = 'pending'
            `, [payment.id]);

            res.json({ received: true, status: 'failed' });
        } else {
            // Other status (pending, processing, etc.) - just log
            console.log(`[Webhook] Payment status update for charge ${chargeId}: ${status}`);
            
            await db.execute(`
                UPDATE payments 
                SET gatewayResponse = CONCAT(gatewayResponse, '\nWebhook: ', ?)
                WHERE transactionId = ?
            `, [JSON.stringify(payload), chargeId]);

            res.json({ received: true, status: 'acknowledged' });
        }

    } catch (error) {
        console.error('[Webhook] Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Check payment status (polling endpoint for frontend)
app.get('/api/payment/status/:chargeId', async (req, res) => {
    try {
        const { chargeId } = req.params;
        
        const [paymentRows] = await db.execute(
            'SELECT * FROM payments WHERE transactionId = ?',
            [chargeId]
        );
        const payments = paymentRows as any[];

        if (payments.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const payment = payments[0];

        // If payment is still pending, try to verify with PayChangu
        if (payment.status === 'pending' && PAYCHANGU_SECRET_KEY) {
            try {
                const verification = await verifyPayChanguPayment(chargeId);
                console.log(`[Payment Status] PayChangu verification for ${chargeId}:`, verification);

                const paychanguStatus = verification.data?.status;
                
                if (paychanguStatus === 'successful' || paychanguStatus === 'success') {
                    // Update payment and token status
                    await db.execute(
                        'UPDATE payments SET status = ? WHERE id = ?',
                        ['completed', payment.id]
                    );

                    // Get token and activity info to check capacity
                    const [tokenRows] = await db.execute(`
                        SELECT t.id, t.activityId, a.capacity, a.currentOccupancy
                        FROM tokens t
                        JOIN activities a ON t.activityId = a.id
                        WHERE t.paymentId = ? AND t.status = 'pending'
                    `, [payment.id]);
                    const pendingTokens = tokenRows as any[];

                    if (pendingTokens.length > 0) {
                        const token = pendingTokens[0];
                        const availableSpots = token.capacity - token.currentOccupancy;

                        if (availableSpots > 0) {
                            // Capacity available - put in 'ready' state (timer NOT started yet)
                            await db.execute(
                                "UPDATE tokens SET status = 'ready' WHERE id = ?",
                                [token.id]
                            );
                            // Update activity occupancy
                            await db.execute(
                                "UPDATE activities SET currentOccupancy = currentOccupancy + 1 WHERE id = ?",
                                [token.activityId]
                            );
                        } else {
                            // No capacity - put in queue
                            await db.execute(
                                "UPDATE tokens SET status = 'queue' WHERE id = ?",
                                [token.id]
                            );
                        }
                    }
                    payment.status = 'completed';
                } else if (paychanguStatus === 'failed' || paychanguStatus === 'cancelled') {
                    await db.execute(
                        'UPDATE payments SET status = ?, failedReason = ? WHERE id = ?',
                        ['failed', paychanguStatus, payment.id]
                    );
                    await db.execute(
                        "UPDATE tokens SET status = 'cancelled' WHERE paymentId = ? AND status = 'pending'",
                        [payment.id]
                    );
                    payment.status = 'failed';
                }
            } catch (verifyError) {
                console.error(`[Payment Status] Verification error for ${chargeId}:`, verifyError);
            }
        }

        // Get token info
        const [tokenRows] = await db.execute(
            'SELECT * FROM tokens WHERE paymentId = ?',
            [payment.id]
        );
        const tokens = tokenRows as any[];

        res.json({
            chargeId: chargeId,
            status: payment.status,
            amount: payment.amount,
            createdAt: payment.createdAt,
            token: tokens.length > 0 ? {
                id: tokens[0].id,
                code: tokens[0].code,
                status: tokens[0].status
            } : null
        });

    } catch (error) {
        console.error('[Payment Status] Error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

// Get payment history for admin
app.get('/api/payments', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, u.username, a.name as activityName
            FROM payments p
            JOIN users u ON p.userId = u.id
            JOIN activities a ON p.activityId = a.id
            WHERE p.isActive = 1
            ORDER BY p.createdAt DESC
        `);
        const payments = rows as any[];

        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

/**
 * Admin Dashboard Endpoints
 */

// Get dashboard statistics
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        // Get total revenue (sum of all token payments with actual prices)
        const [revenueRows] = await db.execute(`
            SELECT COUNT(*) as totalTokens, 
                   COUNT(CASE WHEN status = 'completed' THEN 1 END) as completedTokens,
                   COALESCE(SUM(a.price), 0) as totalRevenue
            FROM tokens t
            LEFT JOIN activities a ON t.activityId = a.id
        `) as [any[], any];
        const revenue = revenueRows[0] as any;

        // Get total capacity and current occupancy
        const [capacityRows] = await db.execute(`
            SELECT SUM(capacity) as totalCapacity, 
                   SUM(currentOccupancy) as totalOccupancy
            FROM activities WHERE isActive = 1
        `) as [any[], any];
        const capacity = capacityRows[0] as any;

        // Get active staff count
        const [staffRows] = await db.execute(`
            SELECT COUNT(*) as activeStaff 
            FROM users u 
            JOIN staff s ON u.id = s.userId 
            WHERE s.status = 'active' AND u.isActive = 1 AND s.isActive = 1
        `) as [any[], any];
        const staff = staffRows[0] as any;

        // Last 7 calendar days in server local TZ (CURDATE), oldest → newest; fill gaps with 0
        const [weeklyRows] = await db.execute(`
            SELECT
                DATE_FORMAT(d.dt, '%Y-%m-%d') AS date,
                COALESCE(t.cnt, 0) AS visitors
            FROM (
                SELECT DATE_SUB(CURDATE(), INTERVAL seq DAY) AS dt
                FROM (
                    SELECT 6 AS seq UNION SELECT 5 UNION SELECT 4 UNION SELECT 3
                    UNION SELECT 2 UNION SELECT 1 UNION SELECT 0
                ) AS offsets
            ) d
            LEFT JOIN (
                SELECT DATE(createdAt) AS token_date, COUNT(*) AS cnt
                FROM tokens
                WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                  AND createdAt < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                GROUP BY DATE(createdAt)
            ) t ON t.token_date = d.dt
            ORDER BY d.dt ASC
        `) as [any[], any];

        const weeklyData = (weeklyRows as any[]).map((row) => {
            let dateStr = row.date;
            if (dateStr instanceof Date) {
                dateStr = dateStr.toISOString().split('T')[0];
            } else if (dateStr && typeof dateStr !== 'string') {
                dateStr = String(dateStr);
            }
            return {
                date: dateStr,
                visitors: Number(row.visitors) || 0,
            };
        });

        res.json({
            totalRevenue: Number(revenue.totalRevenue) || 0,
            totalTokens: Number(revenue.totalTokens) || 0,
            completedTokens: Number(revenue.completedTokens) || 0,
            totalCapacity: Number(capacity.totalCapacity) || 0,
            totalOccupancy: Number(capacity.totalOccupancy) || 0,
            activeStaff: Number(staff.activeStaff) || 0,
            weeklyData,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Submit feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { userId, activityId, rating, comment, quickTags } = req.body;

        if (!userId || !activityId || !rating) {
            return res.status(400).json({ error: 'userId, activityId, and rating required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Insert feedback
        const [result] = await db.execute(`
            INSERT INTO feedback (userId, activityId, rating, comment) 
            VALUES (?, ?, ?, ?)
        `, [userId, activityId, rating, comment]);

        // Update activity rating and review count
        await db.execute(`
            UPDATE activities 
            SET rating = (
                SELECT AVG(rating) 
                FROM feedback 
                WHERE activityId = ?
            ),
            reviewCount = (
                SELECT COUNT(*) 
                FROM feedback 
                WHERE activityId = ?
            )
            WHERE id = ?
        `, [activityId, activityId, activityId]);

        res.status(201).json({ 
            message: 'Feedback submitted successfully',
            id: (result as any).insertId
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Export report data for frontend PDF generation
app.get('/api/admin/export-report', async (req, res) => {
    try {
        // Get all tokens with activity and user info
        const [tokenRows] = await db.execute(`
            SELECT t.code, t.status, t.createdAt, t.usedAt,
                   a.name as activity, a.price as amount,
                   u.username as userName
            FROM tokens t
            JOIN activities a ON t.activityId = a.id
            LEFT JOIN users u ON t.userId = u.id
            ORDER BY t.createdAt DESC
        `) as [any[], any];
        const tokens = tokenRows as any[];

        // Get activities summary
        const [activityRows] = await db.execute(`
            SELECT name, capacity, currentOccupancy, rating, reviewCount
            FROM activities WHERE isActive = 1
        `) as [any[], any];
        const activities = activityRows as any[];

        // Get staff summary with zone information
        const [staffRows] = await db.execute(`
            SELECT u.username as name, u.email, u.role, s.status,
                   a.name as zone
            FROM users u 
            JOIN staff s ON u.id = s.userId 
            LEFT JOIN staffActivities sa ON s.id = sa.staffId AND sa.isActive = 1
            LEFT JOIN activities a ON sa.activityId = a.id AND a.isActive = 1
            WHERE u.isActive = 1 AND s.isActive = 1
        `) as [any[], any];
        const staff = staffRows as any[];

        // Calculate total revenue from all tokens
        const totalRevenue = tokens
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        // Return data for frontend PDF generation
        res.json({
            summary: {
                totalTokens: tokens.length,
                completedTokens: tokens.filter(t => t.status === 'completed').length,
                totalRevenue: totalRevenue,
                totalActivities: activities.length,
                totalStaff: staff.length,
                generatedDate: new Date().toLocaleDateString()
            },
            recentTokens: tokens.slice(0, 50), // Limit to recent 50 tokens
            activities,
            staff
        });
        
    } catch (error) {
        console.error('Export report error:', error);
        res.status(500).json({ error: 'Failed to export report' });
    }
});

/**
 * Server Startup
 * 
 * Initializes database connection before starting the server.
 * This ensures database is ready before processing any requests.
 */
async function startServer() {
  const dbConnected = await initializeDatabase();
  
  if (!dbConnected) {
    console.error('Could not start server: database connection failed');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
