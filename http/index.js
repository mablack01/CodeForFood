const express = require('express')
const bodyParser = require('body-parser')

const store = require('./store')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.post('/createUser', (req, res) => {
  store
    .createUser({
      deviceName: req.body.deviceName,
      deviceID: req.body.deviceID
    })
    .then(() => res.sendStatus(200))
})

app.listen(7554, () => {
  console.log('Server running on http://localhost:7554')
})