module.exports = {
  createUser ({ deviceName, deviceID }) {
    console.log(`Add deviceName ${deviceName} with deviceID ${deviceID}`)
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
		
		con.query("UPDATE Device SET device_name=? WHERE device_id=?", [dName, dID]);
		//con.query("INSERT INTO Device (device_name, device_id, device_owner) VALUES ('"+dName+"', '"+dID+"', 'kb')")
		
	});

    return Promise.resolve()
  }
}