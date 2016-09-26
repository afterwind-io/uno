// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const routes = require('./routes.js')
const ports = require('../../config.js').ports

app.use('/service/player', routes)

module.exports = {
  start () {
    let portRoom = ports.room

    app.listen(portRoom, () => {
      console.log(`[Service][Redis][Room]Starts on :${portRoom}`)
    })
  }
}
