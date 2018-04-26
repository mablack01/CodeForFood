	var mysql = require('mysql');
	
	function createConnection() {
		return  mysql.createConnection({
		        host: "localhost",
		        user: "root",
		        password: "toor",
		        database: "Devices"
		 });
	};

	
	module.exports.createConnection = createConnection;