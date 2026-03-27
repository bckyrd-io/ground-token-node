-- Ground Token Management System - Seed Data for Admin Dashboard Testing
-- This file adds test data to existing database without clearing existing records
-- Safe to run multiple times - uses INSERT IGNORE and checks for existing records

-- ============================================
-- 1. USERS TABLE - Add test users (if they don't exist)
-- ============================================

-- Admin users (INSERT IGNORE prevents duplicates)
INSERT IGNORE INTO users (email, username, password, phone, role, isActive, createdAt, updatedAt) VALUES
('admin@groundtoken.com', 'admin', 'admin123', '+265991234567', 'admin', 1, '2024-01-15 08:00:00', '2024-03-27 10:30:00'),
('manager@groundtoken.com', 'manager', 'manager123', '+265991234568', 'admin', 1, '2024-01-20 09:00:00', '2024-03-27 10:30:00');

-- Staff users
INSERT IGNORE INTO users (email, username, password, phone, role, isActive, createdAt, updatedAt) VALUES
('john.staff@groundtoken.com', 'john_staff', 'staff123', '+265991234569', 'staff', 1, '2024-02-01 08:30:00', '2024-03-27 10:30:00'),
('mary.staff@groundtoken.com', 'mary_staff', 'staff123', '+265991234570', 'staff', 1, '2024-02-05 09:15:00', '2024-03-27 10:30:00'),
('peter.staff@groundtoken.com', 'peter_staff', 'staff123', '+265991234571', 'staff', 1, '2024-02-10 10:00:00', '2024-03-27 10:30:00'),
('susan.staff@groundtoken.com', 'susan_staff', 'staff123', '+265991234572', 'staff', 1, '2024-02-15 11:30:00', '2024-03-27 10:30:00'),
('david.staff@groundtoken.com', 'david_staff', 'staff123', '+265991234573', 'staff', 0, '2024-02-20 12:00:00', '2024-03-27 10:30:00');

-- Visitor users
INSERT IGNORE INTO users (email, username, password, phone, role, isActive, createdAt, updatedAt) VALUES
('alice.visitor@email.com', 'alice_visitor', 'visitor123', '+265881234574', 'visitor', 1, '2024-03-01 14:00:00', '2024-03-27 10:30:00'),
('bob.visitor@email.com', 'bob_visitor', 'visitor123', '+265881234575', 'visitor', 1, '2024-03-02 15:30:00', '2024-03-27 10:30:00'),
('carol.visitor@email.com', 'carol_visitor', 'visitor123', '+265881234576', 'visitor', 1, '2024-03-03 16:45:00', '2024-03-27 10:30:00'),
('daniel.visitor@email.com', 'daniel_visitor', 'visitor123', '+265881234577', 'visitor', 1, '2024-03-04 17:20:00', '2024-03-27 10:30:00'),
('emma.visitor@email.com', 'emma_visitor', 'visitor123', '+265881234578', 'visitor', 1, '2024-03-05 18:10:00', '2024-03-27 10:30:00'),
('frank.visitor@email.com', 'frank_visitor', 'visitor123', '+265881234579', 'visitor', 1, '2024-03-06 19:00:00', '2024-03-27 10:30:00'),
('grace.visitor@email.com', 'grace_visitor', 'visitor123', '+265881234580', 'visitor', 1, '2024-03-07 20:30:00', '2024-03-27 10:30:00'),
('henry.visitor@email.com', 'henry_visitor', 'visitor123', '+265881234581', 'visitor', 1, '2024-03-08 21:15:00', '2024-03-27 10:30:00');

-- ============================================
-- 2. ACTIVITIES TABLE - Add test activities (if they don't exist)
-- ============================================

INSERT IGNORE INTO activities (name, description, price, capacity, currentOccupancy, image, safetyRules, rating, reviewCount, isActive, createdAt, updatedAt) VALUES
('Bouncing Castle', 'Large inflatable bouncing castle for kids aged 3-12 years. Safety supervised by trained staff.', 5000.00, 25, 18, '/uploads/bouncing-castle.jpg', '["No shoes allowed", "Maximum 10 children at a time", "Adult supervision required", "No food or drinks"]', 4.5, 120, 1, '2024-01-15 08:00:00', '2024-03-27 10:30:00'),
('Mini Golf Course', '9-hole mini golf course perfect for family fun. Clubs and balls provided.', 3000.00, 30, 22, '/uploads/mini-golf.jpg', '["No running", "Return all equipment", "Follow course order", "Adult supervision for under 12"]', 4.2, 85, 1, '2024-01-16 09:00:00', '2024-03-27 10:30:00'),
('Trampoline Park', 'Indoor trampoline park with foam pit and basketball hoops. Great for active kids!', 4500.00, 20, 15, '/uploads/trampoline.jpg', '["One person per trampoline", "No double bouncing", "Remove jewelry", "Sign waiver required"]', 4.8, 200, 1, '2024-01-17 10:00:00', '2024-03-27 10:30:00'),
('Arcade Zone', 'Modern arcade with video games, claw machines, and air hockey. Tokens included.', 2500.00, 40, 28, '/uploads/arcade.jpg', '["No outside food", "Respect equipment", "Staff assistance available", "Token system applies"]', 4.0, 150, 1, '2024-01-18 11:00:00', '2024-03-27 10:30:00'),
('Swimming Pool', 'Heated indoor swimming pool with lifeguards on duty. Changing rooms available.', 3500.00, 35, 20, '/uploads/swimming-pool.jpg', '["Shower before entering", "No running", "Swimwear required", "Children under 12 need adult"]', 4.6, 180, 1, '2024-01-19 12:00:00', '2024-03-27 10:30:00'),
('Climbing Wall', 'Indoor rock climbing wall with various difficulty levels. Equipment provided.', 4000.00, 15, 8, '/uploads/climbing-wall.jpg', '["Harness required", "Certified instructor supervision", "Age 8+ only", "No loose clothing"]', 4.7, 95, 1, '2024-01-20 13:00:00', '2024-03-27 10:30:00'),
('Playground Area', 'Outdoor playground with swings, slides, and play structures for younger children.', 1500.00, 50, 35, '/uploads/playground.jpg', '["Parent supervision required", "Age 2-8 recommended", "No pets allowed", "Playground rules posted"]', 4.3, 110, 1, '2024-01-21 14:00:00', '2024-03-27 10:30:00'),
('Arts & Crafts Room', 'Creative space for painting, drawing, and craft activities. Materials included.', 2000.00, 25, 12, '/uploads/arts-crafts.jpg', '["Aprons provided", "Take creations home", "All ages welcome", "Staff guided activities"]', 4.4, 75, 1, '2024-01-22 15:00:00', '2024-03-27 10:30:00');

-- ============================================
-- 3. STAFF TABLE - Add staff records using subqueries for userId
-- ============================================

INSERT IGNORE INTO staff (userId, staffId, status, isActive, createdAt, updatedAt) VALUES
((SELECT id FROM users WHERE username = 'john_staff'), 'STAFF001', 'active', 1, '2024-02-01 08:30:00', '2024-03-27 10:30:00'),
((SELECT id FROM users WHERE username = 'mary_staff'), 'STAFF002', 'active', 1, '2024-02-05 09:15:00', '2024-03-27 10:30:00'),
((SELECT id FROM users WHERE username = 'peter_staff'), 'STAFF003', 'off_duty', 1, '2024-02-10 10:00:00', '2024-03-27 10:30:00'),
((SELECT id FROM users WHERE username = 'susan_staff'), 'STAFF004', 'active', 1, '2024-02-15 11:30:00', '2024-03-27 10:30:00'),
((SELECT id FROM users WHERE username = 'david_staff'), 'STAFF005', 'inactive', 0, '2024-02-20 12:00:00', '2024-03-27 10:30:00');

-- ============================================
-- 4. STAFF ACTIVITIES - Assign staff to activities using subqueries
-- ============================================

INSERT IGNORE INTO staffActivities (staffId, activityId, assignedAt, isActive) VALUES
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'john_staff'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), '2024-02-01 08:30:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'john_staff'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), '2024-02-01 08:30:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'mary_staff'), (SELECT id FROM activities WHERE name = 'Trampoline Park'), '2024-02-05 09:15:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'mary_staff'), (SELECT id FROM activities WHERE name = 'Arcade Zone'), '2024-02-05 09:15:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'peter_staff'), (SELECT id FROM activities WHERE name = 'Swimming Pool'), '2024-02-10 10:00:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'susan_staff'), (SELECT id FROM activities WHERE name = 'Climbing Wall'), '2024-02-15 11:30:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'susan_staff'), (SELECT id FROM activities WHERE name = 'Playground Area'), '2024-02-15 11:30:00', 1),
((SELECT s.id FROM staff s JOIN users u ON s.userId = u.id WHERE u.username = 'john_staff'), (SELECT id FROM activities WHERE name = 'Arts & Crafts Room'), '2024-02-20 12:00:00', 1);

