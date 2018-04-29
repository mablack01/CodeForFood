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

var slide1;
var slide2;
var slide3;
var box1;
var box2;
var box3;

app.get('/home', function(req, res){
	var thresholdChange;
	thresholdChange = [
		{
			s1: slide1,
			s2: slide2,
			s3: slide3,
			b1: box1,
			b2: box2,
			b3: box3
		}
	];
	res.render('home', {threshold: thresholdChange});

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

app.get('/settings', function(req, res){
	res.render('settings');
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



app.post('/saveSettings', function(req, res) {
	slide1 = req.body.amountRange;
	slide2 = req.body.amountRange2;
	slide3 = req.body.amountRange3;
	box1 = req.body.alertToggle1;
	box2 = req.body.alertToggle2;
	box3 = req.body.alertToggle3;
	if (box1 === undefined) {box1 = false}
	else {box1 = true}
	if (box2 === undefined) {box2 = false}
	else {box2 = true}
	if (box3 === undefined) {box3 = false}
	else {box3 = true}

	console.log(slide1);
	console.log(slide2);
	console.log(slide3);
	console.log(box1);
	console.log(box2);
	console.log(box3);
	res.redirect('/home');


})



app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})

function updateTextInput(val) {
          document.getElementById('textInput').value=val; 
        }