// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes.js')
const ports = require('../../config.js').ports

app.use(bodyParser.json())
app.use('/service/user', routes)

module.exports = {
  start () {
    let db = mongoose.connection
    let portMongo = ports.mongo
    let portLts = ports.lts

    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function () {
      console.log(`[Service][LTS][DB]Starts on :${portMongo}`)
    })

    mongoose.connect('mongodb://localhost:' + portMongo + '/uno')

    app.listen(portLts, () => {
      console.log(`[Service][LTS][API]Starts on :${portLts}`)
    })
  }
}
