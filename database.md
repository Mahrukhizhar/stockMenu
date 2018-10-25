
##DATABASE SCHEMA:

1. SERVICE:

CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1

2. CATEGORY:

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `service_id` int(11) NOT NULL,
  `header` varchar(255) NOT NULL,
  `priority` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1 

3. MENU:

CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `event_header` varchar(255) DEFAULT NULL,
  `account_type` varchar(255) DEFAULT NULL,
  `services` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1

4. MENU SERVICE:

CREATE TABLE `menu_service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `service_header` varchar(255) DEFAULT NULL,
  `service_order_in_menu` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1

5. EVENT:

CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1 

6. ITEM:

CREATE TABLE `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `confirm_text_1` varchar(255) NOT NULL,
  `confirm_text_2` varchar(255) NOT NULL,
  `wscode` varchar(255) NOT NULL,
  `priority` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 

## INSERT QUERIES:

INSERT INTO SERVICE VALUES(1,'Compra Bolsas'),(2,'Compra Pacquetes'),(3,'Low Balance Trigger');
INSERT INTO EVENT VALUES(1,'CAE),(2,'CAR'),(3,'CCA'),(4,'CAL'), (5,'SMSR'),(6,'LDB'),(7, 'LMB'), (8,'PULL');
