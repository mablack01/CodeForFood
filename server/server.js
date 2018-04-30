const express = require('express')
const bodyParser = require('body-parser')
// const dbconnect = require('./dbconnect.js')



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

const MongoClient = require('mongodb').MongoClient;
const db = require('./mongoconnect.js');//require db.js


// This function connects to the database named DeviceData hosted at MongoDB Atlas
db.openMongoConnection(function(error)
{
    if(error){
        console.log(error);
        console.log("cannot make the connection with database");
    }
    else{
    	// To access any collection you can use the method. 
    	// db.getCollection(collectionName)
    	console.log("connected");
    }
});




app.get('/home', function(req, res){

	var serialNum, companyName, fullModel, totalSizeTiB, freeSizeTiB;
	var deviceInfo;

	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/DeviceInfo", function (err, client) {
    
    	var db = client.db('DeviceInfo');
    	db.getCollection('umass_export_25', function (err, collection) {
        	

         	collection.findOne({}, function(err, result) {
           	 	if(err) throw err; 
           	 	deviceInfo = [
           		{
           			serialNum : result.serialNumberInserv,
           			companyName : result.system.companyName,
           			fullModel : result.system.fullModel,
           			totalSizeTiB : result.capacity.total.sizeTiB,
           			freeSizeTiB : result.capacity.total.freeTiB
           		}
           		];
           		res.render('home', {device: deviceInfo});
           		client.close();
        	});
        
    	});
                
	});
})







app.get('/settings', function(req, res){
	res.render('settings');
})

// app.post('/login', function(req, res) {
	
// 		var	username = req.body.username,
// 			password = req.body.password;


// 		var con = dbconnect.createConnection();


		

		
// 		con.query("SELECT user_name, user_password, user_ID FROM User WHERE user_name=?", [username], function(error, result, field){
// 				if (error) throw error;
// 				if (result.length > 1){
// 					res.status(401).redirect('/');
// 				}

// 				else if (result.length === 0){
// 					res.status(401).redirect('/');
// 				}
				
// 				else if (result[0].user_password === password){
// 					userID = result[0].user_ID;
// 					res.redirect('/home');
// 				}
// 				else{
// 					res.redirect('/error');
// 				}

// 		})


// })

app.post('/logout', function(req, res){
	user_ID = null;
	res.redirect('/');
})

app.get('/error', function(req, res){
	//res.render('error');
	res.redirect('/');
})
		



app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})
