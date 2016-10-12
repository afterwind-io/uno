const Player = require('./models/player.js')
const Uno = require('./uno.js')

const games = new Map()
// const ai = new Player()

// const broadcast = (socket, roomId, action, payload) => {
//   socket.emit('game', {
//     head: 'broadcast',
//     body: { gameName: 'uno', roomId, action, payload }
//   })
//
//   console.log(`[uno] => [broadcast]${action}: ${JSON.stringify(payload)}`)
// }

const handlers = {
  start ({ roomId, players }, socket) {
    let unoPlayers = players.map(p => new Player(p))
    let game = new Uno(socket, roomId, unoPlayers)
    games.set(roomId, game)

    game.start()
  },
  call ({ roomId, deals }, socket) {
    let game = games.get(roomId)
    if (!game) return

    let currentPlayer = game.players[game.pointer]
    currentPlayer.moveAsync(game.state, game.deck.penalties, deals)
  }
}

module.exports = {
  hook (socket) {
    socket.on('game', msg => {
      let event = msg.head
      if (handlers.hasOwnProperty(event)) {
        handlers[event](msg.body, socket)

        // console.log(`[uno] <= [${msg.head}][${JSON.stringify(msg.body)}]`)
      }
    })
  }
}
