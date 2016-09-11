var env = process.env.NODE_ENV || 'dev'
var express = require('express')
var bodyParser = require('body-parser')

var app
if (typeof app === 'undefined') {
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
}

app.use(bodyParser.json())

module.exports = app
