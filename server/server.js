const express = require('express')
const bodyParser = require('body-parser')
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
  
  tenantID = req.session.userID;
  console.log(tenantID);
  var serialNum, companyName, fullModel, totalSizeTiB, freeSizeTiB;
  var deviceInfo = new Array();

  // Connect to the db
   MongoClient.connect(dburl, function (err, client) {
        if (err) { console.log("error in connection to Devicedata")}
      var db = client.db('Devicedata');
        db.collection('fulldata', function (err, collection) {
          

          collection.find({"authorized.tenants": tenantID}).limit(20).toArray(function(err, result) {
              if(err) throw err; 

              for (let i = 0; i < result.length; i++){
                if (result[i].performance.portBandwidthData) {
                  var device = {
                    serialNum : result[i].serialNumberInserv,
                    companyName :result[i].system.companyName,
                    fullModel : result[i].system.fullModel,
                    totalSizeTiB : result[i].capacity.total.sizeTiB,
                    freeSizeTiB : result[i].capacity.total.freeTiB
                  }
                  deviceInfo.push(device);
                }
              }
              
              res.render('home', {device: deviceInfo, user: req.session.user});
              client.close();
          });
        
      });
                
  });
})



app.post('/login', function(req, res) {
  
    var username = req.body.username,
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
                    req.session.userID = userID;
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

app.post('/triggeredAlerts', requireLogin, function(req, res){
  var id = req.body.devID;
  var devID = id.substring(3, id.length);
  var freeTiB, totalDiskCount, diskState, readMax, readMin, readAvg, writeMax, writeMin,  writeAvg;
  var deviceInfo, thresholdInfo;

  MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
          if (err) { console.log("error in connection to User")}
        var db = client.db('Devicedata');
          db.collection('fulldata', function (err, collection) {
          
          // get the required info of the deivce

              collection.findOne({serialNumberInserv: devID}, function(err, result) {
                  if(err) throw err;
                   deviceInfo =
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
             
              }); 
                  

          });//closing getCollection 

          // get the info of threshold
          db.collection('threshold', function (err, collection) {
          
              collection.findOne({serialNumberInserv: devID}, function(err, result) {
                  if(err) throw err;
                  thresholdInfo = 
                  {
                    freeTiB : [25, 'true'],
                    totalDiskCount: [25, 'true'],
                    diskState: [25, 'true'],
                    readMax: [25, 'true'],
                    readMin: [25, 'true'],
                    readAvg: [25, 'true'],
                    writeMax: [25, 'true'],
                    writeMin: [25, 'true'],
                    writeAvg: [25, 'true']
                  }
                  if (result) {
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
                  }
                  
                  var alertInfo = {
                    freeTiB: false,
                    totalDiskCount: false,
                    readMax: false,
                    readMin: false,
                    readAvg:false,
                    writeMax:false,
                    writeMin:false,
                    writeAvg:false
                  }
                  if (thresholdInfo.freeTiB[1] == 'true') {
                    if(deviceInfo.freeTiB < thresholdInfo.freeTiB[0]){
                      alertInfo.freeTiB = true;
                    }
                  }
                  if (thresholdInfo.totalDiskCount[1] == 'true') {
                    if(deviceInfo.totalDiskCount < thresholdInfo.totalDiskCount[0]){
                      alertInfo.totalDiskCount = true;
                    }
                  }
                  if (thresholdInfo.readMax[1] == 'true') {
                    if(deviceInfo.readMax < thresholdInfo.readMax[0]){
                      alertInfo.readMax = true;
                    }
                  }
                  if (thresholdInfo.readMin[1] == 'true') {
                    if(deviceInfo.readMin < thresholdInfo.readMin[0]){
                      alertInfo.readMin = true;
                    }
                  }
                  if (thresholdInfo.readAvg[1] == 'true') {
                    if(deviceInfo.readAvg < thresholdInfo.readAvg[0]){
                      alertInfo.readAvg = true;
                    }
                  }
                  if (thresholdInfo.writeMax[1] == 'true') {
                    if(deviceInfo.writeMax < thresholdInfo.writeMax[0]){
                      alertInfo.writeMax = true;
                    }
                  }
                  if (thresholdInfo.writeMin[1] == 'true') {
                    if(deviceInfo.writeMin < thresholdInfo.writeMin[0]){
                      alertInfo.writeMin = true;
                    }
                  }
                  if (thresholdInfo.writeAvg[1] == 'true') {
                    if(deviceInfo.writeAvg < thresholdInfo.writeAvg[0]){
                      alertInfo.writeAvg = true;
                    }
                  }
                  res.send({alert: alertInfo});

              }); 
          });
      

             //send them to frontend

          client.close();            
    });//closing connect

})


app.post('/viewSettings', requireLogin, function(req, res){
  var id = req.body.devID;
  var devID = id.substring(3, id.length);
  var freeTiB, totalDiskCount, diskState, readMax, readMin, readAvg, writeMax, writeMin,  writeAvg;
  var deviceInfo, thresholdInfo;

  MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
          if (err) { console.log("error in connection to User")}
        var db = client.db('Devicedata');
          db.collection('fulldata', function (err, collection) {
          
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
                    freeTiB : [25, 'true'],
                    totalDiskCount: [25, 'true'],
                    diskState: [25, 'true'],
                    readMax: [25, 'true'],
                    readMin: [25, 'true'],
                    readAvg: [25, 'true'],
                    writeMax: [25, 'true'],
                    writeMin: [25, 'true'],
                    writeAvg: [25, 'true']
                  }
                  if (result) {
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
                  }
                  

                  res.send({device: deviceInfo, threshold:thresholdInfo});

              }); 
          });
      

             //send them to frontend

          client.close();            
    });//closing connect

})




var slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9;

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
    


app.post('/saveSettings', requireLogin, function(req, res) {
  slide0 = req.body.amountInput0;
  slide1 = req.body.amountInput1;
  slide2 = req.body.amountInput2;
  slide3 = req.body.amountInput3;
  slide4 = req.body.amountInput4;
  slide5 = req.body.amountInput5;
  slide6 = req.body.amountInput6;
  slide7 = req.body.amountInput7;
  slide8 = req.body.amountInput8;
  tog0 = req.body.alertToggle0;
  tog1 = req.body.alertToggle1;
  tog2 = req.body.alertToggle2;
  tog3 = req.body.alertToggle3;
  tog4 = req.body.alertToggle4;
  tog5 = req.body.alertToggle5;
  tog6 = req.body.alertToggle6;
  tog7 = req.body.alertToggle7;
  tog8 = req.body.alertToggle8;
  for (var i = 0; i < 9; i++) {
    if (this['tog'+i] != 'true')
      this['tog'+i] = 'false';
  }


  var id = req.body.devID;
  var devID = id.substring(3, id.length);
  var thresholdChange;



  MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/test", function (err, client) {
          if (err) { console.log("error in connection to User")}
        var db = client.db('Devicedata');
        var newThreshold = { $set: {
                      
                serialNumberInserv: devID,
              capacity: {
                  total: {
                      freeTiB: [slide0, tog0]
                  }
              },
  
              disks: {
                  total: {
                      diskCountNormal: [slide1, tog1]
                    },
                    state: [slide2, tog2]
                },

              performance: {
                    portBandwidthData: {
                      read: {
                          iopsMax: [slide3, tog3],
                          iopsMin: [slide4, tog4],
                          iopsAvg: [slide5, tog5]
                      },
                      write: {
                          iopsMax: [slide6, tog6],
                          iopsMin: [slide7, tog7],
                          iopsAvg: [slide8, tog8]
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
