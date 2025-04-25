-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 30, 2024 at 05:08 PM
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
-- Database: `geragri_bienes`
--

-- --------------------------------------------------------

--
-- Table structure for table `patrimonizacion`
--

CREATE TABLE `patrimonizacion` (
  `id` int(11) NOT NULL,
  `dni_user` varchar(512) NOT NULL,
  `codigo_patrimonial` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci NOT NULL,
  `Fecha_Registro` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `patrimonizacion`
--
ALTER TABLE `patrimonizacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cst_patrimonizacion` (`codigo_patrimonial`),
  ADD KEY `cst_patrimonizador` (`dni_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `patrimonizacion`
--
ALTER TABLE `patrimonizacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `patrimonizacion`
--
ALTER TABLE `patrimonizacion`
  ADD CONSTRAINT `cst_patrimonizacion` FOREIGN KEY (`codigo_patrimonial`) REFERENCES `item` (`CODIGO_PATRIMONIAL`),
  ADD CONSTRAINT `cst_patrimonizador` FOREIGN KEY (`dni_user`) REFERENCES `user_i` (`dni`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