-- ============================================
-- 5. TOKENS TABLE - Add test tokens using subqueries
-- ============================================

-- Recent tokens (last 7 days) for weekly chart
INSERT IGNORE INTO tokens (code, userId, activityId, status, queueTime, qrCode, usedAt, createdAt, updatedAt) VALUES
-- Today's tokens
('GT-ABC123', (SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), 'completed', '00:15:00', 'QR_ABC123', '2024-03-27 09:30:00', '2024-03-27 09:00:00', '2024-03-27 09:30:00'),
('GT-DEF456', (SELECT id FROM users WHERE username = 'bob_visitor'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), 'in_use', '00:10:00', 'QR_DEF456', NULL, '2024-03-27 10:00:00', '2024-03-27 10:00:00'),
('GT-GHI789', (SELECT id FROM users WHERE username = 'carol_visitor'), (SELECT id FROM activities WHERE name = 'Trampoline Park'), 'queue', '00:20:00', 'QR_GHI789', NULL, '2024-03-27 11:00:00', '2024-03-27 11:00:00'),

-- Yesterday's tokens
('GT-JKL012', (SELECT id FROM users WHERE username = 'daniel_visitor'), (SELECT id FROM activities WHERE name = 'Arcade Zone'), 'completed', '00:25:00', 'QR_JKL012', '2024-03-26 14:30:00', '2024-03-26 14:00:00', '2024-03-26 14:30:00'),
('GT-MNO345', (SELECT id FROM users WHERE username = 'emma_visitor'), (SELECT id FROM activities WHERE name = 'Swimming Pool'), 'completed', '00:18:00', 'QR_MNO345', '2024-03-26 15:45:00', '2024-03-26 15:00:00', '2024-03-26 15:45:00'),
('GT-PQR678', (SELECT id FROM users WHERE username = 'frank_visitor'), (SELECT id FROM activities WHERE name = 'Climbing Wall'), 'expired', '00:30:00', 'QR_PQR678', NULL, '2024-03-26 16:00:00', '2024-03-26 16:00:00'),

