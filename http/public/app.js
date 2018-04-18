const CreateUser = document.querySelector('.CreateUser')
CreateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const deviceName = CreateUser.querySelector('.deviceName').value
  const deviceID = CreateUser.querySelector('.deviceID').value
  post('/createUser', { deviceName, deviceID })
})

function post (path, data) {
  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

// function get(path) {
//   return window.fetch(path, {






//   })
  
// }