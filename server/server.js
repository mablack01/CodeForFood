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

app.get('/home',requireLogin, function(req, res){
	var User ;
	var con = dbconnect.createConnection();

	con.query("SELECT user_name, user_password, user_ID FROM User WHERE user_id=?", [userID], function(error, result, field){
		if (error) throw error;
		User = [
			{
				name: result[0].user_name,
				pwd: result[0].user_password
			}


		];

		res.render('home', {user: User});

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


app.get('/settings', function(req,res){
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

app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})