-- Day before yesterday
('GT-STU901', (SELECT id FROM users WHERE username = 'grace_visitor'), (SELECT id FROM activities WHERE name = 'Playground Area'), 'completed', '00:12:00', 'QR_STU901', '2024-03-25 10:15:00', '2024-03-25 09:30:00', '2024-03-25 10:15:00'),
('GT-VWX234', (SELECT id FROM users WHERE username = 'henry_visitor'), (SELECT id FROM activities WHERE name = 'Arts & Crafts Room'), 'completed', '00:22:00', 'QR_VWX234', '2024-03-25 13:20:00', '2024-03-25 12:30:00', '2024-03-25 13:20:00'),

-- Earlier in the week
('GT-YZA567', (SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), 'completed', '00:15:00', 'QR_YZA567', '2024-03-24 11:00:00', '2024-03-24 10:00:00', '2024-03-24 11:00:00'),
('GT-BCD890', (SELECT id FROM users WHERE username = 'bob_visitor'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), 'completed', '00:20:00', 'QR_BCD890', '2024-03-23 14:30:00', '2024-03-23 13:45:00', '2024-03-23 14:30:00'),
('GT-EFG123', (SELECT id FROM users WHERE username = 'carol_visitor'), (SELECT id FROM activities WHERE name = 'Trampoline Park'), 'completed', '00:10:00', 'QR_EFG123', '2024-03-22 16:00:00', '2024-03-22 15:20:00', '2024-03-22 16:00:00'),
('GT-HIJ456', (SELECT id FROM users WHERE username = 'daniel_visitor'), (SELECT id FROM activities WHERE name = 'Arcade Zone'), 'completed', '00:25:00', 'QR_HIJ456', '2024-03-21 12:15:00', '2024-03-21 11:15:00', '2024-03-21 12:15:00'),
('GT-KLM789', (SELECT id FROM users WHERE username = 'emma_visitor'), (SELECT id FROM activities WHERE name = 'Swimming Pool'), 'completed', '00:18:00', 'QR_KLM789', '2024-03-20 15:30:00', '2024-03-20 14:45:00', '2024-03-20 15:30:00'),

