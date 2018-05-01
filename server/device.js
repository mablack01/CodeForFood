const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost')



const deviceSchema = new mongoose.Schema({
	_id: mongoose.Schema.ObjectID,	
	serialNumberInserv: {type: String},
	system:: [{
		companyName: String,
		model:  Number,
		fullModel: String,
		osVersion: String,
		patches: [],
		sp: {
			spId: Number,
			spModel: String,
			spVersion: String

		},
		productSKU: String,
      	productFamily: String,
      	recommended: {
        	osVersion: String

      	},	
      	portsHWInfo: [
      	{
      	  nsp: String,
          brand: String,
          "model": "9205-8e",
          "rev": "01",
          "firmware": "17.11.03.00",
          "serial": "Onboard"
      	}]

	}]
})