let app = require('./server.js')
let http = require('http').Server(app)
let io = require('socket.io')(http)

module.exports = {
  io,
  start: function (port) {
    http.listen(port, function () {
      console.log(`WebSocket listening on *:${port}`)
    })
  }
}
