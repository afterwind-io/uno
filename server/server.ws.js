let io = require('socket.io')()
let routes = require('./routes.ws.js')

io.on('connection', socket => {
  console.log('A client has connected.')
  routes.hook(io, socket)
})

module.exports = {
  start: function (port) {
    io.listen(port)
    console.log(`WebSocket listening on *:${port}`)
  }
}
