// let env = process.env.NODE_ENV || 'dev'
const ports = require('../../config.js').ports
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('../../middlewares/cors.js')
const logger = require('../../middlewares/logger.js')('Main')
const auth = require('../../middlewares/auth.js')
const session = require('./middlewares/session.js')
const routerUser = require('./routes/user.js')

app.use(cors)
app.use(bodyParser.json())
app.use(logger)
app.use(session)

app.use(auth)
app.use('/api/user', routerUser)

module.exports = {
  start () {
    let portMain = ports.main

    app.listen(portMain, () => {
      console.log(`[Server][Main]Starts on :${portMain}`)
    })
  }
}
