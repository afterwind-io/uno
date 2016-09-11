var env = process.env.NODE_ENV || 'dev'
var ws = require('./server/server.ws.js')
var db = require('./server/server.db.js')

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

db.start('30000')
ws.start('3001')
srv.start('3000')
