--
-- PostgreSQL database dump
--


-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.activities VALUES (3, 'Mega Slider', 'Keep falling into infinite fun slides', 'play', 200.00, 8, 0, '/uploads/ground3.jpg', '["One slider at a time", "Feet first"]', 4.20, 5, true, true, -15.7865, 35.0055, '2026-09-27 01:29:01.136559', '2026-09-27 01:29:01.136559');
INSERT INTO public.activities VALUES (4, 'Phada Playground', 'Exciting traditional & modern ground games', 'play', 200.00, 15, 1, '/uploads/ground4.jpg', '["Supervision required", "Play fair"]', 4.00, 3, false, true, -15.7859, 35.0062, '2026-09-27 01:29:01.136559', '2026-10-01 23:36:36.007456');
INSERT INTO public.activities VALUES (2, 'Birthday Cake & Snack Bar', 'Delicious birthday cakes and snacks', 'food', 1500.00, 20, 0, '/uploads/ground2.jpg', '["Follow hygiene rules"]', 4.80, 12, true, true, -15.7863, 35.006, '2026-09-27 01:29:01.136559', '2026-09-27 01:29:01.136559');
INSERT INTO public.activities VALUES (1, 'Jumping Castle', 'Have flipping bouncy fun for all kids', 'play', 300.00, 10, 1, '/uploads/ground1.jpg', '["Wear socks", "No sharp objects"]', 4.50, 8, true, true, -15.7861, 35.0058, '2026-09-27 01:29:01.136559', '2026-09-27 01:29:01.136559');
INSERT INTO public.activities VALUES (5, 'board games', 'chess, draft, bawo ', 'play', 500.00, 2, 0, '/uploads/image-1790929789712-40746453.jpeg', '"[\"\"]"', 0.00, 0, true, true, -90, 98, '2026-10-02 01:29:49.910348', '2026-10-02 01:29:49.910348');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'admin@gmail.com', 'admin123', 'manager', '0888000001', 'admin', true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753');
INSERT INTO public.users VALUES (2, 'staff@gelato.com', 'staff123', 'John Staff', '0888000002', 'staff', true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753');
INSERT INTO public.users VALUES (3, 'waiter@gelato.com', '88888888', 'Waiter', '0888888888', 'staff', true, '2026-09-27 01:29:01.11753', '2026-09-27 01:29:01.11753');
INSERT INTO public.users VALUES (4, 'visitor@gmail.com', '11111111', 'Hanna', '0999000001', 'visitor', true, '2026-09-27 01:29:01.11753', '2026-10-01 23:30:06.210284');
INSERT INTO public.users VALUES (6, 'GUEST-X8IM1B@guest.example.com', '0000', 'Max', '0888544350', 'visitor', true, '2026-10-01 22:22:54.78262', '2026-10-01 23:14:42.546972');
INSERT INTO public.users VALUES (5, 'GUEST-GBQGTK@guest.example.com', '2222', 'Ninj', '0885040528', 'visitor', true, '2026-10-01 01:04:39.383843', '2026-10-01 01:05:59.387711');


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments VALUES (1, 'PC1790841879425', 5, 4, 200.00, 'MWK', 'airtel', '0885040528', 'completed', NULL, '{"status":"success","message":"Payment initiated successfully.","data":{"charge_id":"PC1790841879425","ref_id":"22877667467","trans_id":null,"currency":"MK","amount":200,"first_name":null,"last_name":null,"email":null,"type":"Direct API Payment","trace_id":"trx_2xHXkM0WGJ9D349fEqyf","status":"success","mobile":"+265885040528","attempts":1,"mode":"sandbox","created_at":"2026-10-01T08:04:44.000000Z","completed_at":"2026-10-01T08:04:44.000000Z","event_type":"api.charge.payment","payment_method":"mobile_money","mobile_money":{"name":"Airtel Money","ref_id":"20be6c20-adeb-4b5b-a7ba-0769820df4fb","country":"Malawi"},"transaction_charges":{"currency":"MK","amount":"6"},"other_fees":[],"customer":null,"authorization":{"channel":"Mobile Money","card_number":null,"expiry":null,"brand":null,"provider":"Airtel Money","mobile_number":"+265885040528","mobile_money_trans_id":null,"payer_bank_uuid":null,"payer_bank":null,"payer_account_number":null,"payer_account_name":null,"payer_bank_receipt_number":null,"virtual_bank_account_credited":null,"completed_at":"2026-10-01T08:04:44.000000Z"},"logs":[{"type":"log","message":"Attempted to pay with mobile money","created_at":"2026-10-01T08:04:44.000000Z"}],"customer_full_name":null}}', '', '2026-10-01 01:04:44.302553', NULL, NULL, NULL, NULL, true, '2026-10-01 01:04:44.302553', '2026-10-01 01:04:44.302553');
INSERT INTO public.payments VALUES (2, 'PC1790918574789', 6, 1, 300.00, 'MWK', 'tnm', '0888544350', 'completed', NULL, '{"status":"success","message":"Payment initiated successfully.","data":{"charge_id":"PC1790918574789","ref_id":"42252886162","trans_id":null,"currency":"MK","amount":300,"first_name":null,"last_name":null,"email":null,"type":"Direct API Payment","trace_id":"trx_GKc8ynZXST7Lxo6rTAk7","status":"success","mobile":"+265888544350","attempts":1,"mode":"sandbox","created_at":"2026-10-02T05:22:57.000000Z","completed_at":"2026-10-02T05:22:57.000000Z","event_type":"api.charge.payment","payment_method":"mobile_money","mobile_money":{"name":"TNM Mpamba","ref_id":"27494cb5-ba9e-437f-a114-4e7a7686bcca","country":"Malawi"},"transaction_charges":{"currency":"MK","amount":"9"},"other_fees":[],"customer":null,"authorization":{"channel":"Mobile Money","card_number":null,"expiry":null,"brand":null,"provider":"TNM Mpamba","mobile_number":"+265888544350","mobile_money_trans_id":null,"payer_bank_uuid":null,"payer_bank":null,"payer_account_number":null,"payer_account_name":null,"payer_bank_receipt_number":null,"virtual_bank_account_credited":null,"completed_at":"2026-10-02T05:22:57.000000Z"},"logs":[{"type":"log","message":"Attempted to pay with mobile money","created_at":"2026-10-02T05:22:57.000000Z"}],"customer_full_name":null}}', '', '2026-10-01 22:22:58.492469', NULL, NULL, NULL, NULL, true, '2026-10-01 22:22:58.492469', '2026-10-01 22:22:58.492469');


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.staff VALUES (1, 2, 'STAFF-1001', 'active', true, '2026-09-27 01:29:01.126562', '2026-09-27 01:29:01.126562');
INSERT INTO public.staff VALUES (2, 3, 'STAFF-1002', 'active', true, '2026-09-27 01:29:01.126562', '2026-09-27 01:29:01.126562');


--
-- Data for Name: staffActivities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."staffActivities" VALUES (1, 1, 1, '2026-09-27 01:29:01.144185', true);
INSERT INTO public."staffActivities" VALUES (2, 2, 2, '2026-09-27 01:29:01.144185', true);


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tokens VALUES (1, 'GT-DEMO1', 4, 1, NULL, 'in_use', NULL, NULL, NULL, '2026-09-27 01:29:01.150108', '2026-09-27 01:29:01.150108');
INSERT INTO public.tokens VALUES (3, 'GT-565I7P23G', 5, 4, 1, 'ready', NULL, NULL, NULL, '2026-10-01 01:04:44.336522', '2026-10-01 01:04:44.336522');
INSERT INTO public.tokens VALUES (4, 'GT-RLITMNMAO', 6, 1, 2, 'completed', NULL, NULL, '2026-10-01 22:23:17.544455', '2026-10-01 22:22:58.528403', '2026-10-01 22:22:58.528403');
INSERT INTO public.tokens VALUES (2, 'GT-DEMO2', 4, 3, NULL, 'completed', NULL, NULL, '2026-10-01 23:29:15.636924', '2026-09-27 01:29:01.150108', '2026-09-27 01:29:01.150108');


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activities_id_seq', 5, true);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.feedback_id_seq', 1, false);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 2, true);


--
-- Name: staffActivities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."staffActivities_id_seq"', 2, true);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.staff_id_seq', 2, true);


--
-- Name: tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tokens_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--


