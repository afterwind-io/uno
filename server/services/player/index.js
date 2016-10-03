// const env = process.env.NODE_ENV || 'dev'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('../../middlewares/logger.js')('PLYR')
const routes = require('./routes.js')
const ports = require('../../config.js').ports

app.use(bodyParser.json())
app.use(logger)
app.use('/service/player', routes)

module.exports = {
  start () {
    let portPlayer = ports.player

    app.listen(portPlayer, () => {
      console.log(`[Service][Redis][Player]Starts on :${portPlayer}`)
    })
  }
}
