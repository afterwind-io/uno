let routeChat = require('./apis/chat.js')
let routeMain = require('')
let routeUno = require('')

module.exports = {
  hook: (io, socket) => {
    socket.on('chat', routeChat.hook(socket))
  }
}
