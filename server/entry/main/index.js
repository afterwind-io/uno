// let env = process.env.NODE_ENV || 'dev'
const ports = require('../../config.js').ports
const express = require('express')
const app = express()
const logger = require('./middlewares/logger.js')
const bodyParser = require('body-parser')
const session = require('./middlewares/session.js')
const auth = require('./middlewares/auth.js')
// const router = require('')

app.use(logger)
app.use(bodyParser.json())
app.use(session)
app.use(auth)
// app.use('/api', router)

module.exports = {
  start () {
    let portMain = ports.main

    app.listen(portMain, () => {
      console.log(`[Server][Main]Starts on :${portMain}`)
    })
  }
}
