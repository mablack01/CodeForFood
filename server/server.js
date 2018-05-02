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
              		 thresholdInfo = [
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
              		]

              		res.render('alert',  {device: deviceInfo, threshold:thresholdInfo} );

          		}); 
      		});
			

             //send them to frontend

      		client.close();            
  	});//closing connect

})




var slide1;
var slide2;
var slide3;
var box1;
var box2;
var box3;

app.post('/editAlert', requireLogin, function(req,res){
	
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

	MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
      		if (err) { console.log("error in connection to User")}
     	 	var db = client.db('Devicedata');

     	 	db.collection('threshold', function (err, collection) {
          		collection.findOne({serialNumberInserv: devID}, function(err, result) {
              		if(err) throw err;

              		if (result == null){
              			collection.insertOne(
              			{
              				
  							serialNumberInserv: id,
							capacity: {
     							total: {
        							freeTiB: freesizeTiB
	  							}
							},
	
							disks: {
     					 		total: {
        							diskCountNormal: diskCount
      							},
      							state: newState
    						},

							performance: {
      							portBandwidthData: {
       								read: {
          								iopsAvg: readAvg,
          								iopsMax: readMax,
          								iopsMin: readMin
        							},
        							write: {
          								iopsAvg: writeAvg,
          								iopsMax: writeMax,
          								iopsMin: writeMin
        							}
	  							}
							}
              			});
              		}
              		 

              		 thresholdInfo = [
              		
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
              		]

              		res.render('alert',  {device: deviceInfo, threshold:thresholdInfo} );

          		}); 
      		});
			

             //send them to frontend

      		client.close();            
  	});//closing connect










	res.render('settings', {threshold: thresholdChange});
	
})
		


app.post('/saveSettings', requireLogin, function(req, res) {
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
	res.redirect('/editAlert');


})

app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})
