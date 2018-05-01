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




app.get('/home', function(req, res){

	var serialNum, companyName, fullModel, totalSizeTiB, freeSizeTiB;
	var deviceInfo;

	// Connect to the db
	MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
    if (err) { console.log("error in connection to Devicedata")}
    	var db = client.db('Devicedata');
    	db.collection('umass_export_25', function (err, collection) {
        	

         	collection.findOne({uid:userID}, function(err, result) {
            // Set up redirect to login
           	 	if(err) throw err; 
              console.log("Result");
              console.log(result);
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

app.post('/login', function(req, res) {
	
		var	username = req.body.username;
		var password = req.body.password;

    // Connect to the db
  MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
      if (err) { console.log("error in connection to User")}
      var db = client.db('User');
      db.collection('users', function (err, collection) {
          

          collection.findOne({username: username}, function(err, result) {
              if(err) render('error');
              if(result.password == password){
                userID= result.uid
                res.redirect('/home')
              } 
              // Else render Passowrd not matching
              res.render('/home')
              client.close();
          }); 
      });//closing getCollection             
  });//closing connect
})//closing login 

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
