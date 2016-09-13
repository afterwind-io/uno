let app = require('./server.js')
let http = require('http').Server(app)
let io = require('socket.io')(http)

// 启动本地WebSocket服务
io.on('connection', function (socket) {
  console.log('A client has connected.')

  socket.on('main', function (msg) {
    console.log(msg)

    switch (msg.title) {
      case 'login':
        io.emit('main', {
          title: 'online status',
          content: ''
        })
        break
      case 'logout':
        io.emit('main', {
          title: 'online status',
          content: ''
        })
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
