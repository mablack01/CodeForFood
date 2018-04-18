mysql = require('mysql');

var testDB = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "toor",
	database: "Devices"
});

