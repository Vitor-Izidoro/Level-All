CREATE DATABASE  IF NOT EXISTS `level_all` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `level_all`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: level_all
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authenticated_user`
--

DROP TABLE IF EXISTS `authenticated_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authenticated_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `original_id` int NOT NULL,
  `original_type` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `data_autenticacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cnpj` (`cnpj`),
  CONSTRAINT `authenticated_user_chk_1` CHECK ((`original_type` in (_utf8mb4'gamer',_utf8mb4'developer',_utf8mb4'investor')))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authenticated_user`
--

LOCK TABLES `authenticated_user` WRITE;
/*!40000 ALTER TABLE `authenticated_user` DISABLE KEYS */;
INSERT INTO `authenticated_user` VALUES (1,2,'investor','mpereira','Mariana Pereira Souza','mariana.pereira@equitygroup.com','eqgroup01','98765432000109','2025-05-21 16:16:10'),(2,1,'investor','calberto','Carlos Alberto Silva','carlos.alberto@finvest.com','finvest2025','12345678000195','2025-05-21 16:16:10'),(3,7,'investor','bsantos','Bruno Santos Oliveira','bruno.santos@finvest.com','finvest123','92837465000155','2025-05-21 16:16:10'),(4,5,'developer','daniel.carvalho','Daniel Carvalho','daniel.carvalho@bytehub.com','byteHub#99',NULL,'2025-05-21 16:16:10'),(5,3,'developer','bruno.ribeiro','Bruno Ribeiro','bruno.ribeiro@techforge.com','forgeTech24',NULL,'2025-05-21 16:16:10'),(6,1,'gamer','shadowwolf01','Luna Silva','luna01@gamemail.com','senha123',NULL,'2025-05-21 16:16:10'),(7,2,'gamer','dragonxblaze','Thiago Rocha','thiagor@gamemail.com','dragao2024',NULL,'2025-05-21 16:16:10'),(8,3,'gamer','vampxqueen','Marina Costa','marinac@gamemail.com','bella4life',NULL,'2025-05-21 16:16:10'),(9,4,'gamer','firebladez','Carlos Mendes','cmendes@gamemail.com','flame321',NULL,'2025-05-21 16:16:10'),(10,5,'gamer','moonfury7','Juliana Dias','julianad@gamemail.com','luzluar',NULL,'2025-05-21 16:16:10');
/*!40000 ALTER TABLE `authenticated_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_user`
--

DROP TABLE IF EXISTS `chat_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_type` enum('developer','gamer','investor') NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_user`
--

