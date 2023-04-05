-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2023 at 02:31 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `truattend_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `imgs_dataset`
--

CREATE TABLE `imgs_dataset` (
  `img_id` int(11) NOT NULL,
  `img_person` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `imgs_dataset`
--

INSERT INTO `imgs_dataset` (`img_id`, `img_person`) VALUES
(1, '101'),
(2, '101'),
(3, '101'),
(4, '101'),
(5, '101'),
(6, '101'),
(7, '101'),
(8, '101'),
(9, '101'),
(10, '101'),
(11, '101'),
(12, '101'),
(13, '101'),
(14, '101'),
(15, '101'),
(16, '101'),
(17, '101'),
(18, '101'),
(19, '101'),
(20, '101'),
(21, '101'),
(22, '101'),
(23, '101'),
(24, '101'),
(25, '101'),
(26, '101'),
(27, '101'),
(28, '101'),
(29, '101'),
(30, '101'),
(31, '101'),
(32, '101'),
(33, '101'),
(34, '101'),
(35, '101'),
(36, '101'),
(37, '101'),
(38, '101'),
(39, '101'),
(40, '101'),
(41, '101'),
(42, '101'),
(43, '101'),
(44, '101'),
(45, '101'),
(46, '101'),
(47, '101'),
(48, '101'),
(49, '101'),
(50, '101'),
(51, '101'),
(52, '101'),
(53, '101'),
(54, '101'),
(55, '101'),
(56, '101'),
(57, '101'),
(58, '101'),
(59, '101'),
(60, '101'),
(61, '101'),
(62, '101'),
(63, '101'),
(64, '101'),
(65, '101'),
(66, '101'),
(67, '101'),
(68, '101'),
(69, '101'),
(70, '101'),
(71, '101'),
(72, '101'),
(73, '101'),
(74, '101'),
(75, '101'),
(76, '101'),
(77, '101'),
(78, '101'),
(79, '101'),
(80, '101'),
(81, '101'),
(82, '101'),
(83, '101'),
(84, '101'),
(85, '101'),
(86, '101'),
(87, '101'),
(88, '101'),
(89, '101'),
(90, '101'),
(91, '101'),
(92, '101'),
(93, '101'),
(94, '101'),
(95, '101'),
(96, '101'),
(97, '101'),
(98, '101'),
(99, '101'),
(100, '101');

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `std_id` varchar(3) NOT NULL,
  `std_name` varchar(50) NOT NULL,
  `std_course` varchar(30) NOT NULL,
  `std_active` varchar(1) NOT NULL DEFAULT 'Y',
  `std_added` datetime NOT NULL DEFAULT current_timestamp(),
  `availability` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`std_id`, `std_name`, `std_course`, `std_active`, `std_added`, `availability`) VALUES
('101', 'Kalana', 'SE', 'Y', '2023-04-05 02:19:39', 'yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `imgs_dataset`
--
ALTER TABLE `imgs_dataset`
  ADD PRIMARY KEY (`img_id`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`std_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
