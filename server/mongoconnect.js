	// var mysql = require('mysql');
	
	// function createConnection() {
	// 	return  mysql.createConnection({
	// 	        host: "localhost",
	// 	        user: "root",
	// 	        password: "toor",
	// 	        database: "Devices"
	// 	 });
	// };

	
	// module.exports.createConnection = createConnection;


var db1;
var MongoClient = require('mongodb').MongoClient;
exports.openMongoConnection = function(callback){
    MongoClient.connect("mongodb+srv://cs320:root@cluster0-9bmfr.mongodb.net/DeviceData",function(err,dbInstance){
        if(err)
        {
            callback(err);
        }
        else
        {
        	console.log("Connected to DeviceData");
            db1 = dbInstance;
            callback(null);
        }
            });
     };


exports.getCollection = function(collectionName, callback){
  dbInstance.collection(collectionName, function(err, collectionInstance){
    if(err)
    {
       callback(err);
    }
    else
    {
       callback(null, collectionInstance)
    }
  });
}