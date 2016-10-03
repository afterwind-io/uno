// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('../../middlewares/logger.js')('ROOM')
const routes = require('./routes.js')
const ports = require('../../config.js').ports

app.use(bodyParser.json())
app.use(logger)
app.use('/service/room', routes)

module.exports = {
  start () {
    let portRoom = ports.room

    app.listen(portRoom, () => {
      console.log(`[Service][Redis][Room]Starts on :${portRoom}`)
    })
  }
}
