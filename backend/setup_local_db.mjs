import pg from 'pg';

const rootClient = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

await rootClient.connect();

// Check if postgres_ground_token exists
const checkRes = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = 'postgres_ground_token'");
if (checkRes.rowCount === 0) {
    console.log('Creating database postgres_ground_token...');
    await rootClient.query('CREATE DATABASE postgres_ground_token');
    console.log('✓ Database postgres_ground_token created');
} else {
    console.log('Database postgres_ground_token already exists.');
}
await rootClient.end();

// Connect to postgres_ground_token
const dbClient = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres_ground_token'
});

await dbClient.connect();
console.log('Connected to postgres_ground_token');

const schemaSQL = `
-- Drop existing tables if re-initializing cleanly (safe order)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'visitor',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'play',
    price NUMERIC(10,2) NOT NULL,
    capacity INT NOT NULL,
    "currentOccupancy" INT NOT NULL DEFAULT 0,
    image VARCHAR(255),
    "safetyRules" TEXT,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    "reviewCount" INT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCapacityControlOpen" BOOLEAN NOT NULL DEFAULT true,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT activities_latitude_check CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    CONSTRAINT activities_longitude_check CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
);

CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "staffId" VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "staffActivities" (
    id SERIAL PRIMARY KEY,
    "staffId" INT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    "activityId" INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    "assignedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    "transactionId" VARCHAR(100) UNIQUE NOT NULL,
    "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "activityId" INT REFERENCES activities(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'MWK',
    provider VARCHAR(20) NOT NULL DEFAULT 'paychangu',
    "phoneNumber" VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    "paymentMethod" VARCHAR(50),
    "gatewayResponse" TEXT,
    "gatewayTransactionId" VARCHAR(100),
    "processedAt" TIMESTAMP,
    "failedReason" TEXT,
    "refundAmount" NUMERIC(10,2),
    "refundReason" TEXT,
    "refundedAt" TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "activityId" INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    "paymentId" INT REFERENCES payments(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    "queueTime" TIME,
    "qrCode" VARCHAR(100),
    "usedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "activityId" INT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    rating NUMERIC(3,2) NOT NULL,
    comment TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

await dbClient.query(schemaSQL);
console.log('✓ Tables created successfully');

// Seed Users if empty
const userCount = await dbClient.query('SELECT COUNT(*) as cnt FROM users');
if (parseInt(userCount.rows[0].cnt) === 0) {
    console.log('Seeding initial users...');
    await dbClient.query(`
        INSERT INTO users (id, email, password, username, phone, role, "isActive") VALUES
        (1, 'admin@gmail.com', 'admin123', 'manager', '0888000001', 'admin', true),
        (2, 'staff@gelato.com', 'staff123', 'John Staff', '0888000002', 'staff', true),
        (3, 'waiter@gelato.com', '88888888', 'Waiter', '0888888888', 'staff', true),
        (4, 'visitor@gmail.com', 'visitor123', 'Happy Visitor', '0999000001', 'visitor', true);
        SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
    `);

    // Seed Staff
    await dbClient.query(`
        INSERT INTO staff (id, "userId", "staffId", status, "isActive") VALUES
        (1, 2, 'STAFF-1001', 'active', true),
        (2, 3, 'STAFF-1002', 'active', true);
        SELECT setval('staff_id_seq', (SELECT MAX(id) FROM staff));
    `);

    // Seed Activities
    await dbClient.query(`
        INSERT INTO activities (id, name, description, type, price, capacity, "currentOccupancy", image, "safetyRules", rating, "reviewCount", "isActive", "isCapacityControlOpen", latitude, longitude) VALUES
        (1, 'Jumping Castle', 'Have flipping bouncy fun for all kids', 'play', 300.00, 10, 2, '/uploads/ground1.jpg', '["Wear socks", "No sharp objects"]', 4.5, 8, true, true, -15.7861, 35.0058),
        (2, 'Birthday Cake & Snack Bar', 'Delicious birthday cakes and snacks', 'food', 1500.00, 20, 3, '/uploads/ground2.jpg', '["Follow hygiene rules"]', 4.8, 12, true, true, -15.7863, 35.0060),
        (3, 'Mega Slider', 'Keep falling into infinite fun slides', 'play', 200.00, 8, 1, '/uploads/ground3.jpg', '["One slider at a time", "Feet first"]', 4.2, 5, true, true, -15.7865, 35.0055),
        (4, 'Phada Playground', 'Exciting traditional & modern ground games', 'play', 200.00, 15, 0, '/uploads/ground4.jpg', '["Supervision required", "Play fair"]', 4.0, 3, true, true, -15.7859, 35.0062);
        SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
    `);

    // Assign staff to activities
    await dbClient.query(`
        INSERT INTO "staffActivities" ("staffId", "activityId", "isActive") VALUES
        (1, 1, true),
        (2, 2, true);
    `);

    // Seed sample tokens
    await dbClient.query(`
        INSERT INTO tokens (code, "userId", "activityId", status, "createdAt") VALUES
        ('GT-DEMO1', 4, 1, 'in_use', NOW()),
        ('GT-DEMO2', 4, 3, 'ready', NOW());
    `);

    console.log('✓ Initial seed data populated successfully');
} else {
    console.log('Users table already has data, skipping seed.');
}

// Summary check
const tables = await dbClient.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
console.log('\n--- Postgres Database Setup Summary ---');
console.log('Database: postgres_ground_token');
for (const row of tables.rows) {
    const c = await dbClient.query('SELECT count(*) as cnt FROM "' + row.table_name + '"');
    console.log('  - ' + row.table_name + ': ' + c.rows[0].cnt + ' rows');

}

await dbClient.end();
console.log('--- Setup Complete ---');
