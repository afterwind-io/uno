import io from './server.ws.js'

let debug = console.log.bind(null, '[WebSocket](server)')

function emitOnlineStatus () {
  io.emit('server', {
    title: 'online status',
    content: ''
  })
}

io.on('connection', socket => {
  debug('A client has connected.')

  socket.on('server', msg => {
    debug(`<= ${JSON.stringify(msg)}`)

    switch (msg.title) {
      case 'login':
        emitOnlineStatus()
        break
      case 'logout':
        emitOnlineStatus()
        break
      default:
        break
    }
  })

  socket.on('disconnect', () => {
    debug('A client has disconnected.')
  })
})
