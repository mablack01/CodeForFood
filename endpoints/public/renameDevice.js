
var renameDevice = document.querySelector('.renameDevice')
renameDevice.addEventListener('submit', (e) => {
	e.preventDefault()
	var device_name = renameDevice.querySelector(".device_name").value
	post ('/renameDevice', { device_name })
})

function post(path, data){
	return fetch(path, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
}


