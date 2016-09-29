const mongoose = require('mongoose')
const conn = mongoose.createConnection('mongodb://localhost:27017/uno')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

mongoose.Promise = global.Promise

conn.on('error', console.error.bind(console, 'connection error:'))
conn.once('open', function () {
  console.log('DataBase connected on *:' + 27017)
})

module.exports = session({
  secret: '42 Doges',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: conn
  }),
  cookie: {
    maxAge: 1000 * 3600 * 12
  }
})
