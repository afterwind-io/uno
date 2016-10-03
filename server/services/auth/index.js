// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes')
const logger = require('../../middlewares/logger.js')('AUTH')
const ports = require('../../config.js').ports

app.use(bodyParser.json())
app.use(logger)
app.use('/service/auth', routes)

module.exports = {
  start () {
    let portAuth = ports.auth

    app.listen(portAuth, () => {
      console.log(`[Service][Redis][Auth]Starts on :${portAuth}`)
    })
  }
}
