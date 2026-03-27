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
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
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
        const fs = require('fs');
        
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

// Fetch all tokens for user/staff
app.get('/api/tokens', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT t.*, a.name as activityName, u.username 
            FROM tokens t 
            JOIN activities a ON t.activityId = a.id 
            JOIN users u ON t.userId = u.id 
            ORDER BY t.createdAt ASC
        `);
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
                   s.staffId, s.status, u.isActive
            FROM users u 
            JOIN staff s ON u.id = s.userId 
            WHERE u.isActive = 1 AND s.isActive = 1
        `);
        const staff = rows as any[];

        // Transform to frontend format
        const formattedStaff = staff.map(member => ({
            id: member.id,
            name: member.username,
            zone: 'Unassigned', // Will be populated from staffActivities later
            status: member.status === 'active' ? 'Active' :
                   member.status === 'off_duty' ? 'Off-Duty' : 'Inactive',
            image: member.image || 'https://picsum.photos/200',
        }));

        res.json(formattedStaff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// Fetch user profile
app.get('/api/profile', async (req, res) => {
    try {
        // For now, return default profile. In production, use auth token to identify user
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE role = ? AND isActive = 1 LIMIT 1', ['visitor']
        );
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
        
        if (!username || !password) {
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
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        
        // For now, accept any password (implement proper hashing in production)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Additional check for staff users - they must be active in staff table
        if (user.role === 'staff' && (!user.staffId || user.staffStatus !== 'active')) {
            return res.status(401).json({ error: 'Staff account not active' });
        }

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
        console.error('Login error:', error);
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
            // Don't set req.file to undefined here since this is the upload route
            // Let the request continue but handle the error gracefully
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

        if (!username || !email) {
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
        }

        updateQuery += ' WHERE id = ? AND isActive = 1';

        const [result] = await db.execute(updateQuery, updateParams);

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ 
            message: 'User updated successfully',
            user: { id, username, email, phone }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * Payment Simulation Routes
 */

// Simulate payment processing
app.post('/api/payment/process', async (req, res) => {
    try {
        const { phoneNumber, amount, provider, activityId } = req.body;

        if (!phoneNumber || !amount || !provider) {
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

        // Store payment record first
        // For demo, create/get a demo user if needed
        const [userCheck] = await db.execute('SELECT id FROM users WHERE role = ? LIMIT 1', ['visitor']) as any[];
        let userId;
        
        if (userCheck.length === 0) {
            // Create demo user if none exists
            const [newUser] = await db.execute(`
                INSERT INTO users (email, username, password, role) 
                VALUES (?, ?, ?, ?)
            `, ['visitor@gelatokids.com', 'visitor1', 'demo123', 'visitor']);
            userId = (newUser as any).insertId;
        } else {
            // Use existing user ID
            userId = (userCheck[0] as any).id;
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
            transactionId, userId, activityId || null, amount, provider, phoneNumber, 
            gatewayTransactionId, JSON.stringify({ status: 'success', message: 'Payment processed successfully' })
        ]);

        if (isSuccess) {
            // Generate a token after successful payment
            const tokenCode = 'GT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            // Store token in database
            const [tokenResult] = await db.execute(`
                INSERT INTO tokens (code, activityId, userId, status, createdAt) 
                VALUES (?, ?, ?, 'pending', NOW())
            `, [tokenCode, activityId, userId]);

            res.json({
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
            });
        } else {
            // Update payment status to failed
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
        console.error('Payment processing error:', error);
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

        // Get weekly visitor data (last 7 days)
        const [weeklyRows] = await db.execute(`
            SELECT DATE(createdAt) as date, COUNT(*) as visitors
            FROM tokens 
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(createdAt)
            ORDER BY date ASC
        `) as [any[], any];
        
        // Fill missing days with 0 visitors
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = weeklyRows.find((row: any) => row.date === dateStr);
            weeklyData.push({
                date: dateStr,
                visitors: dayData ? dayData.visitors : 0
            });
        }

        res.json({
            totalRevenue: revenue.totalRevenue || 0,
            totalTokens: revenue.totalTokens,
            completedTokens: revenue.completedTokens,
            totalCapacity: capacity.totalCapacity || 0,
            totalOccupancy: capacity.totalOccupancy || 0,
            activeStaff: staff.activeStaff || 0,
            weeklyData: weeklyData
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
