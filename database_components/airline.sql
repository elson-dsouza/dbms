-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 23, 2016 at 04:25 PM
-- Server version: 5.5.53-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `airline`
--

-- --------------------------------------------------------

--
-- Table structure for table `credit_card_details`
--

CREATE TABLE IF NOT EXISTS `credit_card_details` (
  `profile_id` int(11) NOT NULL,
  `card_number` int(11) NOT NULL,
  `card_type` int(11) NOT NULL,
  `expiration_month` int(11) NOT NULL,
  `expiration_year` int(11) NOT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `profile_id` (`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `flight`
--

CREATE TABLE IF NOT EXISTS `flight` (
  `flight_id` varchar(10) NOT NULL,
  `airline_id` int(11) NOT NULL,
  `airline_name` varchar(32) NOT NULL,
  `from_location` varchar(32) NOT NULL,
  `to_location` varchar(32) NOT NULL,
  `departure_time` time NOT NULL,
  `arrvial_time` time NOT NULL,
  `duration` time NOT NULL,
  `total_seats` int(11) NOT NULL,
  PRIMARY KEY (`flight_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`flight_id`, `airline_id`, `airline_name`, `from_location`, `to_location`, `departure_time`, `arrvial_time`, `duration`, `total_seats`) VALUES
('1AIR12123', 112233, 'INDIGO', 'Bangalore', 'Mumbai', '11:33:20', '12:33:20', '01:00:00', 15);

-- --------------------------------------------------------

--
-- Table structure for table `flight_details`
--

CREATE TABLE IF NOT EXISTS `flight_details` (
  `flight_id` varchar(10) NOT NULL,
  `flight_departure_date` datetime NOT NULL,
  `price` int(11) NOT NULL,
  `available_seats` int(11) NOT NULL,
  PRIMARY KEY (`flight_departure_date`,`flight_id`),
  KEY `flight_id` (`flight_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE IF NOT EXISTS `location` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(32) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `passenger_profile`
--

CREATE TABLE IF NOT EXISTS `passenger_profile` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(32) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `address` text NOT NULL,
  `tel_no` varchar(13) NOT NULL,
  `email_id` text NOT NULL,
  PRIMARY KEY (`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_info`
--

CREATE TABLE IF NOT EXISTS `ticket_info` (
  `ticket_id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL,
  `flight_id` varchar(10) NOT NULL,
  `flight_departure_date` datetime NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `flight_id` (`flight_id`),
  KEY `profile_id` (`profile_id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `flight_departure_date` (`flight_departure_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `credit_card_details`
--
ALTER TABLE `credit_card_details`
  ADD CONSTRAINT `profile_id` FOREIGN KEY (`profile_id`) REFERENCES `passenger_profile` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `flight_details`
--
ALTER TABLE `flight_details`
  ADD CONSTRAINT `flight_id` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket_info`
--
ALTER TABLE `ticket_info`
  ADD CONSTRAINT `ticket_info_ibfk_2` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`flight_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flight_departure_date` FOREIGN KEY (`flight_departure_date`) REFERENCES `flight_details` (`flight_departure_date`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_info_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `passenger_profile` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
