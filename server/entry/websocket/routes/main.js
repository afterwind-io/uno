const socketMap = require('../map.js')

module.exports.route = io => {
  io.on('connection', socket => {
    console.log('+', socket.id)

    socket.on('disconnect', () => {
      socketMap.remove(socket.id)
      console.log('-', socket.id)
    })
  })
}
