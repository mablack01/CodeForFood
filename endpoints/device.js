module.exports = {
	renameDevice ({device_name}) {
		console.log('New Name: ${device_name}')
		return Promise.resolve()
	}
}