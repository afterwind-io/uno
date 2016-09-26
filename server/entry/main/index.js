// let env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const ports = require('../../config.js').ports

app.use(bodyParser.json())
// app.use('/api', router)

mongoose.connect('mongodb://localhost:' + 27017 + '/uno')

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('DataBase connected on *:' + 27017)
})

app.use(session({
  secret: '42 Doges',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie: {
    maxAge: 1000 * 3600 * 12
  }
}))

module.exports = {
  start () {
    let portMain = ports.main

    app.listen(portMain, () => {
      console.log(`[Server][Main]Starts on :${portMain}`)
    })
  }
}
