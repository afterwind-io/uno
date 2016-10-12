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
      this.rpc = resolve

      if (this.type === 'bot') {
        let deals = ai.move(state, this.cards, penalties)
        this.moveAsync(state, penalties, deals)
      }
    })
  }

  moveAsync (state, penalties, deals) {
    deals = deals.map(d => new Card(d.color, d.symbol))

    if (state.action === 'penalty' && (
        deals[0].symbol === 'pnb' || deals[0].symbol === 'pno'
    )) {
      this.cards.push(...penalties)
    }

    if (deals[0].isEntityCard()) {
      this.toss(deals)
      this.lastCard = deals[0]
    }

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