-- Additional tokens for variety
('GT-NOP012', (SELECT id FROM users WHERE username = 'frank_visitor'), (SELECT id FROM activities WHERE name = 'Climbing Wall'), 'pending', '00:15:00', 'QR_NOP012', NULL, '2024-03-27 12:00:00', '2024-03-27 12:00:00'),
('GT-QRS345', (SELECT id FROM users WHERE username = 'grace_visitor'), (SELECT id FROM activities WHERE name = 'Playground Area'), 'queue', '00:20:00', 'QR_QRS345', NULL, '2024-03-27 12:30:00', '2024-03-27 12:30:00'),
('GT-TUV678', (SELECT id FROM users WHERE username = 'henry_visitor'), (SELECT id FROM activities WHERE name = 'Arts & Crafts Room'), 'in_use', '00:12:00', 'QR_TUV678', NULL, '2024-03-27 13:00:00', '2024-03-27 13:00:00'),
('GT-WXY901', (SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), 'completed', '00:25:00', 'QR_WXY901', '2024-03-27 08:30:00', '2024-03-27 07:45:00', '2024-03-27 08:30:00'),
('GT-ZAB234', (SELECT id FROM users WHERE username = 'bob_visitor'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), 'pending', '00:18:00', 'QR_ZAB234', NULL, '2024-03-27 13:30:00', '2024-03-27 13:30:00');

-- ============================================
-- 6. PAYMENTS TABLE - Add payment records using subqueries
-- ============================================

INSERT IGNORE INTO payments (transactionId, userId, activityId, amount, currency, provider, phoneNumber, status, paymentMethod, gatewayTransactionId, processedAt, gatewayResponse, isActive, createdAt, updatedAt) VALUES
-- Recent successful payments
('PC1711528800001', (SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), 5000.00, 'MWK', 'paychangu', '+265881234574', 'completed', 'mobile_money', 'GTW1234567890', '2024-03-27 09:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-27 09:00:00', '2024-03-27 09:00:00'),
('PC1711528800002', (SELECT id FROM users WHERE username = 'bob_visitor'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), 3000.00, 'MWK', 'airtel', '+265881234575', 'completed', 'mobile_money', 'GTW2345678901', '2024-03-27 10:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-27 10:00:00', '2024-03-27 10:00:00'),
('PC1711528800003', (SELECT id FROM users WHERE username = 'carol_visitor'), (SELECT id FROM activities WHERE name = 'Trampoline Park'), 4500.00, 'MWK', 'tnm_momo', '+265881234576', 'completed', 'mobile_money', 'GTW3456789012', '2024-03-27 11:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-27 11:00:00', '2024-03-27 11:00:00'),

