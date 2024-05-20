-- --------------------------------------------------------
-- Host:                         localhost
-- Server-Version:               8.2.0 - MySQL Community Server - GPL
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank-Struktur für dishlist
DROP DATABASE IF EXISTS `dishlist`;
CREATE DATABASE IF NOT EXISTS `dishlist` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_da_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dishlist`;

-- Exportiere Struktur von Tabelle dishlist.rezepte
DROP TABLE IF EXISTS `rezepte`;
CREATE TABLE IF NOT EXISTS `rezepte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bewertung` int DEFAULT NULL,
  `datum` date DEFAULT NULL,
  `ist_geaendert` bit(1) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  `online_adresse` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.rezepte: ~2 rows (ungefähr)
DELETE FROM `rezepte`;
INSERT INTO `rezepte` (`id`, `bewertung`, `datum`, `ist_geaendert`, `name`, `online_adresse`, `status`) VALUES
	(100, 0, NULL, b'0', 'wurst', 'www.lecker.de', b'0'),
	(103, 0, NULL, b'0', 'Backen', 'www.brezel.de', b'0');

-- Exportiere Struktur von Tabelle dishlist.rezept_tags
DROP TABLE IF EXISTS `rezept_tags`;
CREATE TABLE IF NOT EXISTS `rezept_tags` (
  `rezept_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`rezept_id`,`tag_id`),
  KEY `FKpqqpeoejgpimroeke3sq7pmnq` (`tag_id`),
  CONSTRAINT `FKio27juc5hts8ruaulchkcjmns` FOREIGN KEY (`rezept_id`) REFERENCES `rezepte` (`id`),
  CONSTRAINT `FKpqqpeoejgpimroeke3sq7pmnq` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.rezept_tags: ~0 rows (ungefähr)
DELETE FROM `rezept_tags`;

-- Exportiere Struktur von Tabelle dishlist.tags
DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  `severity` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.tags: ~3 rows (ungefähr)
DELETE FROM `tags`;
INSERT INTO `tags` (`id`, `label`, `severity`) VALUES
	(1, 'Vorspeise', 'info'),
	(2, 'Nachtisch', 'info'),
	(3, 'Hauptgang', 'info');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
