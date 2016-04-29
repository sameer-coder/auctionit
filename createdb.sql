CREATE TABLE `current_auction` (
  `bid_id` int(11) NOT NULL AUTO_INCREMENT,
  `seller` varchar(45) NOT NULL,
  `bid` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `item` varchar(45) NOT NULL,
  `start_time` varchar(45) NOT NULL,
  `end_time` varchar(45) NOT NULL,
  PRIMARY KEY (`bid_id`),
  KEY `fk_seller_idx` (`seller`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='User table';


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `coins` int(11) NOT NULL,
  `breads` int(11) NOT NULL,
  `carrots` int(11) NOT NULL,
  `diamonds` int(11) NOT NULL,
  `lastlogin` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8 COMMENT='User table';
