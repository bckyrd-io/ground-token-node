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
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.get('/api/tokens', async (req, res) => {
    try {
        const { userId } = req.query;
        
        let query = `
            SELECT t.*, a.name as activityName, u.username 
            FROM tokens t 
            JOIN activities a ON t.activityId = a.id 
            JOIN users u ON t.userId = u.id 
        `;
        let params: any[] = [];
        
        // Filter by userId if provided
        if (userId) {
            query += ' WHERE t.userId = ?';
            params.push(userId);
        }
        
        query += ' ORDER BY t.createdAt ASC';
        
        const [rows] = await db.execute(query, params);
        const tokens = rows as any[];

        // Transform to frontend format with computed fields
        const formattedTokens = tokens.map((token, index) => ({
            id: token.id,
            name: token.activityName || 'Unknown',
            code: token.code,
            status: token.status === 'in_use' ? 'ready' : token.status,
            queuePosition: token.status === 'queue' ? `#${index + 1}` : null,
            qrImage: token.qrCode,
            // Include additional fields for capacity control
            username: token.username,
            createdAt: token.createdAt,
            expiresAt: token.expiresAt,
        }));

        res.json(formattedTokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ error: 'Failed to fetch tokens' });
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
        
        const [result] = await db.execute(
            'UPDATE activities SET isCapacityControlOpen = ?, updatedAt = NOW() WHERE id = ?',
            [isOpen, id]
        );
        
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
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
                name, description, price, capacity, currentOccupancy, 
                image, rating, reviewCount, safetyRules, isActive
            ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, 1)
        `, [
            name, description, price, capacity, imagePath, 
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
            price, 
            capacity, 
            rating = 0,
            reviewCount = 0,
            safetyRules = []
        } = req.body || {};

        if (!name || !description || !price || !capacity) {
            console.log('Upload route - Missing fields:', { name, description, price, capacity });
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        console.log('Final image path:', imagePath);

        const [result] = await db.execute(`
            INSERT INTO activities (
                name, description, price, capacity, currentOccupancy, 
                image, rating, reviewCount, safetyRules, isActive
            ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, 1)
        `, [
            name, description, price, capacity, imagePath, 
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

// Simulate payment processing
app.post('/api/payment/process', async (req, res) => {
    try {
        const { phoneNumber, amount, provider, activityId, userId } = req.body;
        console.log(`[Payment] Processing payment: Phone=${phoneNumber}, Amount=${amount}, Provider=${provider}, ActivityID=${activityId}, UserID=${userId || 'guest'}`);

        if (!phoneNumber || !amount || !provider) {
            console.log('[Payment] Failed: Missing payment details');
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate unique transaction ID
        const transactionId = 'PC' + Date.now();
        const gatewayTransactionId = 'GTW' + Math.random().toString(36).substr(2, 12).toUpperCase();
        const paymentId = 'pay_' + Math.random().toString(36).substr(2, 12) + Date.now();

        // For demo purposes, always succeed (PayChangu fake success)
        // In production, this would integrate with real PayChangu API
        const isSuccess = true; // Always success for demo

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
                phoneNumber // Still store phone for payment record, but not as username
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

        const [paymentResult] = await db.execute(`
            INSERT INTO payments (
                transactionId, userId, activityId, amount, currency, 
                provider, phoneNumber, status, gatewayTransactionId, 
                processedAt, gatewayResponse
            ) VALUES (?, ?, ?, ?, 'MWK', ?, ?, 'completed', ?, NOW(), ?)
        `, [
            transactionId, finalUserId, activityId || null, amount, provider, phoneNumber, 
            gatewayTransactionId, JSON.stringify({ status: 'success', message: 'Payment processed successfully' })
        ]);

        if (isSuccess) {
            // Generate a token after successful payment
            const tokenCode = 'GT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            console.log(`[Payment] Payment successful. Token generated: ${tokenCode} for UserID: ${finalUserId}`);
            
            // Store token in database
            const [tokenResult] = await db.execute(`
                INSERT INTO tokens (code, activityId, userId, status, createdAt) 
                VALUES (?, ?, ?, 'pending', NOW())
            `, [tokenCode, activityId, finalUserId]);
            console.log(`[Payment] Token stored in DB: ID=${(tokenResult as any).insertId}`);

            // Build response
            const response: any = {
                success: true,
                message: 'Payment processed successfully via PayChangu',
                transactionId: transactionId,
                provider: 'PayChangu',
                paymentId: (paymentResult as any).insertId,
                token: {
                    id: (tokenResult as any).insertId,
                    code: tokenCode,
                    status: 'pending'
                }
            };

            // Include user data if guest checkout (new or existing user by phone)
            if (guestUser) {
                response.user = guestUser;
                console.log(`[Payment] Returning guest user data: ${guestUser.username}`);
            }

            console.log(`[Payment] Response sent: success=true, PaymentID=${response.paymentId}`);
            res.json(response);
        } else {
            // Update payment status to failed
            console.log(`[Payment] Payment failed for transaction: ${transactionId}`);
            await db.execute(`
                UPDATE payments SET status = 'failed', failedReason = ?, processedAt = NOW()
                WHERE transactionId = ?
            `, ['PayChangu transaction declined', transactionId]);

            res.status(400).json({
                success: false,
                message: 'Payment failed. Please try again.',
                error: 'PayChangu transaction declined',
                transactionId: transactionId
            });
        }
    } catch (error) {
        console.error('[Payment] Error processing payment:', error);
        res.status(500).json({ error: 'PayChangu payment processing failed' });
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
                   COALESCE(SUM(CASE WHEN t.status IN ('completed', 'paid') THEN a.price ELSE 0 END), 0) as totalRevenue
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
                   a.name as activityName, a.price,
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

        // Get staff summary
        const [staffRows] = await db.execute(`
            SELECT u.username, u.email, u.role, s.status
            FROM users u 
            JOIN staff s ON u.id = s.userId 
            WHERE u.isActive = 1 AND s.isActive = 1
        `) as [any[], any];
        const staff = staffRows as any[];

        // Return data for frontend PDF generation
        res.json({
            summary: {
                totalTokens: tokens.length,
                completedTokens: tokens.filter(t => t.status === 'completed').length,
                totalActivities: activities.length,
                totalStaff: staff.length,
                generatedDate: new Date().toLocaleDateString()
            },
            tokens: tokens.slice(0, 50), // Limit to recent 50 tokens
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
