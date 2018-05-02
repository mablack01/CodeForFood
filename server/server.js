const express = require('express')
const bodyParser = require('body-parser')
const dbconnect = require('./dbconnect.js')
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


var MongoClient = require('mongodb').MongoClient;
var dburl = "mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test";

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


function getByID(id) {
    if (id.substring(0, 3) == 'dev') {
      for (var i = 0; i < deviceInfo.length; i++) {
        if (id.substring(3, id.length) == deviceInfo[i].serialNum) {
          return deviceInfo[i];
        }
      }
    }
    return undefined;
}


var userID;

app.get('/', function(req,res){
	res.render('index');
})



app.get('/home', requireLogin, function(req, res){
	

	var serialNum, companyName, fullModel, totalSizeTiB, freeSizeTiB;
	var deviceInfo = new Array();

	// Connect to the db
	 MongoClient.connect(dburl, function (err, client) {
      	if (err) { console.log("error in connection to Devicedata")}
     	var db = client.db('Devicedata');
      	db.collection('umass_export_25', function (err, collection) {
        	

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




		MongoClient.connect(dburl, function (err, client) {
      		if (err) { console.log("error in connection to User")}
     	 	var db = client.db('User');
      		db.collection('users', function (err, collection) {
          

          		collection.findOne({username: username}, function(err, result) {
              		if(err) throw err;
              		if (result == null){
              			res.redirect('/');
              		}
              		else if(result.password == password){
                		userID= result.uid
                		req.session.user = username;
                		res.redirect('/home')
             		} 
              // Else redirect to login page
              		else {
              			res.redirect('/')
              		}
              		
          		}); 
      		});//closing getCollection 
      		client.close();            
  		});//closing connect

})//closing login 


app.get('/logout', requireLogin, function(req, res){
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



app.post('/viewAlert', requireLogin, function(req, res){
	var id = req.body.devID;
	var devID = id.substring(3, id.length);
	var freeTiB, totalDiskCount, diskState, readMax, readMin, readAvg, writeMax, writeMin,  writeAvg;
	var deviceInfo, thresholdInfo;

	MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
      		if (err) { console.log("error in connection to User")}
     	 	var db = client.db('Devicedata');
      		db.collection('umass_export_25', function (err, collection) {
          
      		// get the required info of the deivce

          		collection.findOne({serialNumberInserv: devID}, function(err, result) {
              		if(err) throw err;
              		 deviceInfo = [
              			{
              			freeTiB : result.capacity.total.freeTiB,
              			totalDiskCount: result.disks.total.diskCount,
              			diskState: result.disks.state,
              			readMax: result.performance.portBandwidthData.read.iopsMax,
              			readMin: result.performance.portBandwidthData.read.iopsMin,
              			readAvg: result.performance.portBandwidthData.read.iopsAvg,
              			writeMax: result.performance.portBandwidthData.write.iopsMax,
              			writeMin: result.performance.portBandwidthData.write.iopsMin,
              			writeAvg: result.performance.portBandwidthData.write.iopsAvg
              			}
              		]
             
          		}); 
              		

      		});//closing getCollection 

      		// get the info of threshold
      		db.collection('threshold', function (err, collection) {
          
          		collection.findOne({serialNumberInserv: devID}, function(err, result) {
              		if(err) throw err;
              		 thresholdInfo = 
              		{
              			freeTiB : result.capacity.total.freeTiB,
              			totalDiskCount: result.disks.total.diskCountNormal,
              			diskState: result.disks.state,
              			readMax: result.performance.portBandwidthData.read.iopsMax,
              			readMin: result.performance.portBandwidthData.read.iopsMin,
              			readAvg: result.performance.portBandwidthData.read.iopsAvg,
              			writeMax: result.performance.portBandwidthData.write.iopsMax,
              			writeMin: result.performance.portBandwidthData.write.iopsMin,
              			writeAvg: result.performance.portBandwidthData.write.iopsAvg
              		}
              		

              		res.send({device: deviceInfo, threshold:thresholdInfo} );

          		}); 
      		});
			

             //send them to frontend

      		client.close();            
  	});//closing connect

})




app.post('/editAlert', function(req,res){
	
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

	
	
})
		

//take the value from the page and make changes to the threhsold db
app.post('/saveSettings', requireLogin, function(req, res) {
	var slide1 = req.body.amountInput0;
	var slide2 = req.body.amountInput1;
	var slide3 = req.body.amountInput2;
	var slide4 = req.body.amountInput3;
	var slide5 = req.body.amountInput4;
	var slide6 = req.body.amountInput5;
	var slide7 = req.body.amountInput6;
	var slide8 = req.body.amountInput7;
	var slide9 = req.body.amountInput8;

	var id = req.body.devID;
	var devID = id.substring(3, id.length);
	console.log(devID);
	var thresholdChange;


	//connecting to the threshold Collection

	MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
      		if (err) { console.log("error in connection to User")}
     	 	var db = client.db('Devicedata');
     	 	var newThreshold = { $set: {
              				
  							serialNumberInserv: devID,
							capacity: {
     							total: {
        							freeTiB: slide1
	  							}
							},
	
							disks: {
     					 		total: {
        							diskCountNormal: slide2
      							},
      							state: slide3
    						},

							performance: {
      							portBandwidthData: {
       								read: {
          								iopsAvg: slide4,
          								iopsMax: slide5,
          								iopsMin: slide6
        							},
        							write: {
          								iopsAvg: slide7,
          								iopsMax: slide8,
          								iopsMin: slide9
        							}
	  							}
							}
              			}};


     	 	db.collection('threshold', function (err, collection) {
          		collection.update({serialNumberInserv: devID}, newThreshold, {upsert: true}, function(err, result) {
          			if (err) throw err;
          			console.log("Updated 1 document");
          		})
          	})
              	
      		client.close();            
  	});//closing connect

	res.redirect('/home');


})

app.post('/insertThreshold', function (req,res){

})

app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})
