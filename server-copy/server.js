let env = process.env.NODE_ENV || 'dev'
let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)

let app
switch (env) {
  case 'dev':
    app = require('./server.dev.js').app
    break
  case 'prod':
    app = express()
    break
  default:
    throw new Error('No such environment! <' + env + '>')
}

app.use(bodyParser.json())

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
    maxAge: 12 * 3600 * 1000
  }
}))

module.exports = app
