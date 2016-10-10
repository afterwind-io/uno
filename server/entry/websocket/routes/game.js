const debug = require('../../../utils/logger.js')

const handlers = {
  /**
   * 游戏服务器作为独立socket向ws总线注册
   */
  register ({ gameName }, socket, io) {
    socket.join(`${gameName}-server`)
  },

  /**
   * 游戏服务器通过ws总线向用户群广播消息
   */
  broadcast ({ gameName, roomId, action, payload }, socket, io) {
    io.to(roomId).emit(gameName, {
      head: action,
      body: payload
    })
  },

  /**
   * 用户通过ws总线发起游戏开始请求
   */
  start ({gameName, roomId}, socket, io) {
    io.to(roomId).emit('game', {
      head: 'gameStart',
      body: { gameName }
    })
  },

  /**
   * 用户通过ws总线向游戏服务器转发消息
   */
  forward ({ gameName, action, payload }, socket, io) {
    io.to(`${gameName}-server`).emit('game', {
      head: action,
      body: payload
    })
  }
}

module.exports.route = io => {
  io.on('connection', socket => {
    socket.on('game', msg => {
      let event = msg.head
      if (handlers.hasOwnProperty(event)) {
        handlers[event](msg.body, socket, io)
      }
    })
  })
}
