/* A node server which connects to the mysql database and performs a basic query*/

mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "toor",
	database: "Devices"
});

con.connect(function(err) {
	if (err) throw err;
	con.query("SELECT * FROM Device", function (err, result, fields) {
		if (err) throw err;
		console.log("\n");
		console.log("##### Hi I'm the node server, here is the data from the database:"); 
		console.log("\n");
		console.log(result);
	});
});
