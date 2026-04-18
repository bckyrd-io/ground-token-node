-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2026 at 06:52 AM
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
  `type` enum('play','food') NOT NULL DEFAULT 'play',
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
(3, 'Moving cars', 'We keep pushing', 50.00, 2, 1, '/uploads/image-1775895777683-254476469.jpeg', '\"[\\\"Wear shirt\\\"]\"', 4, 2, 1, '2026-04-11 01:22:57.860209', '2026-04-17 21:35:03.476103');

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
(2, 9, 3, 3, 'Good stufx', '2026-04-11 01:18:11.183670'),
(3, 11, 3, 5, '', '2026-04-17 21:35:03.465789');

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
(3, 'PC1775895328128', 9, 3, 50.00, 'MWK', '', '0888302889', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1775895328128\",\"ref_id\":\"53006768099\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":50,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_IH3OsIRWsAi4prCISYSY\",\"status\":\"success\",\"mobile\":\"+265888302889\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-11T15:57:25.000000Z\",\"completed_at\":\"2026-04-11T15:57:25.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"TNM Mpamba\",\"ref_id\":\"27494cb5-ba9e-437f-a114-4e7a7686bcca\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"1.5\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"TNM Mpamba\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-11T15:57:25.000000Z\"},\"logs\":[]}}', '', '2026-04-11 01:15:39', NULL, NULL, NULL, NULL, 1, '2026-04-11 01:15:39.706891', '2026-04-11 01:16:00.981289'),
(4, 'PC1776486871528', 11, 3, 50.00, 'MWK', '', '0885040528', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776486871528\",\"ref_id\":\"35322861705\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":50,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_GgHjTioUAg7lsfd8IvlR\",\"status\":\"success\",\"mobile\":\"+265885040528\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-18T06:01:42.000000Z\",\"completed_at\":\"2026-04-18T06:01:42.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"TNM Mpamba\",\"ref_id\":\"27494cb5-ba9e-437f-a114-4e7a7686bcca\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"1.5\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"TNM Mpamba\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-18T06:01:42.000000Z\"},\"logs\":[]}}', '', '2026-04-17 21:34:36', NULL, NULL, NULL, NULL, 1, '2026-04-17 21:34:36.658131', '2026-04-17 21:34:42.579172');

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
(2, 8, 'STAFF1775895687620', 'active', 1, '2026-04-11 01:21:27.644743', '2026-04-11 01:21:27.644743');

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
(3, 2, 3, '2026-04-11 01:22:57.872811', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `userId` int(11) NOT NULL,
  `activityId` int(11) NOT NULL,
  `paymentId` int(11) DEFAULT NULL,
  `status` enum('pending','queue','in_use','completed','expired','cancelled') NOT NULL DEFAULT 'pending',
  `queueTime` time DEFAULT NULL,
  `qrCode` varchar(100) DEFAULT NULL,
  `usedAt` timestamp NULL DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `code`, `userId`, `activityId`, `paymentId`, `status`, `queueTime`, `qrCode`, `usedAt`, `createdAt`, `updatedAt`) VALUES
(3, 'GT-5T04VSZA0', 9, 3, 3, 'completed', NULL, NULL, '2026-04-11 08:16:02', '2026-04-11 01:15:39.000000', '2026-04-17 21:34:44.491367'),
(4, 'GT-0RSXJQXXB', 11, 3, 4, 'in_use', NULL, NULL, '2026-04-18 04:34:44', '2026-04-17 21:34:36.000000', '2026-04-17 21:34:44.567574');

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
(1, 'admin@gmail.com', 'admin123', 'manager', NULL, 'admin', 1, '0000-00-00 00:00:00.000000', '0000-00-00 00:00:00.000000'),
(8, 'Prince@gelato', '22222222', 'Prince', '0989564646', 'staff', 1, '2026-04-11 01:21:27.636047', '2026-04-11 01:21:27.636047'),
(9, 'GUEST-3W4RSH@guest.gelatokids.com', '', 'GUEST-3W4RSH', '0888302889', 'visitor', 1, '2026-04-11 01:15:28.091183', '2026-04-11 01:15:28.091183'),
(10, 'GUEST-ZA7GTI@guest.gelatokids.com', '', 'GUEST-ZA7GTI', '4567890', 'visitor', 1, '2026-04-17 21:34:11.064361', '2026-04-17 21:34:11.064361'),
(11, 'GUEST-GOV9PO@guest.gelatokids.com', '', 'GUEST-GOV9PO', '0885040528', 'visitor', 1, '2026-04-17 21:34:31.515038', '2026-04-17 21:34:31.515038');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staffactivities`
--
ALTER TABLE `staffactivities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
