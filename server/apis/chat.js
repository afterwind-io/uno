module.exports = {
  hook: socket => {
    const _socket = socket

    io.on('connection', socket => {
      socket.on('chat', msg => {
        debug(`<= ${JSON.stringify(msg)}`)

        let event = msg.title
        let params = msg.content
        if (eventHandler.hasOwnProperty(event)) {
          eventHandler[event](socket, params)
        }
      })
    })
  }
}
