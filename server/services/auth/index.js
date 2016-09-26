// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const routes = require('./routes')
const ports = require('../../config.js').ports

app.use('/service/auth', routes)

module.exports = {
  start () {
    let portAuth = ports.auth

    app.listen(portAuth, () => {
      console.log(`[Service][Redis][Auth]Starts on :${portAuth}`)
    })
  }
}
