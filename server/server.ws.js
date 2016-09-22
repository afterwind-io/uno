let app = require('./server.js')
let http = require('http').Server(app)
let io = require('socket.io')(http)
let routes = require('./routes.ws.js')

io.on('connection', socket => {
  routes.hook(socket)
})

module.exports = {
  io,
  start: function (port) {
    http.listen(port, function () {
      console.log(`WebSocket listening on *:${port}`)
    })
  }
}
