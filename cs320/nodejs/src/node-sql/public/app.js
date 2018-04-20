var CreateDevice = document.querySelector('.CreateDevice')
CreateDevice.addEventListener('submit', (e) => {
	e.preventDefault()
	var devicename = CreateDevice.querySelector(".devicename").value
	post ('/createDevice', { devicename })
})

function post(path, data){
	return fetch(path, {
		method: 'POST',
		/*headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},*/
		body: JSON.stringify(data)
	})
}