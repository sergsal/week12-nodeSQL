CREATE TABLE `products` (
  `ItemID` int(5) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(20) NOT NULL,
  `DepartmentName` varchar(40) DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `StockQuantity` int(6) NOT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
