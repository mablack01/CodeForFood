var express = require('express')
var bodyParser = require('body-parser')
var DBQuery = require('./DBQuery')
// var device = require('./device')


var app = express()

app.use(express.static('public'));
app.use(bodyParser.json());
app.post('/renameDevice', (req, res) => {
	DBQuery
		.updateDB({
			new_device_name: req.body.device_name,
			dev_id: req.body.device_id
		})
	// device
	// 	.renameDevice({
	// 		device_name: req.body.device_name
	// 	})
	// 	.then( () => res.sendStatus(200))
})


app.listen(3009)