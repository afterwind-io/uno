var app = require('./server.js')
var http = require('http').Server(app)
var io = require('socket.io')(http)

// 启动本地WebSocket服务
io.on('connection', function (socket) {
  console.log('wow')

  socket.on('main', function (msg) {
    switch (msg.title) {
      case 'login':
        console.log(msg.content)
        msg.content = 'ok'
        io.emit('main', msg)
        break
      case 'chat':
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
