
CREATE TABLE `tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tokens_UN` (`token`),
  KEY `token_FK` (`user_id`),
  CONSTRAINT `token_FK_to_login` FOREIGN KEY (`login_id`) REFERENCES `login` (`login_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2;