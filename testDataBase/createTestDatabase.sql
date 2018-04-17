DROP SCHEMA IF EXISTS `Devices`;

CREATE SCHEMA `Devices` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `Devices`.`Device` (
  `device_id` INT NOT NULL,
  `device_name` VARCHAR(45) NOT NULL,
  `device_owner` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`));

INSERT INTO Devices.Device VALUES
    (0, "device0rename0", "owner0"),
    (1, "device1rename0", "owner1"),
    (2, "device2rename0", "owner2"),
    (3, "device3rename0", "owner3"),
    (4, "device4rename0", "owner4");