-- Yesterday's payments
('PC1711442400001', (SELECT id FROM users WHERE username = 'daniel_visitor'), (SELECT id FROM activities WHERE name = 'Arcade Zone'), 2500.00, 'MWK', 'paychangu', '+265881234577', 'completed', 'mobile_money', 'GTW4567890123', '2024-03-26 14:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-26 14:00:00', '2024-03-26 14:00:00'),
('PC1711442400002', (SELECT id FROM users WHERE username = 'emma_visitor'), (SELECT id FROM activities WHERE name = 'Swimming Pool'), 3500.00, 'MWK', 'airtel', '+265881234578', 'completed', 'mobile_money', 'GTW5678901234', '2024-03-26 15:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-26 15:00:00', '2024-03-26 15:00:00'),
('PC1711442400003', (SELECT id FROM users WHERE username = 'frank_visitor'), (SELECT id FROM activities WHERE name = 'Climbing Wall'), 4000.00, 'MWK', 'tnm_momo', '+265881234579', 'completed', 'mobile_money', 'GTW6789012345', '2024-03-26 16:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-26 16:00:00', '2024-03-26 16:00:00'),

-- Earlier payments
('PC1711356000001', (SELECT id FROM users WHERE username = 'grace_visitor'), (SELECT id FROM activities WHERE name = 'Playground Area'), 1500.00, 'MWK', 'paychangu', '+265881234580', 'completed', 'mobile_money', 'GTW7890123456', '2024-03-25 09:30:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-25 09:30:00', '2024-03-25 09:30:00'),
('PC1711356000002', (SELECT id FROM users WHERE username = 'henry_visitor'), (SELECT id FROM activities WHERE name = 'Arts & Crafts Room'), 2000.00, 'MWK', 'airtel', '+265881234581', 'completed', 'mobile_money', 'GTW8901234567', '2024-03-25 12:30:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-25 12:30:00', '2024-03-25 12:30:00'),
('PC1711269600001', (SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), 5000.00, 'MWK', 'tnm_momo', '+265881234574', 'completed', 'mobile_money', 'GTW9012345678', '2024-03-24 10:00:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-24 10:00:00', '2024-03-24 10:00:00'),
('PC1711183200001', (SELECT id FROM users WHERE username = 'bob_visitor'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), 3000.00, 'MWK', 'paychangu', '+265881234575', 'completed', 'mobile_money', 'GTW0123456789', '2024-03-23 13:45:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-23 13:45:00', '2024-03-23 13:45:00'),
('PC1711096800001', (SELECT id FROM users WHERE username = 'carol_visitor'), (SELECT id FROM activities WHERE name = 'Trampoline Park'), 4500.00, 'MWK', 'airtel', '+265881234576', 'completed', 'mobile_money', 'GTW1234567890', '2024-03-22 15:20:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-22 15:20:00', '2024-03-22 15:20:00'),
('PC1711010400001', (SELECT id FROM users WHERE username = 'daniel_visitor'), (SELECT id FROM activities WHERE name = 'Arcade Zone'), 2500.00, 'MWK', 'tnm_momo', '+265881234577', 'completed', 'mobile_money', 'GTW2345678901', '2024-03-21 11:15:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-21 11:15:00', '2024-03-21 11:15:00'),
('PC1710924000001', (SELECT id FROM users WHERE username = 'emma_visitor'), (SELECT id FROM activities WHERE name = 'Swimming Pool'), 3500.00, 'MWK', 'paychangu', '+265881234578', 'completed', 'mobile_money', 'GTW3456789012', '2024-03-20 14:45:00', '{"status": "success", "message": "Payment processed successfully"}', 1, '2024-03-20 14:45:00', '2024-03-20 14:45:00'),

