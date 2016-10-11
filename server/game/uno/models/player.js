const idGen = require('../../../utils/idGen.js')
const Card = require('./card.js')
const ai = require('./ai.js')

class Player {
  constructor (info, socket) {
    this.socket = socket
    this.roomId = info.roomId
    this.type = info.type || 'doge'
    this.uid = this.type === 'bot' ? idGen() : info.uid
    this.name = info.name
    this.cards = []
    this.lastCard = {}
    this.rpc = {}
  }

  init (cards) {
    this.cards = cards
  }

  move (state, penalties) {
    return new Promise((resolve, reject) => {
      if (this.type === 'bot') {
        let deals = ai.move(state, this.cards, penalties)
        if (deals[0].isEntityCard()) this.lastCard = deals[0]
        resolve(deals)
      } else {
        this.rpc = resolve
      }
    })
  }

  moveAsync (deals) {
    deals = deals.map(d => new Card(d.color, d.symbol))
    if (deals[0].isEntityCard()) this.lastCard = deals[0]
    this.rpc(deals)
  }

  toss (cards) {
    for (const card of cards) {
      if (!card.isEntityCard()) continue

      let i = this.cards.findIndex(c =>
        card.color === c.color && card.symbol === c.symbol
      )

      if (i !== -1) this.cards.splice(i, 1)
    }
  }
}

module.exports = Player
