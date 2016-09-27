const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

mongoose.createConnection('mongodb://localhost:27017/uno')

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('DataBase connected on *:' + 27017)
})

module.exports = session({
  secret: '42 Doges',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie: {
    maxAge: 1000 * 3600 * 12
  }
})
