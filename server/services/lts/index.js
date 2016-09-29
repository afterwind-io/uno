// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('../../middlewares/logger.js')('LTS')
const routes = require('./routes.js')
const ports = require('../../config.js').ports

app.use(bodyParser.json())
app.use(logger)
app.use('/service/lts', routes)

mongoose.Promise = global.Promise

module.exports = {
  start () {
    let db = mongoose.connection
    let portLts = ports.lts

    db.on('error', console.error.bind(console, 'connection error:'))

    app.listen(portLts, () => {
      console.log(`[Service][LTS][API]Starts on :${portLts}`)
    })
  }
}
