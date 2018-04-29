const express = require('express')
const bodyParser = require('body-parser')
const dbconnect = require('./dbconnect.js')



const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));

var userID;

app.get('/', function(req,res){
	res.render('index');
})

app.use(express.static(__dirname + '/views'));

app.get('/home', function(req, res){
	res.render('home');

})

app.get('/settings', function(req, res){
	res.render('settings');
})

app.post('/login', function(req, res) {
	
		var	username = req.body.username,
			password = req.body.password;


		var con = dbconnect.createConnection();


		

		
		con.query("SELECT user_name, user_password, user_ID FROM User WHERE user_name=?", [username], function(error, result, field){
				if (error) throw error;
				if (result.length > 1){
					res.status(401).redirect('/');
				}

				else if (result.length === 0){
					res.status(401).redirect('/');
				}
				
				else if (result[0].user_password === password){
					userID = result[0].user_ID;
					res.redirect('/home');
				}
				else{
					res.redirect('/error');
				}

		})


})

app.post('/logout', function(req, res){
	user_ID = null;
	res.redirect('/');
})

app.get('/error', function(req, res){
	//res.render('error');
	res.redirect('/');
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
