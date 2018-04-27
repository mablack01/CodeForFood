/*
	Declare the endpoints which the app(backend) has
*/

module.exports = {
	createUser ({ deviceName, deviceID }) {
	console.log(`Device with id: ${deviceID} renamed to: ${deviceName}`)
	
	var dName = String(deviceName);
	var dID = parseInt(deviceID);
	
	mysql = require('mysql');
	
	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "toor",
		database: "Devices"
	});
	
	con.connect(function(err) {
		if (err) throw err;
		con.query("UPDATE Device SET device_name=? WHERE device_id=?;", [dName, dID])
	});
	
	return Promise.resolve()
	}
}
