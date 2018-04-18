module.exports = {
  createUser ({ deviceName, deviceID }) {
    //console.log(`Add deviceName ${deviceName} with deviceID ${deviceID}`)
    console.log(`Device with id: ${deviceID} renamed to: ${deviceName}`)

    var dName = String(deviceName);
    var dID = parseInt(deviceID);
    // console.log(dName);
    // console.log(dID);


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
		con.query("SELECT * FROM Device", function (err, result, fields) {
		if (err) throw err;
			console.log("\n");
			console.log("##### Hi I'm the node server, here is the data from the database");
			console.log("\n");
			console.log(result);
		});
	});

    return Promise.resolve()
  }
}


//INSERT INTO Device (device_id, device_name, device_owner) VALUES (dID, dName, 'owner1')

		// con.query('UPDATE Device SET device_name="${dName}" WHERE device_id=1')