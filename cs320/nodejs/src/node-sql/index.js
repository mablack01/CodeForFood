var express = require('express');
var bodyParser = require('body-parser');

var device = require('./device');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post ('/createDevice', (req, res) => {
	device
		.createDevice ({
			devicename: req.body.devicename
		})
		.then(() => res.sendStatus(200))
});

app.listen(7555, () => {
	console.log("Server running on port 7555\n");
});