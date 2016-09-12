let app = require('./server.js')
let mongoose = require('mongoose')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)

module.exports = {
  start: function (port) {
    mongoose.connect('mongodb://localhost:' + port + '/uno')

    let db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function () {
      console.log('DataBase connected on *:' + port)
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
  }
}
