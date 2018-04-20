const express = require('express')
const bodyParser = require('body-parser')

const store = require('./store')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  store
    .createUser({
      deviceName: req.body.deviceName,
      deviceID: req.body.deviceID
    })
    .then(() => res.sendStatus(200))
})

app.get('/showDatabase', function (req, res) {
	var mysql = require('mysql');
	var con = mysql.createConnection({
		        host: "localhost",
		        user: "root",
		        password: "toor",
		        database: "Devices"
	});
	var response;
	con.connect(function(err) {
		        if (err) throw err;
		        con.query("SELECT * FROM Device", function (err, result, fields) {
		            if (err) throw err;
		            console.log("##### Hi I'm the request");
				console.log(result);
				response = result;
				res.json(result);
				        });
	});
})

app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})
