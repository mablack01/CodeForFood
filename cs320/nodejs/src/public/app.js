const RenameDevice= document.querySelector('.RenameDevice')
RenameDevice.addEventListener('submit', (e) => {
  e.preventDefault()
  const deviceName = RenameDevice.querySelector('.deviceName').value
  const deviceID = RenameDevice.querySelector('.deviceID').value
  post('/RenameDevice', { deviceName, deviceID })
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