--
-- Ground Token -- SANITIZED seed data
--
-- Derived from the development database, then scrubbed. This is the file the
-- deploy step runs (`npm run db:reset`), so it has to stand up a database you
-- can log into and test against -- but it must not carry anything real.
--
-- Removed compared to the development dump:
--   * the two guest accounts created by testing sign-up on a phone
--   * both payments rows, whose gatewayResponse blobs embed PayChangu
--     transaction ids and mobile money references tied to real phone numbers
--   * the uploaded image on activity 5, which points at a file that is not
--     committed and will not exist on a fresh deploy
--
-- Replaced: every phone number, and the visitor account's password.
-- Kept deliberately: the four role accounts and their passwords, because those
-- are the credentials already documented in backend/.env.example and
-- backend/setup_local_db.mjs, so local and deployed behaviour match. They are
-- throwaway test logins, not real accounts.
--
-- To seed a throwaway environment with your own unredacted rows instead:
--   npm run db:migrate -- --data=seed-data.local.sql
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Users
--
INSERT INTO public.users (id, email, password, username, phone, role, "isActive", "createdAt", "updatedAt") VALUES
    (1, 'admin@gmail.com',   'admin123',   'manager',       '0700000001', 'admin',   true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753'),
    (2, 'staff@gelato.com',  'staff123',   'John Staff',    '0700000002', 'staff',   true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753'),
    (3, 'waiter@gelato.com', '88888888',   'Waiter',        '0700000003', 'staff',   true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753'),
    (4, 'visitor@gmail.com', 'visitor123', 'Happy Visitor', '0700000004', 'visitor', true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753');

--
-- Staff
--
INSERT INTO public.staff (id, "userId", "staffId", status, "isActive", "createdAt", "updatedAt") VALUES
    (1, 2, 'STAFF-1001', 'active', true, '2026-09-27 01:29:01.126562', '2026-09-27 01:29:01.126562'),
    (2, 3, 'STAFF-1002', 'active', true, '2026-09-27 01:29:01.126562', '2026-09-27 01:29:01.126562');

--
-- Activities. Images point at backend/uploads/ground1-4.jpg, which ARE
-- committed, so they survive a fresh deploy. Activity 5 deliberately has none.
--
INSERT INTO public.activities (id, name, description, type, price, capacity, "currentOccupancy", image, "safetyRules", rating, "reviewCount", "isActive", "isCapacityControlOpen", latitude, longitude, "createdAt", "updatedAt") VALUES
    (1, 'Jumping Castle',            'Have flipping bouncy fun for all kids',     'play',  300.00, 10, 0, '/uploads/ground1.jpg', '["Wear socks", "No sharp objects"]',      4.50,  8, true, true, -15.7861, 35.0058, '2026-09-27 01:29:01.136559', '2026-09-27 01:29:01.136559'),
    (2, 'Birthday Cake & Snack Bar', 'Delicious birthday cakes and snacks',       'food', 1500.00, 20, 0, '/uploads/ground2.jpg', '["Follow hygiene rules"]',               4.80, 12, true, true, -15.7863, 35.0060, '2026-09-27 01:29:01.136559', '2026-09-27 01:29:01.136559'),
    (3, 'Mega Slider',               'Keep falling into infinite fun slides',     'play',  200.00,  8, 0, '/uploads/ground3.jpg', '["One slider at a time", "Feet first"]', 4.20,  5, true, true, -15.7865, 35.0055, '2026-09-27 01:29:01.136559', '2026-09-27 01:29:01.136559'),
    (4, 'Phada Playground',          'Exciting traditional & modern ground games', 'play',  200.00, 15, 0, '/uploads/ground4.jpg', '["Supervision required", "Play fair"]',   4.00,  3, true, true, -15.7859, 35.0062, '2026-09-27 01:29:01.136559', '2026-10-01 23:36:36.007456'),
    (5, 'board games',               'chess, draft, bawo',                       'play',  500.00,  2, 0, NULL,                 '[]',                                    0.00,  0, true, true, -15.7860, 35.0060, '2026-10-02 01:29:49.910348', '2026-10-02 01:29:49.910348');

--
-- Staff <-> activity assignments
--
INSERT INTO public."staffActivities" (id, "staffId", "activityId", "assignedAt", "isActive") VALUES
    (1, 1, 1, '2026-09-27 01:29:01.144185', true),
    (2, 2, 2, '2026-09-27 01:29:01.144185', true);

--
-- Demo tokens, both owned by the visitor account so nothing dangles.
-- One 'ready' (scan it), one 'in_use' (exercises the play-timer path).
--
INSERT INTO public.tokens (id, code, "userId", "activityId", "paymentId", status, "queueTime", "qrCode", "usedAt", "createdAt", "updatedAt") VALUES
    (1, 'GT-DEMO1', 4, 1, NULL, 'ready',   NULL, NULL, NULL, '2026-09-27 01:29:01.150108', '2026-09-27 01:29:01.150108'),
    (2, 'GT-DEMO2', 4, 3, NULL, 'in_use', NULL, NULL, NULL, '2026-09-27 01:29:01.150108', '2026-09-27 01:29:01.150108');

--
-- Sequence positions. Must run after the inserts, and must match the highest
-- id actually present -- otherwise the first row the app creates collides with
-- a seeded one.
--
SELECT pg_catalog.setval('public.activities_id_seq', (SELECT MAX(id) FROM public.activities));
SELECT pg_catalog.setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
SELECT pg_catalog.setval('public.staff_id_seq', (SELECT MAX(id) FROM public.staff));
SELECT pg_catalog.setval('public."staffActivities_id_seq"', (SELECT MAX(id) FROM public."staffActivities"));
SELECT pg_catalog.setval('public.tokens_id_seq', (SELECT MAX(id) FROM public.tokens));
