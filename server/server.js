const express = require('express')
const bodyParser = require('body-parser')
const dbconnect = require('./dbconnect.js')
const flash = require('express-flash')
const session = require('express-session');
const cookieParser = require('cookie-parser')


const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + '/views'));


app.use(session({
	key: 'user_sid',
	secret: 'code4food',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000 
	}
}));

app.use(function(req, res, next){
	if (!req.session.user){
		res.clearCookie('user_sid');
	}
	next();
})

app.use(flash());

var MongoClient = require('mongodb').MongoClient;
var dburl = "mongodb://localhost:27017/Device";

var requireLogin = function(req, res, next){
	if (req.session && req.session.user){
		return next();
	}
	else {
		var err = new Error('You must be logged in to view');
		err.status =401;
		res.redirect('/');
	}
};





var userID;

app.get('/', function(req,res){
	res.render('index');
})



app.get('/home', function(req, res){
	

	var serialNum, companyName, fullModel, totalSizeTiB, freeSizeTiB;
	var deviceInfo = new Array();

	// Connect to the db
	MongoClient.connect(dburl, function (err, client) {
    
    	var db = client.db('DeviceInfo');
    	db.collection('data', function (err, collection) {
        	

         	collection.find({}).limit(10).toArray(function(err, result) {
           	 	if(err) throw err; 

           	 	for (let i = 0; i < result.length; i++){
           	 		var device = {
           	 			serialNum : result[i].serialNumberInserv,
           				companyName :result[i].system.companyName,
           				fullModel : result[i].system.fullModel,
           				totalSizeTiB : result[i].capacity.total.sizeTiB,
           				freeSizeTiB : result[i].capacity.total.freeTiB
           	 		}
           	 		deviceInfo.push(device);
           	 	}
           	 	
           		res.render('home', {device: deviceInfo});
           		client.close();
        	});
        
    	});
                
	});
})



app.post('/login', function(req, res) {
	
		var	username = req.body.username,
			password = req.body.password;


		var con = dbconnect.createConnection();


		

		
		con.query("SELECT user_name, user_password, user_ID FROM User WHERE user_name=?", [username], function(error, result, field){
				if (error) throw error;
				if (result.length > 1){
					req.flash("error");
					res.status(401).redirect('/');
				}

				else if (result.length === 0){
					res.status(401).redirect('/');
				}
				
				else if (result[0].user_password === password){
					userID = result[0].user_ID;
					req.session.user = username;
					res.redirect('/home');
				}
				else{
					req.flash("error");
					res.redirect('/');
				}

		})


})


app.get('/logout', function(req, res){
	if (req.session){
		req.session.destroy(function(err){
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}

})

app.get('/error', function(req, res){
	//res.render('error');
	res.redirect('/');
})

var slide1;
var slide2;
var slide3;
var box1;
var box2;
var box3;

app.get('/settings', function(req,res){
	
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
	res.render('settings', {threshold: thresholdChange});
	
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
	res.redirect('/settings');


})

app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})
