let app = require('./server.js')
let http = require('http').Server(app)
let io = require('socket.io')(http)

// 启动本地WebSocket服务
io.on('connection', function (socket) {
  console.log('wow')

  socket.on('main', function (msg) {
    switch (msg.title) {
      case 'login':
        console.log(msg.content)
        msg.content = 'ok'
        socket.emit('main', msg)
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
})

module.exports = {
  start: function (port) {
    http.listen(port, function () {
      console.log('WebSocket listening on *:3001')
    })
  }
}
