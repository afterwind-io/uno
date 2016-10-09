const Player = require('./models/player.js')
const Uno = require('./uno.js')

const games = []

const broadcast = (socket, roomId, action, payload) => {
  socket.emit('game', {
    head: 'broadcast',
    body: { gameName: 'uno', roomId, action, payload }
  })
}

const handlers = {
  start ({ roomId, players }, socket) {
    let unoPlayers = players.map(p => new Player(p))
    let game = new Uno(roomId, unoPlayers)
    games.push(game)

    game.init()
      .then(piles => {
        piles.forEach((p, i) => {
          broadcast(socket, roomId, 'deal', {
            player: players[i].uid,
            cards: p
          })
        })

        return game.push()
      })
      .then(payload => {
        broadcast(socket, roomId, 'gameStart', payload)
      })
  },
  call ({ roomId, deals }, socket) {
    let game = games.find(g => g.roomId === roomId)
    if (!game) return

    game.step(deals)
      .then(isEnd => {
        if (isEnd) {
          // TODO
          // broadcast(socket, roomId, 'end', payload)
        } else {
          return game.push()
        }
      })
      .then(payload => {
        broadcast(socket, roomId, 'update', payload)
      })
  }
}

module.exports = {
  hook (socket) {
    socket.on('uno-server', msg => {
      let event = msg.head
      if (handlers.hasOwnProperty(event)) {
        handlers[event](msg.body, socket)
      }
    })
  }
}
