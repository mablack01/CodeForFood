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
		console.log("##### Hi I'm the node server, here is the data from the database");
		console.log("\n");
		console.log(result);
	});
});

http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<h1>HI</h1>');
	res.end('Hello Universe! This is the CS320 project for team Code4Food!');
}).listen(8080);
