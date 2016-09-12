var env = process.env.NODE_ENV || 'dev'
// var db = require('./server/server.db.js')
var ws = require('./server/server.ws.js')

var srv
switch (env) {
  case 'dev':
    srv = require('./server/server.dev.js')
    break
  case 'prod':
    srv = require('./server/server.html.js')
    break
  default:
    throw new Error('No such environment! <' + env + '>')
}

var routes = require('./server/routes.js')

// db.start('27017')
ws.start('3001')
srv.start('3000')
