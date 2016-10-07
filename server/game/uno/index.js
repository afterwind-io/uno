const logger = require('../../middlewares/logger.js')('UNO ')
const ports = require('../../config.js').ports
const io = require('socket.io-client')

module.exports = {
  start () {
    let socket = io(`http://localhost:${ports.ws}`)
    socket.emit('game', {
      head: 'register',
      body: { gameName: 'uno' }
    })
    socket.on('game', msg => {
      console.log(JSON.stringify(msg))
    })
    // const handlers = {
    //   call ({ roomId, uid, card }, socket, io) {
    //     io.to('uno-server').emit('game', { roomId, uid, card })
    //   }
    // }
    // console.log(`[Service][Redis][Room]Starts on :${port}`)
  }
}
