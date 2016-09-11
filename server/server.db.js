var app = require('./server.js')
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

module.exports = {
  start: function (port) {
    mongoose.connect('mongodb://localhost:' + port + '/uno')

    var db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function () {
      console.log('DataBase connected on *:' + port)
    })

    app.use(session({
      secret: '42 Doges',
      store: new MongoStore({
        mongooseConnection: db
      }),
      cookie: {
        maxAge: 12 * 3600 * 1000
      }
    }))
  }
}
