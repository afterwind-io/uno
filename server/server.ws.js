let app = require('./server.js')
let http = require('http').Server(app)
let io = require('socket.io')(http)

// 启动本地WebSocket服务
io.on('connection', socket => {
  console.log('A client has connected.')

  socket.on('chat', msg => {

  })

  socket.on('uno', msg => {

  })

  socket.on('disconnect', () => {
    console.log('A client has disconnected.')
  })
})

module.exports = {
  io,
  start: function (port) {
    http.listen(port, function () {
      console.log('WebSocket listening on *:3001')
    })
  }
}
