-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 06:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ground_token`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `capacity` int(11) NOT NULL,
  `currentOccupancy` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `safetyRules` text DEFAULT NULL,
  `rating` float NOT NULL DEFAULT 0,
  `reviewCount` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `name`, `description`, `price`, `capacity`, `currentOccupancy`, `image`, `safetyRules`, `rating`, `reviewCount`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'extend', 'make electronics', 2999.00, 32, 0, NULL, '\"[\\\"make money\\\"]\"', 0, 0, 1, '2026-03-26 09:34:10.633650', '2026-03-26 09:34:10.633650'),
(2, 'slide', 'mre', 300.00, 3, 0, NULL, '\"[\\\"not hot\\\"]\"', 0, 0, 1, '2026-03-26 09:30:18.997528', '2026-03-26 09:30:18.997528'),
(3, 'Bouncing Castle', 'Large inflatable bouncing castle for kids aged 3-12 years. Safety supervised by trained staff.', 5000.00, 25, 18, '/uploads/bouncing-castle.jpg', '[\"No shoes allowed\", \"Maximum 10 children at a time\", \"Adult supervision required\", \"No food or drinks\"]', 4.5, 120, 1, '2024-01-15 08:00:00.000000', '2024-03-27 10:30:00.000000'),
(4, 'Mini Golf Course', '9-hole mini golf course perfect for family fun. Clubs and balls provided.', 3000.00, 30, 22, '/uploads/mini-golf.jpg', '[\"No running\", \"Return all equipment\", \"Follow course order\", \"Adult supervision for under 12\"]', 4.2, 85, 1, '2024-01-16 09:00:00.000000', '2024-03-27 10:30:00.000000'),
(5, 'Trampoline Park', 'Indoor trampoline park with foam pit and basketball hoops. Great for active kids!', 4500.00, 20, 15, '/uploads/trampoline.jpg', '[\"One person per trampoline\", \"No double bouncing\", \"Remove jewelry\", \"Sign waiver required\"]', 4.8, 200, 1, '2024-01-17 10:00:00.000000', '2024-03-27 10:30:00.000000'),
(6, 'Arcade Zone', 'Modern arcade with video games, claw machines, and air hockey. Tokens included.', 2500.00, 40, 28, '/uploads/arcade.jpg', '[\"No outside food\", \"Respect equipment\", \"Staff assistance available\", \"Token system applies\"]', 4, 150, 1, '2024-01-18 11:00:00.000000', '2024-03-27 10:30:00.000000'),
(7, 'Swimming Pool', 'Heated indoor swimming pool with lifeguards on duty. Changing rooms available.', 3500.00, 35, 20, '/uploads/swimming-pool.jpg', '[\"Shower before entering\", \"No running\", \"Swimwear required\", \"Children under 12 need adult\"]', 4.6, 180, 1, '2024-01-19 12:00:00.000000', '2024-03-27 10:30:00.000000'),
(8, 'Climbing Wall', 'Indoor rock climbing wall with various difficulty levels. Equipment provided.', 4000.00, 15, 8, '/uploads/climbing-wall.jpg', '[\"Harness required\", \"Certified instructor supervision\", \"Age 8+ only\", \"No loose clothing\"]', 4.7, 95, 1, '2024-01-20 13:00:00.000000', '2024-03-27 10:30:00.000000'),
(9, 'Playground Area', 'Outdoor playground with swings, slides, and play structures for younger children.', 1500.00, 50, 35, '/uploads/playground.jpg', '[\"Parent supervision required\", \"Age 2-8 recommended\", \"No pets allowed\", \"Playground rules posted\"]', 4.3, 110, 1, '2024-01-21 14:00:00.000000', '2024-03-27 10:30:00.000000'),
(10, 'Arts & Crafts Room', 'Creative space for painting, drawing, and craft activities. Materials included.', 2000.00, 25, 12, '/uploads/arts-crafts.jpg', '[\"Aprons provided\", \"Take creations home\", \"All ages welcome\", \"Staff guided activities\"]', 4.4, 75, 1, '2024-01-22 15:00:00.000000', '2024-03-27 10:30:00.000000'),
(11, 'Bouncing Castle', 'Large inflatable bouncing castle for kids aged 3-12 years. Safety supervised by trained staff.', 5000.00, 25, 18, '/uploads/bouncing-castle.jpg', '[\"No shoes allowed\", \"Maximum 10 children at a time\", \"Adult supervision required\", \"No food or drinks\"]', 4.5, 120, 1, '2024-01-15 08:00:00.000000', '2024-03-27 10:30:00.000000'),
(12, 'Mini Golf Course', '9-hole mini golf course perfect for family fun. Clubs and balls provided.', 3000.00, 30, 22, '/uploads/mini-golf.jpg', '[\"No running\", \"Return all equipment\", \"Follow course order\", \"Adult supervision for under 12\"]', 4.2, 85, 1, '2024-01-16 09:00:00.000000', '2024-03-27 10:30:00.000000'),
(13, 'Trampoline Park', 'Indoor trampoline park with foam pit and basketball hoops. Great for active kids!', 4500.00, 20, 15, '/uploads/trampoline.jpg', '[\"One person per trampoline\", \"No double bouncing\", \"Remove jewelry\", \"Sign waiver required\"]', 4.8, 200, 1, '2024-01-17 10:00:00.000000', '2024-03-27 10:30:00.000000'),
(14, 'Arcade Zone', 'Modern arcade with video games, claw machines, and air hockey. Tokens included.', 2500.00, 40, 28, '/uploads/arcade.jpg', '[\"No outside food\", \"Respect equipment\", \"Staff assistance available\", \"Token system applies\"]', 4, 150, 1, '2024-01-18 11:00:00.000000', '2024-03-27 10:30:00.000000'),
(15, 'Swimming Pool', 'Heated indoor swimming pool with lifeguards on duty. Changing rooms available.', 3500.00, 35, 20, '/uploads/swimming-pool.jpg', '[\"Shower before entering\", \"No running\", \"Swimwear required\", \"Children under 12 need adult\"]', 4.6, 180, 1, '2024-01-19 12:00:00.000000', '2024-03-27 10:30:00.000000'),
(16, 'Climbing Wall', 'Indoor rock climbing wall with various difficulty levels. Equipment provided.', 4000.00, 15, 8, '/uploads/climbing-wall.jpg', '[\"Harness required\", \"Certified instructor supervision\", \"Age 8+ only\", \"No loose clothing\"]', 4.7, 95, 1, '2024-01-20 13:00:00.000000', '2024-03-27 10:30:00.000000'),
(17, 'Playground Area', 'Outdoor playground with swings, slides, and play structures for younger children.', 1500.00, 50, 35, '/uploads/playground.jpg', '[\"Parent supervision required\", \"Age 2-8 recommended\", \"No pets allowed\", \"Playground rules posted\"]', 4.3, 110, 1, '2024-01-21 14:00:00.000000', '2024-03-27 10:30:00.000000'),
(18, 'Arts & Crafts Room', 'Creative space for painting, drawing, and craft activities. Materials included.', 2000.00, 25, 12, '/uploads/arts-crafts.jpg', '[\"Aprons provided\", \"Take creations home\", \"All ages welcome\", \"Staff guided activities\"]', 4.4, 75, 1, '2024-01-22 15:00:00.000000', '2024-03-27 10:30:00.000000'),
(19, 'tryiuo', 'ghfhjkl', 670.00, 90, 0, NULL, '\"[\\\"dont\\\"]\"', 0, 0, 1, '2026-03-27 21:46:43.835249', '2026-03-27 21:46:43.835249'),
(20, 'channel', 'banner and stuff', 3000.00, 2, 0, NULL, '\"[\\\"juk\\\"]\"', 0, 0, 1, '2026-03-29 04:49:11.482846', '2026-03-29 04:49:11.482846'),
(21, 'bad', 'ida', 300.00, 3, 0, NULL, '\"[\\\"who\\\"]\"', 0, 0, 1, '2026-03-29 20:21:01.642405', '2026-03-29 20:21:01.642405'),
(22, 'ninja', 'naruto inspired', 2000.00, 3, 0, NULL, '\"[\\\"muscle\\\"]\"', 0, 0, 1, '2026-03-29 20:56:16.591771', '2026-03-29 20:56:16.591771');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `userId`, `activityId`, `rating`, `comment`, `createdAt`) VALUES
(3, 11, 3, 5, 'Amazing bouncing castle! Kids had so much fun and staff were very attentive.', '2024-03-27 10:00:00.000000'),
(4, 12, 4, 4, 'Great mini golf course. Well maintained and reasonably priced.', '2024-03-27 10:30:00.000000'),
(5, 14, 6, 3, 'Arcade games are good but some machines were out of order.', '2024-03-26 15:00:00.000000'),
(6, 15, 7, 5, 'Clean swimming pool and lifeguards are very professional. Highly recommend!', '2024-03-26 16:00:00.000000'),
(7, 17, 9, 4, 'Playground is safe and fun for younger kids. Good variety of equipment.', '2024-03-25 10:30:00.000000'),
(8, 18, 10, 5, 'Arts and crafts room is fantastic! Staff are creative and patient with children.', '2024-03-25 13:30:00.000000'),
(9, 11, 5, 4, 'Trampoline park is exciting but can get crowded during peak hours.', '2024-03-24 11:00:00.000000'),
(10, 13, 8, 5, 'Climbing wall challenges are great for building confidence. Instructors are excellent!', '2024-03-22 16:15:00.000000');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `transactionId` varchar(100) NOT NULL,
  `userId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'MWK',
  `provider` enum('airtel','tnm_momo','paychangu','other') NOT NULL DEFAULT 'paychangu',
  `phoneNumber` varchar(20) DEFAULT NULL,
  `status` enum('pending','processing','completed','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `paymentMethod` varchar(50) DEFAULT NULL,
  `gatewayResponse` text DEFAULT NULL,
  `gatewayTransactionId` varchar(100) DEFAULT NULL,
  `processedAt` datetime DEFAULT NULL,
  `failedReason` text DEFAULT NULL,
  `refundAmount` decimal(10,2) DEFAULT NULL,
  `refundReason` text DEFAULT NULL,
  `refundedAt` datetime DEFAULT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `transactionId`, `userId`, `activityId`, `amount`, `currency`, `provider`, `phoneNumber`, `status`, `paymentMethod`, `gatewayResponse`, `gatewayTransactionId`, `processedAt`, `failedReason`, `refundAmount`, `refundReason`, `refundedAt`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'PC1774545589525', 3, 1, 2999.00, 'MWK', '', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment processed successfully\"}', 'GTWEGIT2ZGIUK', '2026-03-26 10:19:49', NULL, NULL, NULL, NULL, 1, '2026-03-26 10:19:49.603348', '2026-03-26 10:19:49.603348'),
(2, 'PC1711528800001', 11, 3, 5000.00, 'MWK', 'paychangu', '+265881234574', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW1234567890', '2024-03-27 09:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-27 09:00:00.000000', '2024-03-27 09:00:00.000000'),
(3, 'PC1711528800002', 12, 4, 3000.00, 'MWK', 'airtel', '+265881234575', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW2345678901', '2024-03-27 10:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-27 10:00:00.000000', '2024-03-27 10:00:00.000000'),
(4, 'PC1711528800003', 13, 5, 4500.00, 'MWK', 'tnm_momo', '+265881234576', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW3456789012', '2024-03-27 11:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-27 11:00:00.000000', '2024-03-27 11:00:00.000000'),
(5, 'PC1711442400001', 14, 6, 2500.00, 'MWK', 'paychangu', '+265881234577', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW4567890123', '2024-03-26 14:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-26 14:00:00.000000', '2024-03-26 14:00:00.000000'),
(6, 'PC1711442400002', 15, 7, 3500.00, 'MWK', 'airtel', '+265881234578', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW5678901234', '2024-03-26 15:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-26 15:00:00.000000', '2024-03-26 15:00:00.000000'),
(7, 'PC1711442400003', 16, 8, 4000.00, 'MWK', 'tnm_momo', '+265881234579', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW6789012345', '2024-03-26 16:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-26 16:00:00.000000', '2024-03-26 16:00:00.000000'),
(8, 'PC1711356000001', 17, 9, 1500.00, 'MWK', 'paychangu', '+265881234580', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW7890123456', '2024-03-25 09:30:00', NULL, NULL, NULL, NULL, 1, '2024-03-25 09:30:00.000000', '2024-03-25 09:30:00.000000'),
(9, 'PC1711356000002', 18, 10, 2000.00, 'MWK', 'airtel', '+265881234581', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW8901234567', '2024-03-25 12:30:00', NULL, NULL, NULL, NULL, 1, '2024-03-25 12:30:00.000000', '2024-03-25 12:30:00.000000'),
(10, 'PC1711269600001', 11, 3, 5000.00, 'MWK', 'tnm_momo', '+265881234574', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW9012345678', '2024-03-24 10:00:00', NULL, NULL, NULL, NULL, 1, '2024-03-24 10:00:00.000000', '2024-03-24 10:00:00.000000'),
(11, 'PC1711183200001', 12, 4, 3000.00, 'MWK', 'paychangu', '+265881234575', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW0123456789', '2024-03-23 13:45:00', NULL, NULL, NULL, NULL, 1, '2024-03-23 13:45:00.000000', '2024-03-23 13:45:00.000000'),
(12, 'PC1711096800001', 13, 5, 4500.00, 'MWK', 'airtel', '+265881234576', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW1234567890', '2024-03-22 15:20:00', NULL, NULL, NULL, NULL, 1, '2024-03-22 15:20:00.000000', '2024-03-22 15:20:00.000000'),
(13, 'PC1711010400001', 14, 6, 2500.00, 'MWK', 'tnm_momo', '+265881234577', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW2345678901', '2024-03-21 11:15:00', NULL, NULL, NULL, NULL, 1, '2024-03-21 11:15:00.000000', '2024-03-21 11:15:00.000000'),
(14, 'PC1710924000001', 15, 7, 3500.00, 'MWK', 'paychangu', '+265881234578', 'completed', 'mobile_money', '{\"status\": \"success\", \"message\": \"Payment processed successfully\"}', 'GTW3456789012', '2024-03-20 14:45:00', NULL, NULL, NULL, NULL, 1, '2024-03-20 14:45:00.000000', '2024-03-20 14:45:00.000000'),
(15, 'PC1711528800004', 16, 8, 4000.00, 'MWK', 'airtel', '+265881234579', 'pending', 'mobile_money', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-03-27 12:00:00.000000', '2024-03-27 12:00:00.000000'),
(16, 'PC1711528800005', 17, 9, 1500.00, 'MWK', 'tnm_momo', '+265881234580', 'pending', 'mobile_money', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-03-27 12:30:00.000000', '2024-03-27 12:30:00.000000'),
(32, 'PC1774673302685', 3, 19, 670.00, 'MWK', 'airtel', '88', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment processed successfully\"}', 'GTWNE3NBYPYRWC', '2026-03-27 21:48:22', NULL, NULL, NULL, NULL, 1, '2026-03-27 21:48:22.717774', '2026-03-27 21:48:22.717774'),
(33, 'PC1774783250248', 3, 9, 1500.00, 'MWK', '', '033932', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment processed successfully\"}', 'GTW2A8C4WP026P', '2026-03-29 04:20:50', NULL, NULL, NULL, NULL, 1, '2026-03-29 04:20:50.436379', '2026-03-29 04:20:50.436379');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `staffId` varchar(50) NOT NULL,
  `status` enum('active','off_duty','inactive') NOT NULL DEFAULT 'active',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `userId`, `staffId`, `status`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'STAFF1774542765069', 'active', 1, '2026-03-26 09:32:45.106720', '2026-03-26 09:32:45.106720'),
(2, 6, 'STAFF001', 'active', 1, '2024-02-01 08:30:00.000000', '2024-03-27 10:30:00.000000'),
(3, 7, 'STAFF002', 'active', 1, '2024-02-05 09:15:00.000000', '2024-03-27 10:30:00.000000'),
(4, 8, 'STAFF003', 'off_duty', 1, '2024-02-10 10:00:00.000000', '2024-03-27 10:30:00.000000'),
(5, 9, 'STAFF004', 'active', 1, '2024-02-15 11:30:00.000000', '2024-03-27 10:30:00.000000'),
(6, 10, 'STAFF005', 'inactive', 0, '2024-02-20 12:00:00.000000', '2024-03-27 10:30:00.000000');

-- --------------------------------------------------------

--
-- Table structure for table `staffactivities`
--

CREATE TABLE `staffactivities` (
  `id` int(11) NOT NULL,
  `staffId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `assignedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `isActive` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staffactivities`
--

INSERT INTO `staffactivities` (`id`, `staffId`, `activityId`, `assignedAt`, `isActive`) VALUES
(1, 2, 3, '2024-02-01 08:30:00.000000', 1),
(2, 2, 4, '2024-02-01 08:30:00.000000', 1),
(3, 3, 5, '2024-02-05 09:15:00.000000', 1),
(4, 3, 6, '2024-02-05 09:15:00.000000', 1),
(5, 4, 7, '2024-02-10 10:00:00.000000', 1),
(6, 5, 8, '2024-02-15 11:30:00.000000', 1),
(7, 5, 9, '2024-02-15 11:30:00.000000', 1),
(8, 2, 10, '2024-02-20 12:00:00.000000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `userId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `status` enum('pending','queue','in_use','completed','expired') NOT NULL DEFAULT 'pending',
  `queueTime` time DEFAULT NULL,
  `qrCode` varchar(100) DEFAULT NULL,
  `usedAt` timestamp NULL DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `code`, `userId`, `activityId`, `status`, `queueTime`, `qrCode`, `usedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'GT-4Z1CPUG6X', 3, 1, 'pending', NULL, NULL, NULL, '2026-03-26 10:19:49.000000', '2026-03-26 10:19:49.616851'),
(2, 'GT-ABC123', 11, 3, 'completed', '00:15:00', 'QR_ABC123', '2024-03-27 16:30:00', '2024-03-27 09:00:00.000000', '2024-03-27 09:30:00.000000'),
(3, 'GT-DEF456', 12, 4, 'in_use', '00:10:00', 'QR_DEF456', NULL, '2024-03-27 10:00:00.000000', '2024-03-27 10:00:00.000000'),
(4, 'GT-GHI789', 13, 5, 'queue', '00:20:00', 'QR_GHI789', NULL, '2024-03-27 11:00:00.000000', '2024-03-27 11:00:00.000000'),
(5, 'GT-JKL012', 14, 6, 'completed', '00:25:00', 'QR_JKL012', '2024-03-26 21:30:00', '2024-03-26 14:00:00.000000', '2024-03-26 14:30:00.000000'),
(6, 'GT-MNO345', 15, 7, 'completed', '00:18:00', 'QR_MNO345', '2024-03-26 22:45:00', '2024-03-26 15:00:00.000000', '2024-03-26 15:45:00.000000'),
(7, 'GT-PQR678', 16, 8, 'expired', '00:30:00', 'QR_PQR678', NULL, '2024-03-26 16:00:00.000000', '2024-03-26 16:00:00.000000'),
(8, 'GT-STU901', 17, 9, 'completed', '00:12:00', 'QR_STU901', '2024-03-25 17:15:00', '2024-03-25 09:30:00.000000', '2024-03-25 10:15:00.000000'),
(9, 'GT-VWX234', 18, 10, 'completed', '00:22:00', 'QR_VWX234', '2024-03-25 20:20:00', '2024-03-25 12:30:00.000000', '2024-03-25 13:20:00.000000'),
(10, 'GT-YZA567', 11, 3, 'completed', '00:15:00', 'QR_YZA567', '2024-03-24 18:00:00', '2024-03-24 10:00:00.000000', '2024-03-24 11:00:00.000000'),
(11, 'GT-BCD890', 12, 4, 'completed', '00:20:00', 'QR_BCD890', '2024-03-23 21:30:00', '2024-03-23 13:45:00.000000', '2024-03-23 14:30:00.000000'),
(12, 'GT-EFG123', 13, 5, 'completed', '00:10:00', 'QR_EFG123', '2024-03-22 23:00:00', '2024-03-22 15:20:00.000000', '2024-03-22 16:00:00.000000'),
(13, 'GT-HIJ456', 14, 6, 'completed', '00:25:00', 'QR_HIJ456', '2024-03-21 19:15:00', '2024-03-21 11:15:00.000000', '2024-03-21 12:15:00.000000'),
(14, 'GT-KLM789', 15, 7, 'completed', '00:18:00', 'QR_KLM789', '2024-03-20 22:30:00', '2024-03-20 14:45:00.000000', '2024-03-20 15:30:00.000000'),
(15, 'GT-NOP012', 16, 8, 'pending', '00:15:00', 'QR_NOP012', NULL, '2024-03-27 12:00:00.000000', '2024-03-27 12:00:00.000000'),
(16, 'GT-QRS345', 17, 9, 'queue', '00:20:00', 'QR_QRS345', NULL, '2024-03-27 12:30:00.000000', '2024-03-27 12:30:00.000000'),
(17, 'GT-TUV678', 18, 10, 'in_use', '00:12:00', 'QR_TUV678', NULL, '2024-03-27 13:00:00.000000', '2024-03-27 13:00:00.000000'),
(18, 'GT-WXY901', 11, 3, 'completed', '00:25:00', 'QR_WXY901', '2024-03-27 15:30:00', '2024-03-27 07:45:00.000000', '2024-03-27 08:30:00.000000'),
(19, 'GT-ZAB234', 12, 4, 'pending', '00:18:00', 'QR_ZAB234', NULL, '2024-03-27 13:30:00.000000', '2024-03-27 13:30:00.000000'),
(38, 'GT-6PRR5HIKG', 3, 19, 'pending', NULL, NULL, NULL, '2026-03-27 21:48:22.000000', '2026-03-27 21:48:22.769921'),
(39, 'GT-XDM51YBFV', 3, 9, 'pending', NULL, NULL, NULL, '2026-03-29 04:20:50.000000', '2026-03-29 04:20:50.468001');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('visitor','staff','admin') NOT NULL DEFAULT 'visitor',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `phone`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@gt.com', '12345678', 'admin', '099999999', 'admin', 1, '0000-00-00 00:00:00.000000', '2026-03-27 02:20:30.922152'),
(2, 'jk@nursery.com', '11111111', 'jk', '88888888', 'staff', 1, '2026-03-26 09:32:45.073373', '2026-03-26 09:32:45.073373'),
(3, 'rm@gelatokids.com', '99999999', 'rm', '+26508932919', 'visitor', 1, '2026-03-26 10:19:49.559314', '2026-03-26 09:22:24.343270'),
(5, 'manager@groundtoken.com', 'manager123', 'manager', '+265991234568', 'admin', 1, '2024-01-20 09:00:00.000000', '2024-03-27 10:30:00.000000'),
(6, 'john.staff@groundtoken.com', 'staff123', 'john_staff', '+265991234569', 'staff', 1, '2024-02-01 08:30:00.000000', '2024-03-27 10:30:00.000000'),
(7, 'mary.staff@groundtoken.com', 'staff123', 'mary_staff', '+265991234570', 'staff', 1, '2024-02-05 09:15:00.000000', '2024-03-27 10:30:00.000000'),
(8, 'peter.staff@groundtoken.com', 'staff123', 'peter_staff', '+265991234571', 'staff', 1, '2024-02-10 10:00:00.000000', '2024-03-27 10:30:00.000000'),
(9, 'susan.staff@groundtoken.com', 'staff123', 'susan_staff', '+265991234572', 'staff', 1, '2024-02-15 11:30:00.000000', '2024-03-27 10:30:00.000000'),
(10, 'david.staff@groundtoken.com', 'staff123', 'david_staff', '+265991234573', 'staff', 0, '2024-02-20 12:00:00.000000', '2024-03-27 10:30:00.000000'),
(11, 'alice.visitor@email.com', 'visitor123', 'alice_visitor', '+265881234574', 'visitor', 1, '2024-03-01 14:00:00.000000', '2024-03-27 10:30:00.000000'),
(12, 'bob.visitor@email.com', 'visitor123', 'bob_visitor', '+265881234575', 'visitor', 1, '2024-03-02 15:30:00.000000', '2024-03-27 10:30:00.000000'),
(13, 'carol.visitor@email.com', 'visitor123', 'carol_visitor', '+265881234576', 'visitor', 1, '2024-03-03 16:45:00.000000', '2024-03-27 10:30:00.000000'),
(14, 'daniel.visitor@email.com', 'visitor123', 'daniel_visitor', '+265881234577', 'visitor', 1, '2024-03-04 17:20:00.000000', '2024-03-27 10:30:00.000000'),
(15, 'emma.visitor@email.com', 'visitor123', 'emma_visitor', '+265881234578', 'visitor', 1, '2024-03-05 18:10:00.000000', '2024-03-27 10:30:00.000000'),
(16, 'frank.visitor@email.com', 'visitor123', 'frank_visitor', '+265881234579', 'visitor', 1, '2024-03-06 19:00:00.000000', '2024-03-27 10:30:00.000000'),
(17, 'grace.visitor@email.com', 'visitor123', 'grace_visitor', '+265881234580', 'visitor', 1, '2024-03-07 20:30:00.000000', '2024-03-27 10:30:00.000000'),
(18, 'henry.visitor@email.com', 'visitor123', 'henry_visitor', '+265881234581', 'visitor', 1, '2024-03-08 21:15:00.000000', '2024-03-27 10:30:00.000000'),
(19, 'admin@groundtoken.com', 'admin123', 'admin', '+265991234567', 'admin', 1, '2024-01-15 08:00:00.000000', '2024-03-27 10:30:00.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_feedback_user` (`userId`),
  ADD KEY `FK_feedback_activity` (`activityId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_payments_transactionId` (`transactionId`),
  ADD KEY `FK_payments_user` (`userId`),
  ADD KEY `FK_payments_activity` (`activityId`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_staff_staffId` (`staffId`),
  ADD KEY `FK_staff_user` (`userId`);

--
-- Indexes for table `staffactivities`
--
ALTER TABLE `staffactivities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_staffActivities_staff` (`staffId`),
  ADD KEY `FK_staffActivities_activity` (`activityId`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_token_code` (`code`),
  ADD KEY `FK_token_user` (`userId`),
  ADD KEY `FK_token_activity` (`activityId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `staffactivities`
--
ALTER TABLE `staffactivities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `FK_feedback_activity` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_feedback_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FK_payments_activity` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_payments_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `FK_staff_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staffactivities`
--
ALTER TABLE `staffactivities`
  ADD CONSTRAINT `FK_staffActivities_activity` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_staffActivities_staff` FOREIGN KEY (`staffId`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `FK_token_activity` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_token_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
