let app = require('./server.js')
let http = require('http').Server(app)
let io = require('socket.io')(http)

let _sockets = []

function emitOnlineStatus () {
  io.emit('main', {
    title: 'online status',
    content: ''
  })
}

function cacheSocket (id, socket) {
  let playerId = parseInt(id)
  _sockets[playerId] = socket
  console.log(_sockets.keys())
}

function clearSocket (socket) {
  let i = _sockets.indexOf(socket)
  if (i !== -1)_sockets.splice(0, i)
}

// 启动本地WebSocket服务
io.on('connection', socket => {
  console.log('A client has connected.')

  socket.on('main', function (msg) {
    console.log(`[WebSocket] <= ${JSON.stringify(msg)}`)

    switch (msg.title) {
      case 'login':
        cacheSocket(msg.content.pid, socket)
        emitOnlineStatus()
        break
      case 'logout':
        clearSocket()
        emitOnlineStatus()
        break
      case 'chat':
        io.emit('main', msg)
        break
      case 'uno':
        break
      default:
        break
    }
  })

  socket.on('disconnect', () => {
    console.log('A client has disconnected.')
  })
})

module.exports = {
  start: function (port) {
    http.listen(port, function () {
      console.log('WebSocket listening on *:3001')
    })
  }
}
