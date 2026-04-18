-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2026 at 11:32 PM
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
  `isCapacityControlOpen` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `name`, `description`, `type`, `price`, `capacity`, `currentOccupancy`, `image`, `safetyRules`, `rating`, `reviewCount`, `isActive`, `isCapacityControlOpen`, `createdAt`, `updatedAt`) VALUES
(3, 'Jumping Castle', 'have fliping fun', 'play', 300.00, 2, 0, '/uploads/image-1775895777683-254476469.jpeg', '\"[\\\"Wear shirt\\\"]\"', 3.5, 4, 1, 0, '2026-04-11 01:22:57.860209', '2026-04-18 15:04:06.363298'),
(4, 'Cake', 'For birthday ', 'food', 30000.00, 1, 1, '/uploads/image-1776546799306-173967524.jpeg', '\"[\\\"\\\"]\"', 3.66667, 3, 1, 1, '2026-04-18 14:13:19.350626', '2026-04-18 15:00:24.614214'),
(5, 'Slider', 'Keep falling to the infinite ', 'play', 200.00, 5, 1, '/uploads/image-1776547203985-877093909.jpeg', '\"[\\\"One after another\\\"]\"', 0, 0, 1, 1, '2026-04-18 14:20:04.083324', '2026-04-18 14:27:19.753578'),
(6, 'Phada', 'Kusewera pa ground ', 'play', 200.00, 2, 0, '/uploads/image-1776548551967-948667390.jpeg', '\"[\\\"Don\'t fall\\\"]\"', 4, 1, 1, 1, '2026-04-18 14:42:32.787467', '2026-04-18 14:26:01.000000');

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
(4, 16, 4, 5, '', '2026-04-18 14:25:21.822250'),
(5, 16, 3, 5, '', '2026-04-18 14:29:33.151718'),
(6, 16, 4, 2, '', '2026-04-18 14:30:10.035423'),
(7, 21, 3, 3, '', '2026-04-18 14:58:12.861216'),
(8, 24, 3, 4, 'Equipment ', '2026-04-18 14:23:20.831767'),
(9, 27, 3, 2, '', '2026-04-18 14:40:53.343768'),
(10, 27, 4, 4, '', '2026-04-18 15:00:24.599114'),
(11, 37, 6, 4, '', '2026-04-18 14:24:56.617706');

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
(7, 'PC1776547481328', 16, 4, 30000.00, 'MWK', '', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547481328\",\"ref_id\":\"70484575789\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":30000,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_8fhy4yIWtmnbmMW3Y4r9\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T07:10:32.000000Z\",\"completed_at\":\"2026-04-19T07:10:32.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"TNM Mpamba\",\"ref_id\":\"27494cb5-ba9e-437f-a114-4e7a7686bcca\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"900\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"TNM Mpamba\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T07:10:32.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:24:46', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:24:46.800646', '2026-04-18 14:24:52.853490'),
(8, 'PC1776547690988', 16, 3, 300.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547690988\",\"ref_id\":\"75014615049\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_711TUMNFjk6Hm2pZbLVU\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T07:14:01.000000Z\",\"completed_at\":\"2026-04-19T07:14:01.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T07:14:01.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:28:16', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:28:16.597893', '2026-04-18 14:28:22.848857'),
(9, 'PC1776547994155', 17, 3, 300.00, 'MWK', '', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547994155\",\"ref_id\":\"10283420425\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_S8fWikvjhUgxte4oniQB\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T07:19:05.000000Z\",\"completed_at\":\"2026-04-19T07:19:05.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"TNM Mpamba\",\"ref_id\":\"27494cb5-ba9e-437f-a114-4e7a7686bcca\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"TNM Mpamba\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T07:19:05.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:33:19', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:33:19.766672', '2026-04-18 14:33:25.796494'),
(10, 'PC1776548096888', 18, 3, 300.00, 'MWK', 'airtel', '0966666666', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776548096888\",\"ref_id\":\"34513533172\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_QNN7Pd1z2FomaPVaQsxR\",\"status\":\"success\",\"mobile\":\"+265966666666\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T07:20:47.000000Z\",\"completed_at\":\"2026-04-19T07:20:47.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T07:20:47.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:35:02', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:35:02.180741', '2026-04-18 14:35:08.435978'),
(11, 'PC1776548481909', 20, 3, 300.00, 'MWK', '', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776548481909\",\"ref_id\":\"99724094414\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_Ut3Ev3GtkkGe1UjSIMSw\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:15:21.000000Z\",\"completed_at\":\"2026-04-19T08:15:21.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"TNM Mpamba\",\"ref_id\":\"27494cb5-ba9e-437f-a114-4e7a7686bcca\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"TNM Mpamba\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:15:21.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:41:27', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:41:27.692028', '2026-04-18 14:41:33.660590'),
(12, 'PC1776549451368', 21, 3, 300.00, 'MWK', '', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776549451368\",\"ref_id\":\"84799535123\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_KXmcr5ICyhLIhV9r5UZ7\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:31:31.000000Z\",\"completed_at\":\"2026-04-19T08:31:31.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"TNM Mpamba\",\"ref_id\":\"27494cb5-ba9e-437f-a114-4e7a7686bcca\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"TNM Mpamba\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:31:31.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:57:37', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:57:37.762298', '2026-04-18 14:57:43.738225'),
(13, 'PC1776549524491', 21, 3, 300.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776549524491\",\"ref_id\":\"58907303546\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_Y8iTt0sEiRF7NUenmvih\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:32:43.000000Z\",\"completed_at\":\"2026-04-19T08:32:43.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:32:43.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:58:50', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:58:50.125835', '2026-04-18 14:58:56.204769'),
(14, 'PC1776549585759', 21, 3, 300.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776549585759\",\"ref_id\":\"68309896959\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_VUXGBXEirR3KrKnAODLw\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:33:45.000000Z\",\"completed_at\":\"2026-04-19T08:33:45.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:33:45.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:59:51', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:59:51.490742', '2026-04-18 14:59:57.476336'),
(15, 'PC1776550250118', 23, 3, 300.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776550250118\",\"ref_id\":\"41002071669\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_qTq03IpGz1IiX3w9E3IZ\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:44:49.000000Z\",\"completed_at\":\"2026-04-19T08:44:49.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:44:49.000000Z\"},\"logs\":[]}}', '', '2026-04-18 15:10:55', NULL, NULL, NULL, NULL, 1, '2026-04-18 15:10:55.431230', '2026-04-18 15:11:01.716942'),
(16, 'PC1776547202544', 24, 3, 300.00, 'MWK', 'airtel', '0999865832', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547202544\",\"ref_id\":\"54414137417\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_9VYxEhjJmZOIDgbz5VHI\",\"status\":\"success\",\"mobile\":\"+265999865832\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:54:02.000000Z\",\"completed_at\":\"2026-04-19T08:54:02.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:54:02.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:20:08', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:20:08.764541', '2026-04-18 14:20:14.832086'),
(17, 'PC1776547249036', 24, 3, 300.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547249036\",\"ref_id\":\"25241480635\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_d1k995aMuatyxOXNQB8v\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:54:48.000000Z\",\"completed_at\":\"2026-04-19T08:54:48.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:54:48.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:20:54', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:20:54.751974', '2026-04-18 14:21:00.736602'),
(18, 'PC1776547532207', 26, 3, 300.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547532207\",\"ref_id\":\"28176756781\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_VtOpGwJfenatDPvnOdCY\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T08:59:35.000000Z\",\"completed_at\":\"2026-04-19T08:59:35.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T08:59:35.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:25:42', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:25:42.196316', '2026-04-18 14:25:49.081283'),
(19, 'PC1776547718383', 8, 3, 300.00, 'MWK', 'airtel', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547718383\",\"ref_id\":\"87840655345\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_oveu6ahMDkdnMO7SGYrW\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T09:02:37.000000Z\",\"completed_at\":\"2026-04-19T09:02:37.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T09:02:37.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:28:43', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:28:43.945590', '2026-04-18 14:28:50.160898'),
(20, 'PC1776547887235', 27, 3, 300.00, 'MWK', 'airtel', '0555555555', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547887235\",\"ref_id\":\"94276975234\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_2LwIi1SGFa7FKIxP3fVV\",\"status\":\"success\",\"mobile\":\"+265555555555\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T09:05:29.000000Z\",\"completed_at\":\"2026-04-19T09:05:29.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T09:05:29.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:31:34', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:31:34.964226', '2026-04-18 14:31:42.191054'),
(21, 'PC1776549636314', 28, 3, 300.00, 'MWK', 'airtel', '0333333333', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776549636314\",\"ref_id\":\"72480301074\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_MaYgS8GroYPyj9vAIhud\",\"status\":\"success\",\"mobile\":\"+265333333333\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T09:34:36.000000Z\",\"completed_at\":\"2026-04-19T09:34:36.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T09:34:36.000000Z\"},\"logs\":[]}}', '', '2026-04-18 15:00:42', NULL, NULL, NULL, NULL, 1, '2026-04-18 15:00:42.076944', '2026-04-18 15:00:49.223451'),
(22, 'PC1776549717449', 30, 3, 300.00, 'MWK', 'airtel', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776549717449\",\"ref_id\":\"40565949866\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":300,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_wU04ZVoQpEONVsVuAaOk\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T09:35:56.000000Z\",\"completed_at\":\"2026-04-19T09:35:56.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"9\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T09:35:56.000000Z\"},\"logs\":[]}}', '', '2026-04-18 15:02:02', NULL, NULL, NULL, NULL, 1, '2026-04-18 15:02:02.630204', '2026-04-18 15:02:08.915687'),
(23, 'PC1776549603344', 27, 4, 30000.00, 'MWK', 'airtel', '0666666666', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776549603344\",\"ref_id\":\"38009418959\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":30000,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_7WYOoCyTWF1xHxQLy5XJ\",\"status\":\"success\",\"mobile\":\"+265666666666\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T10:34:03.000000Z\",\"completed_at\":\"2026-04-19T10:34:03.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"900\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T10:34:03.000000Z\"},\"logs\":[]}}', '', '2026-04-18 15:00:09', NULL, NULL, NULL, NULL, 1, '2026-04-18 15:00:09.112069', '2026-04-18 15:00:15.602105'),
(24, 'PC1776547610587', 34, 5, 200.00, 'MWK', 'airtel', '0888888888', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547610587\",\"ref_id\":\"32613171904\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":200,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_1IVsc9qEAZLeSOnMnWM6\",\"status\":\"success\",\"mobile\":\"+265888888888\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T11:01:03.000000Z\",\"completed_at\":\"2026-04-19T11:01:03.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"6\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T11:01:03.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:27:09', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:27:09.567740', '2026-04-18 14:27:17.189599'),
(25, 'PC1776548691088', 36, 6, 200.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776548691088\",\"ref_id\":\"64378193646\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":200,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_2f7E1fQWDfdGAaeOtWwz\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T11:18:51.000000Z\",\"completed_at\":\"2026-04-19T11:18:51.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"6\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T11:18:51.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:44:56', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:44:56.996759', '2026-04-18 14:45:04.305150'),
(26, 'PC1776547431643', 37, 6, 200.00, 'MWK', 'airtel', '0999999999', 'completed', NULL, '{\"status\":\"success\",\"message\":\"Payment initiated successfully.\",\"data\":{\"charge_id\":\"PC1776547431643\",\"ref_id\":\"72207496903\",\"trans_id\":null,\"currency\":\"MK\",\"amount\":200,\"first_name\":null,\"last_name\":null,\"email\":null,\"type\":\"Direct API Payment\",\"trace_id\":\"trx_vs0OJg4swEqXxCim0pa4\",\"status\":\"success\",\"mobile\":\"+265999999999\",\"attempts\":1,\"mode\":\"sandbox\",\"created_at\":\"2026-04-19T12:55:02.000000Z\",\"completed_at\":\"2026-04-19T12:55:02.000000Z\",\"event_type\":\"api.charge.payment\",\"payment_method\":\"mobile_money\",\"mobile_money\":{\"name\":\"Airtel Money\",\"ref_id\":\"20be6c20-adeb-4b5b-a7ba-0769820df4fb\",\"country\":\"Malawi\"},\"transaction_charges\":{\"currency\":\"MK\",\"amount\":\"6\"},\"other_fees\":[],\"customer\":null,\"authorization\":{\"channel\":\"Mobile Money\",\"card_number\":null,\"expiry\":null,\"brand\":null,\"provider\":\"Airtel Money\",\"mobile_number\":null,\"mobile_money_trans_id\":null,\"payer_bank_uuid\":null,\"payer_bank\":null,\"payer_account_number\":null,\"payer_account_name\":null,\"payer_bank_receipt_number\":null,\"virtual_bank_account_credited\":null,\"completed_at\":\"2026-04-19T12:55:02.000000Z\"},\"logs\":[]}}', '', '2026-04-18 14:23:57', NULL, NULL, NULL, NULL, 1, '2026-04-18 14:23:57.365702', '2026-04-18 14:24:04.393906');

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
(2, 8, 'STAFF1775895687620', 'active', 1, '2026-04-11 01:21:27.644743', '2026-04-11 01:21:27.644743'),
(3, 12, 'STAFF1776550064632', 'active', 1, '2026-04-18 15:07:44.658323', '2026-04-18 15:07:44.658323'),
(4, 35, 'STAFF1776548441656', 'active', 1, '2026-04-18 14:40:41.670729', '2026-04-18 14:40:41.670729');

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
(3, 2, 3, '2026-04-11 01:22:57.872811', 1),
(4, 3, 4, '2026-04-18 14:13:19.369176', 1),
(5, 2, 5, '2026-04-18 14:20:04.156513', 1),
(6, 4, 6, '2026-04-18 14:42:32.799471', 1);

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
(20, 'GT-5GIGSDLY3', 27, 3, 20, 'expired', NULL, NULL, '2026-04-18 21:35:13', '2026-04-18 14:31:34.000000', '2026-04-18 15:03:10.094546'),
(21, 'GT-5MGYH8UNZ', 28, 3, 21, 'expired', NULL, NULL, '2026-04-18 22:00:52', '2026-04-18 15:00:42.000000', '2026-04-18 15:03:10.094546'),
(22, 'GT-EC2VRE9WS', 30, 3, 22, 'expired', NULL, NULL, '2026-04-18 22:03:10', '2026-04-18 15:02:02.000000', '2026-04-18 15:04:06.358293'),
(23, 'GT-C7D1N7YO0', 27, 4, 23, 'in_use', NULL, NULL, '2026-04-18 22:00:18', '2026-04-18 15:00:09.000000', '2026-04-18 15:00:18.039318'),
(24, 'GT-IYYZ91N70', 34, 5, 24, 'in_use', NULL, NULL, '2026-04-18 21:27:19', '2026-04-18 14:27:09.000000', '2026-04-18 14:27:19.748007'),
(25, 'GT-85KAZPFPT', 36, 6, 25, 'expired', NULL, NULL, '2026-04-18 21:45:06', '2026-04-18 14:44:57.000000', '2026-04-18 14:25:58.098876'),
(26, 'GT-J8XXLHUPV', 37, 6, 26, 'completed', NULL, NULL, '2026-04-18 21:24:06', '2026-04-18 14:23:57.000000', '2026-04-18 14:25:04.239642');

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
(8, 'max@gelato', '33333333', 'max', '0333333333', 'staff', 1, '2026-04-11 01:21:27.636047', '2026-04-18 14:29:54.000000'),
(9, 'GUEST-3W4RSH@guest.gelatokids.com', '', 'GUEST-3W4RSH', '0888302889', 'visitor', 1, '2026-04-11 01:15:28.091183', '2026-04-11 01:15:28.091183'),
(10, 'GUEST-ZA7GTI@guest.gelatokids.com', '', 'GUEST-ZA7GTI', '4567890', 'visitor', 1, '2026-04-17 21:34:11.064361', '2026-04-17 21:34:11.064361'),
(11, 'GUEST-GOV9PO@guest.gelatokids.com', '', 'GUEST-GOV9PO', '0885040528', 'visitor', 1, '2026-04-17 21:34:31.515038', '2026-04-17 21:34:31.515038'),
(12, 'waiter@gelato.com', '88888888', 'Waiter ', '0888888888', 'staff', 1, '2026-04-18 15:07:44.647416', '2026-04-18 15:07:44.647416'),
(13, 'GUEST-O9WKAB@guest.gelatokids.com', '', 'GUEST-O9WKAB', '0888302889', 'visitor', 1, '2026-04-18 14:28:52.138154', '2026-04-18 14:28:52.138154'),
(14, 'GUEST-X30RQD@guest.gelatokids.com', '', 'GUEST-X30RQD', '0888302889', 'visitor', 1, '2026-04-18 14:34:38.800734', '2026-04-18 14:34:38.800734'),
(15, 'GUEST-L00BI7@guest.gelatokids.com', '', 'GUEST-L00BI7', '088888888', 'visitor', 1, '2026-04-18 14:24:22.149187', '2026-04-18 14:24:22.149187'),
(16, 'GUEST-C7WN1T@guest.gelatokids.com', '', 'GUEST-C7WN1T', '0888888888', 'visitor', 1, '2026-04-18 14:24:41.314101', '2026-04-18 14:24:41.314101'),
(17, 'GUEST-LYBW32@guest.gelatokids.com', '', 'GUEST-LYBW32', '0888888888', 'visitor', 1, '2026-04-18 14:33:14.151459', '2026-04-18 14:33:14.151459'),
(18, 'GUEST-KETIWB@guest.gelatokids.com', '', 'GUEST-KETIWB', '0966666666', 'visitor', 1, '2026-04-18 14:34:56.884226', '2026-04-18 14:34:56.884226'),
(19, 'GUEST-E19G25@guest.gelatokids.com', '', 'GUEST-E19G25', '08888888', 'visitor', 1, '2026-04-18 14:40:56.068288', '2026-04-18 14:40:56.068288'),
(20, 'GUEST-PBOCIM@guest.gelatokids.com', '', 'GUEST-PBOCIM', '0888888888', 'visitor', 1, '2026-04-18 14:41:21.897700', '2026-04-18 14:41:21.897700'),
(21, 'GUEST-MDDM78@guest.gelatokids.com', '', 'GUEST-MDDM78', '0888888888', 'visitor', 1, '2026-04-18 14:57:31.334886', '2026-04-18 14:57:31.334886'),
(22, 'GUEST-EWFDL5@guest.gelatokids.com', '', 'GUEST-EWFDL5', '099999999', 'visitor', 1, '2026-04-18 15:10:30.619153', '2026-04-18 15:10:30.619153'),
(23, 'GUEST-18ABHV@guest.gelatokids.com', '', 'GUEST-18ABHV', '0999999999', 'visitor', 1, '2026-04-18 15:10:50.111975', '2026-04-18 15:10:50.111975'),
(24, 'GUEST-HBFT1C@guest.gelatokids.com', '', 'GUEST-HBFT1C', '0999865832', 'visitor', 1, '2026-04-18 14:20:02.510214', '2026-04-18 14:20:02.510214'),
(25, 'GUEST-2U3VLN@guest.gelatokids.com', '', 'GUEST-2U3VLN', '09999999999', 'visitor', 1, '2026-04-18 14:25:23.564491', '2026-04-18 14:25:23.564491'),
(26, 'GUEST-47WHHR@guest.gelatokids.com', '', 'GUEST-47WHHR', '0999999999', 'visitor', 1, '2026-04-18 14:25:32.202610', '2026-04-18 14:25:32.202610'),
(27, 'sup@guest.gelatokids.com', '55555555', 'sup', '0555555555', 'visitor', 1, '2026-04-18 14:31:27.229618', '2026-04-18 14:32:22.000000'),
(28, 'GUEST-LPXVQ1@guest.gelatokids.com', '', 'GUEST-LPXVQ1', '0333333333', 'visitor', 1, '2026-04-18 15:00:36.304442', '2026-04-18 15:00:36.304442'),
(29, 'GUEST-97ZBGO@guest.gelatokids.com', '', 'GUEST-97ZBGO', '088888888', 'visitor', 1, '2026-04-18 15:01:45.621593', '2026-04-18 15:01:45.621593'),
(30, 'GUEST-TGUB7F@guest.gelatokids.com', '88888888', 'acc', '0888888888', 'visitor', 1, '2026-04-18 15:01:57.446258', '2026-04-18 15:02:39.000000'),
(31, 'GUEST-CLGPSW@guest.gelatokids.com', '', 'GUEST-CLGPSW', '044444444', 'visitor', 1, '2026-04-18 14:24:39.681663', '2026-04-18 14:24:39.681663'),
(32, 'GUEST-F3FFB4@guest.gelatokids.com', '', 'GUEST-F3FFB4', '0444444444', 'visitor', 1, '2026-04-18 14:24:57.906824', '2026-04-18 14:24:57.906824'),
(33, 'GUEST-73APDJ@guest.gelatokids.com', '', 'GUEST-73APDJ', '0888888888', 'visitor', 1, '2026-04-18 14:25:18.220573', '2026-04-18 14:25:18.220573'),
(34, 'GUEST-46IOO6@guest.gelatokids.com', '', 'GUEST-46IOO6', '0888888888', 'visitor', 1, '2026-04-18 14:26:50.580023', '2026-04-18 14:26:50.580023'),
(35, 'Ol@g.mail', '00000000', 'Olo', '088888888', 'staff', 1, '2026-04-18 14:40:41.659304', '2026-04-18 14:40:41.659304'),
(36, 'GUEST-O9EII9@guest.gelatokids.com', '', 'GUEST-O9EII9', '0999999999', 'visitor', 1, '2026-04-18 14:44:51.073429', '2026-04-18 14:44:51.073429'),
(37, 'GUEST-GGYD9X@guest.gelatokids.com', '', 'GUEST-GGYD9X', '0999999999', 'visitor', 1, '2026-04-18 14:23:51.630418', '2026-04-18 14:23:51.630418');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staffactivities`
--
ALTER TABLE `staffactivities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