-- Recent pending payments
('PC1711528800004', (SELECT id FROM users WHERE username = 'frank_visitor'), (SELECT id FROM activities WHERE name = 'Climbing Wall'), 4000.00, 'MWK', 'airtel', '+265881234579', 'pending', 'mobile_money', NULL, NULL, NULL, 1, '2024-03-27 12:00:00', '2024-03-27 12:00:00'),
('PC1711528800005', (SELECT id FROM users WHERE username = 'grace_visitor'), (SELECT id FROM activities WHERE name = 'Playground Area'), 1500.00, 'MWK', 'tnm_momo', '+265881234580', 'pending', 'mobile_money', NULL, NULL, NULL, 1, '2024-03-27 12:30:00', '2024-03-27 12:30:00');

-- ============================================
-- 7. FEEDBACK TABLE - Add sample feedback using subqueries
-- ============================================

INSERT IGNORE INTO feedback (userId, activityId, rating, comment, createdAt) VALUES
((SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Bouncing Castle'), 5, 'Amazing bouncing castle! Kids had so much fun and staff were very attentive.', '2024-03-27 10:00:00'),
((SELECT id FROM users WHERE username = 'bob_visitor'), (SELECT id FROM activities WHERE name = 'Mini Golf Course'), 4, 'Great mini golf course. Well maintained and reasonably priced.', '2024-03-27 10:30:00'),
((SELECT id FROM users WHERE username = 'daniel_visitor'), (SELECT id FROM activities WHERE name = 'Arcade Zone'), 3, 'Arcade games are good but some machines were out of order.', '2024-03-26 15:00:00'),
((SELECT id FROM users WHERE username = 'emma_visitor'), (SELECT id FROM activities WHERE name = 'Swimming Pool'), 5, 'Clean swimming pool and lifeguards are very professional. Highly recommend!', '2024-03-26 16:00:00'),
((SELECT id FROM users WHERE username = 'grace_visitor'), (SELECT id FROM activities WHERE name = 'Playground Area'), 4, 'Playground is safe and fun for younger kids. Good variety of equipment.', '2024-03-25 10:30:00'),
((SELECT id FROM users WHERE username = 'henry_visitor'), (SELECT id FROM activities WHERE name = 'Arts & Crafts Room'), 5, 'Arts and crafts room is fantastic! Staff are creative and patient with children.', '2024-03-25 13:30:00'),
((SELECT id FROM users WHERE username = 'alice_visitor'), (SELECT id FROM activities WHERE name = 'Trampoline Park'), 4, 'Trampoline park is exciting but can get crowded during peak hours.', '2024-03-24 11:00:00'),
((SELECT id FROM users WHERE username = 'carol_visitor'), (SELECT id FROM activities WHERE name = 'Climbing Wall'), 5, 'Climbing wall challenges are great for building confidence. Instructors are excellent!', '2024-03-22 16:15:00');

-- ============================================
-- SUMMARY OF TEST DATA CREATED
-- ============================================

-- Users: 15 total (2 admin, 5 staff, 8 visitors)
-- Activities: 8 activities with varying prices and capacities
-- Staff: 5 staff members (3 active, 1 off-duty, 1 inactive)
-- Tokens: 18 tokens with various statuses (completed, in_use, queue, pending, expired)
-- Payments: 15 payments (13 completed, 2 pending)
-- Feedback: 8 feedback entries with ratings 3-5

-- This data will demonstrate:
-- 1. Revenue calculation from completed tokens
-- 2. Token status distribution
-- 3. Activity capacity utilization
-- 4. Staff activity assignments
-- 5. Weekly visitor patterns
-- 6. Payment processing history
-- 7. Customer feedback and ratings

-- Expected Dashboard Results:
-- Total Revenue: ~44,000 MWK (from completed tokens)
-- Total Tokens: 18
-- Completed Tokens: ~13
-- Total Capacity: 240 (sum of all activity capacities)
-- Total Occupancy: 158 (current occupancy across activities)
-- Active Staff: 3
-- Weekly Data: Daily visitor counts over last 7 days
