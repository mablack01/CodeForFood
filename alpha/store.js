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

		con.query("UPDATE Device SET device_name=? WHERE device_id=?", [dName, dID])
	});

    return Promise.resolve()
  },

  authenticate: function({ username, password }) {
  	console.log(`Authenticating user ${username}`)

  	mysql = require('mysql');
  	
  	var con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "toor",
		database: "Devices"
	});
  	var status = 0
	con.connect(function(err){
		if (err) throw err;
		con.query("SELECT user_name, user_password FROM User WHERE user_name=?", [username], function(error, result, field){
			if (error) throw error;
			if (result.length !== 1){
				
			}
			if (result[0].user_password === password){
				console.log("correct")
				return Promise.resolve({success: true});
			}
			else{
				status = 0;
				console.log("false")
				return Promise.resolve({success: false});
			}

		})

	})

  }
}


//INSERT INTO Device (device_id, device_name, device_owner) VALUES (dID, dName, 'owner1')

		// con.query('UPDATE Device SET device_name="${dName}" WHERE device_id=1')
