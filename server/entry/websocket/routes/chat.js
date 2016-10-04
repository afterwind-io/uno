const debug = require('../../../utils/logger.js')
const socketMap = require('../map.js')

function emitMessage (channel, msg, io) {
  io.to(channel).emit({
    head: 'broadcast',
    body: msg
  })
}

const handlers = {
  login ({ uid }, socket, io) {
    // 默认加入大厅频道
    socket.join(0)

    // 缓存双向索引
    socketMap.cache(socket, uid)

    debug(`Player:${uid} entered Lobby`)
    // emitMessage(0, msg, io)
  },
  logout (body, socket, io) {
    // 解除双向索引
    socketMap.remove(socket.id)

    // debug(`Player:${uid} leaved Lobby`)
    // emitMessage(0, msg, io)
  },
  join ({ id }, socket) {
    socket.join(id)
  },
  leave ({ id }, socket) {
    socket.leave(id)
  },
  chat ({ id, msg }, socket, io) {
    io.to(id).emit('main', {
      head: 'chat',
      body: msg
    })
  }
}

module.exports.route = io => {
  io.on('connection', socket => {
    socket.on('main', msg => {
      let event = msg.head
      if (handlers.hasOwnProperty(event)) {
        handlers[event](msg.body, socket, io)
      }
    })
  })
}
