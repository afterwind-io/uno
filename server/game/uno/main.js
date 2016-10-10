const Player = require('./models/player.js')
const Uno = require('./uno.js')

const games = new Map()
// const ai = new Player()

const broadcast = (socket, roomId, action, payload) => {
  socket.emit('game', {
    head: 'broadcast',
    body: { gameName: 'uno', roomId, action, payload }
  })

  console.log(`[uno] => [broadcast]${action}: ${JSON.stringify(payload)}`)
}

const handlers = {
  start ({ roomId, players }, socket) {
    let unoPlayers = players.map(p => new Player(p))
    let game = new Uno(unoPlayers)
    games.set(roomId, game)

    game.init()
      .then(piles => {
        piles.forEach((p, i) => {
          if (players[i].type === 'bot') {
            players[i].init(p)
          } else {
            broadcast(socket, roomId, 'deal', {
              player: players[i].uid,
              cards: p
            })
          }
        })

        return game.push()
      })
      .then(payload => {
        broadcast(socket, roomId, 'gameStart', payload)

        // 如果下一个为ai玩家则推送状态至本地ai
        let player = payload.game.currentPlayer
        if (player.type === 'bot') {
          let deals = player.move({
            state: payload.game.state,
            penalties: payload.game.penalties
          })

          // 模拟用户请求返回ai计算结果
          socket.emit('game', {
            head: 'forward',
            body: {
              gameName: 'uno',
              action: 'call',
              payload: {
                roomId,
                deals
              }
            }
          })
        }
      })
  },
  call ({ roomId, deals }, socket) {
    let game = games.get(roomId)
    if (!game) return

    game.step(deals)
      .then(isEnd => {
        if (isEnd) {
          // TODO
          // broadcast(socket, roomId, 'end', payload)
          // games.delete(roomId)
        } else {
          return game.push()
        }
      })
      .then(payload => {
        broadcast(socket, roomId, 'update', payload)

        // TODO: 方法提取
        // 如果下一个为ai玩家则推送请求至本地ai
        let player = payload.game.currentPlayer
        if (player.type === 'bot') {
          let deals = player.move({
            state: payload.game.state,
            penalties: payload.game.penalties
          })

          // 模拟用户请求返回ai计算结果
          socket.emit('game', {
            head: 'forward',
            body: {
              gameName: 'uno',
              action: 'call',
              payload: {
                roomId,
                deals
              }
            }
          })
        }
      })
  }
}

module.exports = {
  hook (socket) {
    socket.on('game', msg => {
      let event = msg.head
      if (handlers.hasOwnProperty(event)) {
        handlers[event](msg.body, socket)

        console.log(`[uno] <= [${msg.head}][${JSON.stringify(msg.body)}]`)
      }
    })
  }
}
