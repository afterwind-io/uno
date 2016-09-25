const debug = console.log.bind(null, '[WebSocket](chat)')

module.exports = {
  hook: (io, socket) => {
    socket.on('chat', msg => {
      debug(`<= ${JSON.stringify(msg)}`)

      let event = msg.title
      let params = msg.content
      if (eventHandler.hasOwnProperty(event)) {
        eventHandler[event](socket, params)
      }
    })
  }
}
