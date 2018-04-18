var connection = require('./connection')


module.exports = {

	updateDB({new_device_name, dev_id}){

		testDB.query
			(
				"UPDATE 'Devices' SET device_name = new_device_name WHERE device_id=dev_id"
			);
		return Promise.resolve();
	}
}