LOCK TABLES `chat_user` WRITE;
/*!40000 ALTER TABLE `chat_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `contact_user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `contact_user_id` (`contact_user_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `chat_user` (`id`),
  CONSTRAINT `contacts_ibfk_2` FOREIGN KEY (`contact_user_id`) REFERENCES `chat_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_chat`
--

DROP TABLE IF EXISTS `group_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_chat`
--

LOCK TABLES `group_chat` WRITE;
/*!40000 ALTER TABLE `group_chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_member`
--

DROP TABLE IF EXISTS `group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `chat_user_id` int NOT NULL,
  `adicionado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `eh_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `chat_user_id` (`chat_user_id`),
  CONSTRAINT `group_member_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group_chat` (`id`),
  CONSTRAINT `group_member_ibfk_2` FOREIGN KEY (`chat_user_id`) REFERENCES `chat_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_member`
--

LOCK TABLES `group_member` WRITE;
/*!40000 ALTER TABLE `group_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_message`
--

DROP TABLE IF EXISTS `group_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `chat_user_id` int NOT NULL,
  `mensagem` text NOT NULL,
  `enviada_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `chat_user_id` (`chat_user_id`),
  CONSTRAINT `group_message_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group_chat` (`id`),
  CONSTRAINT `group_message_ibfk_2` FOREIGN KEY (`chat_user_id`) REFERENCES `chat_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_message`
--

LOCK TABLES `group_message` WRITE;
/*!40000 ALTER TABLE `group_message` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contact_id` int NOT NULL,
  `remetente_id` int NOT NULL,
  `destinatario_id` int NOT NULL,
  `conteudo` text NOT NULL,
  `enviada_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contact_id` (`contact_id`),
  KEY `remetente_id` (`remetente_id`),
  KEY `destinatario_id` (`destinatario_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`remetente_id`) REFERENCES `chat_user` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`destinatario_id`) REFERENCES `chat_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `texto` text,
  `imagem` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_admin`
--

DROP TABLE IF EXISTS `user_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_admin` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_admin`
--

LOCK TABLES `user_admin` WRITE;
/*!40000 ALTER TABLE `user_admin` DISABLE KEYS */;
INSERT INTO `user_admin` VALUES (1,'alemsecco','Alex Secco','alexsecco@admin','aleadmin'),(2,'tbeberts','Tarso Bertolini','tarsobertolini@admin','tarsoadmin'),(3,'vitorizidoro','Vitor Izidoro','vitorizidoro@admin','vitoradmin'),(4,'ric_ryu','Ricardo Ryu','ric_ryu@admin','ryuadmin'),(5,'maricastro','Mariana Castro','maricastro@admin','mariadmin');
/*!40000 ALTER TABLE `user_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_developer`
--

DROP TABLE IF EXISTS `user_developer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_developer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_developer`
--

LOCK TABLES `user_developer` WRITE;
/*!40000 ALTER TABLE `user_developer` DISABLE KEYS */;
INSERT INTO `user_developer` VALUES (1,'felipe.souza','Felipe Souza','felipe.souza@devsolutions.com','devPass2025!'),(2,'ana.martins','Ana Martins','ana.martins@codecraft.com','craftCode01'),(3,'bruno.ribeiro','Bruno Ribeiro','bruno.ribeiro@techforge.com','forgeTech24'),(4,'camila.alves','Camila Alves','camila.alves@softworks.com','soft2024dev'),(5,'daniel.carvalho','Daniel Carvalho','daniel.carvalho@bytehub.com','byteHub#99'),(6,'elisa.gomes','Elisa Gomes','elisa.gomes@codemaster.com','masterCode22'),(7,'fabio.melo','Fábio Melo','fabio.melo@innovatek.com','innova2025'),(8,'giovana.lima','Giovana Lima','giovana.lima@devpoint.com','devPoint01'),(9,'henrique.costa','Henrique Costa','henrique.costa@pixelsoft.com','pixelSoft#7'),(10,'isabela.rodrigues','Isabela Rodrigues','isabela.rodrigues@logicmind.com','logicMind24'),(11,'joao.pereira','João Pereira','joao.pereira@codexsolutions.com','codexPass2024'),(12,'karla.tavares','Karla Tavares','karla.tavares@softline.com','softLine!01'),(13,'lucas.martins','Lucas Martins','lucas.martins@techflow.com','techFlow99'),(14,'marina.dias','Marina Dias','marina.dias@devsphere.com','devSphere24'),(15,'nicolas.santos','Nicolas Santos','nicolas.santos@bytecraft.com','byteCraft#05'),(16,'patricia.almeida','Patrícia Almeida','patricia.almeida@codebase.com','codeBase2025'),(17,'rafael.ferreira','Rafael Ferreira','rafael.ferreira@softcore.com','softCore!88'),(18,'sabrina.ramos','Sabrina Ramos','sabrina.ramos@techpulse.com','techPulse#1'),(19,'tiago.silva','Tiago Silva','tiago.silva@innocode.com','innoCode2024'),(20,'victoria.moraes','Victoria Moraes','victoria.moraes@devlink.com','devLink!07');
/*!40000 ALTER TABLE `user_developer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_gamer`
--

DROP TABLE IF EXISTS `user_gamer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_gamer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_gamer`
--

LOCK TABLES `user_gamer` WRITE;
/*!40000 ALTER TABLE `user_gamer` DISABLE KEYS */;
INSERT INTO `user_gamer` VALUES (1,'shadowwolf01','Luna Silva','luna01@gamemail.com','senha123'),(2,'dragonxblaze','Thiago Rocha','thiagor@gamemail.com','dragao2024'),(3,'vampxqueen','Marina Costa','marinac@gamemail.com','bella4life'),(4,'firebladez','Carlos Mendes','cmendes@gamemail.com','flame321'),(5,'moonfury7','Juliana Dias','julianad@gamemail.com','luzluar'),(6,'ghostblade','Pedro Ramos','pedror@gamemail.com','sombra321'),(7,'twilightgirl','Isabela Rocha','isabela@gamemail.com','forks123'),(8,'stormknight','Rafael Lima','rafaell@gamemail.com','chuva2025'),(9,'phantomgamer','Gabriela Nunes','gabynunes@gamemail.com','phantom1'),(10,'icywizard','Felipe Duarte','feliped@gamemail.com','gelado99'),(11,'crimsonfox','Camila Alves','camia@gamemail.com','vermelho12'),(12,'darkrider','João Henrique','joaoh@gamemail.com','motoescura'),(13,'pixelshadow','Renata Martins','renatam@gamemail.com','pixel21'),(14,'silverarrow','Bruno Teixeira','brunot@gamemail.com','flecha8'),(15,'midnightcat','Patrícia Lopes','patlopes@gamemail.com','meianoite'),(16,'gamerqueen23','Letícia Barbosa','letbarbosa@gamemail.com','rainha23'),(17,'xwolfgamer','Lucas Vieira','lucasv@gamemail.com','lobox123'),(18,'sparkhunt','Vanessa Oliveira','vanessaa@gamemail.com','brilho55'),(19,'nightranger','Caio Mendes','caiom@gamemail.com','noite2024'),(20,'ghostfox22','Fernanda Torres','fernan@gamemail.com','fantasma2'),(21,'cyberluna','Luana Silva','luanas@gamemail.com','cyber1'),(22,'mysticrider','Rodrigo Leal','rodrigoleal@gamemail.com','mystic99'),(23,'shadowgal','Natália Pires','natpires@gamemail.com','trevas88'),(24,'frozenhunter','Diego Amaral','diegogamer@gamemail.com','hunter09'),(25,'bloodnova','Clara Sousa','claras@gamemail.com','novavermelha'),(26,'zfireblitz','Marcos Tavares','marcost@gamemail.com','fogo321'),(27,'lucidgamer','Tainá Lima','tainag@gamemail.com','gamer456'),(28,'obsidianlight','Érica Monteiro','ericam@gamemail.com','blacklight'),(29,'stormhowl','Gustavo Faria','gustavof@gamemail.com','uivo2023'),(30,'darksorcerer','Daniel Cunha','danielc@gamemail.com','magonegro'),(31,'nebulafox','Sabrina Antunes','sabriant@gamemail.com','nebula99'),(32,'shadowbyte','André Viana','andrev@gamemail.com','bitsombra'),(33,'frostbitez','Bruna Ferreira','brunafer@gamemail.com','congelado'),(34,'arcangelx','Otávio Luz','otaviol@gamemail.com','anjo33'),(35,'gamerghost','Luciana Torres','lucitorres@gamemail.com','ghostg4m3r'),(36,'wolfpack99','Henrique Moraes','henriquem@gamemail.com','lobos99'),(37,'silentnight','Débora Ribeiro','deborag@gamemail.com','noitesil'),(38,'pixelhunter','Rogério Souza','rogerios@gamemail.com','pixelhunt'),(39,'ravenstorm','Ana Júlia Costa','anajcosta@gamemail.com','tempestade'),(40,'cybermist','Victor Almeida','victora@gamemail.com','nuvem22'),(41,'venomgamer','Ítalo Reis','italor@gamemail.com','veneno12'),(42,'blueember','Melissa Duarte','melduarte@gamemail.com','brasaazul'),(43,'ironhowl','Lívia Castro','liviac@gamemail.com','ferro123'),(44,'twilightnova','Cristina Lima','cristinal@gamemail.com','nova123'),(45,'darknova','Murilo Silva','murilos@gamemail.com','dnova321'),(46,'eclipsegirl','Vitória Dias','vitoriad@gamemail.com','eclipse9'),(47,'sn0wfox','Raquel Ramos','raquelr@gamemail.com','fox2025'),(48,'firelynx','Jonas Barros','jonasb@gamemail.com','lynxfogo'),(49,'phantasmz','Bianca Meireles','biancam@gamemail.com','zfantasma');
/*!40000 ALTER TABLE `user_gamer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_investor`
--

DROP TABLE IF EXISTS `user_investor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_investor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(20) NOT NULL,
  `cnpj` char(14) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `cnpj_UNIQUE` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_investor`
--

LOCK TABLES `user_investor` WRITE;
/*!40000 ALTER TABLE `user_investor` DISABLE KEYS */;
INSERT INTO `user_investor` VALUES (1,'calberto','Carlos Alberto Silva','carlos.alberto@finvest.com','finvest2025','12345678000195'),(2,'mpereira','Mariana Pereira Souza','mariana.pereira@equitygroup.com','eqgroup01','98765432000109'),(3,'rlima','Ricardo Gomes Lima','ricardo.lima@capitalwise.com','cw2024!','56473829000111'),(4,'fcosta','Fernanda Alves Costa','fernanda.costa@trustinvest.com','trust88','19283746000122'),(5,'pdias','Paulo Henrique Dias','paulo.dias@venturehub.com','vh!1234','83746592000133'),(6,'aclara','Ana Clara Martins','ana.clara@alphanvest.com','alpha2025','67584930200144'),(7,'bsantos','Bruno Santos Oliveira','bruno.santos@finvest.com','finvest123','92837465000155'),(8,'jrodrigues','Juliana Rodrigues Almeida','juliana.rodrigues@equitygroup.com','eqg2025!','45678923000166'),(9,'gmelo','Gabriel Melo Ferreira','gabriel.melo@capitalwise.com','cwsecure01','34567289000177'),(10,'pramos','Patrícia Ramos Nunes','patricia.ramos@trustinvest.com','trust2024','87654321000188'),(11,'evieira','Eduardo Vieira Costa','eduardo.vieira@venturehub.com','vhsecure!','23456789000199'),(12,'mtavares','Marcela Tavares Rocha','marcela.tavares@alphanvest.com','alpha2024','19283746500100'),(13,'fcastro','Felipe Castro Lima','felipe.castro@finvest.com','finvest!24','56473829100111'),(14,'cmendes','Carolina Mendes Barros','carolina.mendes@equitygroup.com','eqgroup24','83746592000122'),(15,'rfernandes','Roberto Fernandes Souza','roberto.fernandes@capitalwise.com','cw!pass2025','92837465000133');
/*!40000 ALTER TABLE `user_investor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-02  9:42:40
