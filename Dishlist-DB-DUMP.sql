-- --------------------------------------------------------
-- Host:                         ls-d61fa2531874a60d331b43f2fa12d221595f18cc.cd6wqkg8uv4d.eu-central-1.rds.amazonaws.com
-- Server-Version:               8.0.37 - Source distribution
-- Server-Betriebssystem:        Linux
-- HeidiSQL Version:             12.8.0.6908
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
CREATE DATABASE IF NOT EXISTS `dishlist` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_da_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dishlist`;

-- Exportiere Struktur von Tabelle dishlist.rezepte
CREATE TABLE IF NOT EXISTS `rezepte` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bild_url` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  `online_adresse` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  `userid` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.rezepte: ~5 rows (ungefähr)
DELETE FROM `rezepte`;
INSERT INTO `rezepte` (`id`, `bild_url`, `name`, `online_adresse`, `userid`) VALUES
	(8, 'https://bonn-nov24.s3.eu-central-1.amazonaws.com/2b7ac836-f378-4b5e-9bf5-3276cdc89585_cropped-image.jpg', 'sdasd', 'https://asda', '7324b8f2-f051-70a0-d0f6-9f6edda309b4'),
	(21, 'https://bonn-nov24.s3.eu-central-1.amazonaws.com/90f14d3c-6470-461e-bc95-d0d66de12b18_cropped-image.jpg', 'sdfs', 'https://sdf', '7324b8f2-f051-70a0-d0f6-9f6edda309b4'),
	(22, 'https://bonn-nov24.s3.eu-central-1.amazonaws.com/6f1e50e8-c303-445e-a811-454c630e7dac_cropped-image.jpg', 'sfdfsf', 'https://dfs', '7324b8f2-f051-70a0-d0f6-9f6edda309b4'),
	(32, 'https://bonn-nov24.s3.eu-central-1.amazonaws.com/45e54989-3f2e-44b2-bfba-5ba9cbd1960e_cropped-image.jpg', 'asdas', 'https://sdasd', '7324b8f2-f051-70a0-d0f6-9f6edda309b4'),
	(41, 'https://img.spoonacular.com/recipes/716361-312x231.jpg', 'Stir Fried Quinoa, Brown Rice and Chicken Breast', 'https://www.afrolems.com/2014/06/26/stir-fried-quinoa-brown-rice-and-chicken-breast/', '7324b8f2-f051-70a0-d0f6-9f6edda309b4');

-- Exportiere Struktur von Tabelle dishlist.rezept_tags
CREATE TABLE IF NOT EXISTS `rezept_tags` (
  `rezept_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  KEY `FKpqqpeoejgpimroeke3sq7pmnq` (`tag_id`),
  KEY `FKio27juc5hts8ruaulchkcjmns` (`rezept_id`),
  CONSTRAINT `FKio27juc5hts8ruaulchkcjmns` FOREIGN KEY (`rezept_id`) REFERENCES `rezepte` (`id`),
  CONSTRAINT `FKpqqpeoejgpimroeke3sq7pmnq` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.rezept_tags: ~16 rows (ungefähr)
DELETE FROM `rezept_tags`;
INSERT INTO `rezept_tags` (`rezept_id`, `tag_id`) VALUES
	(8, 1),
	(8, 2),
	(8, 3),
	(8, 4),
	(8, 5),
	(8, 6),
	(8, 7),
	(8, 8),
	(8, 9),
	(8, 10),
	(8, 11),
	(8, 12),
	(8, 13),
	(8, 14),
	(8, 15),
	(8, 16);

-- Exportiere Struktur von Tabelle dishlist.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8mb4_da_0900_ai_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_da_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.tags: ~16 rows (ungefähr)
DELETE FROM `tags`;
INSERT INTO `tags` (`id`, `label`, `type`) VALUES
	(1, 'Vorspeise', 'Mahlzeit'),
	(2, 'Hauptgang', 'Mahlzeit'),
	(3, 'Nachtisch', 'Mahlzeit'),
	(4, 'Snack', 'Mahlzeit'),
	(5, 'Chinesisch', 'Landesküche'),
	(6, 'Deutsch', 'Landesküche'),
	(7, 'Indisch', 'Landesküche'),
	(8, 'Italienisch', 'Landesküche'),
	(9, 'Japanisch', 'Landesküche'),
	(10, 'Koreanisch', 'Landesküche'),
	(11, 'Mexikanisch', 'Landesküche'),
	(12, 'ballaststoffreich', 'Nährwert'),
	(13, 'kalorienarm', 'Nährwert'),
	(14, 'kalorienreich', 'Nährwert'),
	(15, 'proteinreich', 'Nährwert'),
	(16, 'zuckerarm', 'Nährwert');

-- Exportiere Struktur von Tabelle dishlist.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_da_0900_ai_ci NOT NULL,
  `enabled` bit(1) NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_da_0900_ai_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_da_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_da_0900_ai_ci;

-- Exportiere Daten aus Tabelle dishlist.users: ~0 rows (ungefähr)
DELETE FROM `users`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
