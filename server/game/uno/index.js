const logger = require('../../middlewares/logger.js')('UNO ')
const ports = require('../../config.js').ports
const io = require('socket.io-client')
const main = require('./main.js')

module.exports = {
  start () {
    let socket = io(`http://localhost:${ports.ws}`)
    socket.emit('game', {
      head: 'register',
      body: { gameName: 'uno' }
    })

    main.hook(socket)

    // console.log(`[Service][Redis][Room]Starts on :${port}`)
  }
}
