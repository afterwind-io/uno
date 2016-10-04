const ports = require('../../config.js').ports
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const logger = require('../../middlewares/logger.js')('WS  ')
const routerPublic = require('./routes/public.js')

app.use(bodyParser.json())
app.use(logger)
app.use('/service/ws', routerPublic(io))

// io.use((socket, next) => {
//   console.log(socket.request.headers.cookie)
//   next()
// })
require('./routes/main.js').route(io)
require('./routes/chat.js').route(io)
// require('./routes/uno.js').route(io)

module.exports = {
  start: function () {
    let port = ports.ws

    server.listen(port)
    console.log(`WebSocket listening on *:${port}`)
  }
}
