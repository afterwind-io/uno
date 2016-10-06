const debug = require('../../../utils/logger.js')
const idGen = require('../../../utils/idGen.js')
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
  },
  logout (body, socket, io) {
    // 解除双向索引
    socketMap.remove(socket.id)
  },
  join ({ id, name }, socket, io) {
    // FIXME
    if (isNaN(parseInt(id))) {
      let roomId = idGen()
      socket.join(roomId)

      let target = socketMap.get(id)
      target.join(roomId)

      io.to(roomId).emit('main', {
        head: 'chatInitReq',
        body: { id: roomId, name }
      })
    } else {
      socket.join(id)

      socket.emit('main', {
        head: 'chatInitReq',
        body: { id, name }
      })
    }
  },
  leave ({ id }, socket) {
    socket.leave(id)
  },
  chat ({ id, msg }, socket, io) {
    io.to(id).emit('main', {
      head: 'chat',
      body: { id, msg }
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
