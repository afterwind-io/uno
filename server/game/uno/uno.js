const Card = require('./models/card.js')
const Deck = require('./models/deck.js')
const text = require('./utils.js')

class Uno {
  constructor (players) {
    this.deck = {}
    this.players = players
    this.state = {
      color: '',
      symbol: '',
      d2: false,
      d4: false,
      action: 'onturn'
    }
    this.currentCard = {}
    this.penalty = 1
    this.pointer = 0
    this.d4ColorCallerPtr = -1
    this.d4NextPlayerPtr = -1
    this.direction = 1
    this.turns = 1
  }

  init () {
    return new Promise((resolve, reject) => {
      this.deck = new Deck()
      this.currentCard = this.deck.pickFirst()
      this.pushState(this.currentCard)

      let piles = this.deck.deal(this.players.length)
      piles.forEach((p, i) => { this.players[i].init(p) })

      resolve(piles)
    })
  }

  push () {
    return new Promise((resolve, reject) => {
      resolve({
        game: {
          state: this.state,
          currentCard: this.currentCard,
          currentPlayer: {
            type: this.players[this.pointer].type,
            uid: this.players[this.pointer].uid
          },
          penalties: this.deck.penalties
        },
        players: this.players.map(p => {
          return {
            lastCard: p.lastCard,
            uid: p.uid,
            name: p.name,
            type: p.type,
            remains: p.cards.length
          }
        })
      })
    })
  }

  printServerState () {
    let handNum = text.padLeft(this.players.reduce((s, p) => s + p.cards.length, 0), 3)
    let deckNum = text.padLeft(this.deck.deck.length, 3)
    let discardsNum = text.padLeft(this.deck.discards.length, 3)
    let penaltyNum = text.padLeft(this.deck.penalties.length, 3)
    let sum = text.padLeft(parseInt(handNum) + parseInt(deckNum) + parseInt(discardsNum) + parseInt(penaltyNum), 3)

    let d4 = this.state.d4 ? 'true ' : 'false'
    let d2 = this.state.d2 ? 'true ' : 'false'
    let color = text.padRight(this.state.color, 7)
    let symbol = text.padRight(this.state.symbol, 3)
    let action = this.state.action

    console.log(`Server[${handNum}][${deckNum}][${discardsNum}][${penaltyNum}][${sum}]: State[Color: ${color}, Symbol: ${symbol}, +4: ${d4}, +2: ${d2} ] Action[${action}]`)
  }

  printPlayerDeal (cards) {
    let card = cards[0]
    let turn = text.padLeft(this.turns, 3)
    let player = this.players[this.pointer]
    let handNum = text.padLeft(player.cards.length, 3)
    let head = text.padLeft(`[${turn}]Player(${this.pointer})  [${handNum}]`, 31)
    let handCards = player.cards.reduce((s, c) => `${s + c.toShortenString()}, `, '')
    console.log(`${head}: ${card.toString()} * ${cards.length} [${handCards}]`)
  }

  printResult () {
    console.log('--------RESULT--------')

    this.players.forEach((p, i) => {
      if (p.cards.length === 0) {
        console.log(`Player(${i}): Winner`)
      } else {
        let score = text.padRight(p.cards.reduce((s, c) => s + c.getScore(), 0), 3)
        let cards = p.cards.reduce((s, c) => `${s + c.toShortenString()}, `, '')
        console.log(`Player(${i}): ${score} ${cards}`)
      }
    })
  }

  movePointer (num = 1) {
    let pointer = this.pointer
    let delta = this.direction === 1
      ? pointer += num
      : pointer -= num

    if (pointer >= this.players.length) {
      pointer = this.players.length - delta
    }
    if (pointer < 0) {
      pointer = this.players.length + delta
    }

    return pointer
  }

  reversePointer () {
    this.direction = this.direction * -1
  }

  addPenalty (num) {
    if (this.penalty === 1) {
      this.penalty = num
    } else {
      this.penalty += num
    }
  }
  clearPenalty () {
    this.penalty = 1
  }
  setAction (action) {
    this.state.action = action
  }
  setState (color, symbol, d2, d4) {
    if (color !== null) this.state.color = color
    if (symbol !== null) this.state.symbol = symbol
    if (d2 !== null) this.state.d2 = d2
    if (d4 !== null) this.state.d4 = d4
  }

  step (deals) {
    return new Promise((resolve, reject) => {
      let _deals = deals.map(d => new Card(d.color, d.symbol))
      let currentPlayer = this.players[this.pointer]

      this.printPlayerDeal(_deals)

      if (currentPlayer.cards.length === 0) {
        // TODO 结束判断
        this.state.action = 'end'
        this.printResult()
        resolve(true)
      } else {
        this.currentCard = _deals[0]
        this.pushState(this.currentCard)
        this.pushPointer(this.currentCard)
        this.toss(_deals)
        this.turns++
        this.printServerState()
        resolve(false)
      }
    })
  }

  pushState (card) {
    switch (card.symbol) {
      case 'pnb':
        this.setAction('penaltyBack')
        this.deck.clearPenalty()
        this.clearPenalty()
        break
      case 'pno':
        this.setAction(this.state.d4 ? 'callColor' : 'onturn')
        this.deck.clearPenalty()
        this.clearPenalty()
        this.setState(null, null, false, null)
        break
      case 'pas':
        this.setAction('penalty')
        this.deck.pickPenalty(this.penalty)
        this.state.d4 ? this.d4NextPlayerPtr = this.movePointer() : ''
        break
      case 'skp':
        this.setAction(this.state.d4 ? 'penalty' : 'onturn')
        this.state.d4 ? this.addPenalty(2) : ''
        this.state.d4 ? this.deck.pickPenalty(this.penalty) : ''
        this.state.d4 ? this.d4NextPlayerPtr = this.movePointer(2) : ''
        break
      case 'clr':
        this.setAction('onturn')
        break
      case 'clg':
        this.setAction('challenge')
        break
      case 'D4':
        this.setAction('onturn')
        this.addPenalty(4)
        this.d4ColorCallerPtr = this.pointer
        this.setState(card.color, card.symbol, false, true)
        break
      case 'D2':
        this.setAction('onturn')
        this.addPenalty(2)
        this.setState(card.color, card.symbol, true, false)
        break
      case 'C':
        this.setAction('callColor')
        break
      case 'R':
        this.reversePointer()
        this.setState(card.color, card.symbol, false, false)
        break
      case 'S':
        this.setAction('skip')
        this.setState(card.color, card.symbol, false, false)
        break
      default:
        this.setAction('onturn')
        this.setState(card.color, card.symbol, false, false)
        break
    }
  }

  pushPointer (card) {
    switch (card.symbol) {
      case 'pnb':
        break
      case 'pno':
        this.state.d4
          ? this.pointer = this.d4ColorCallerPtr
          : this.pointer = this.movePointer()
        break
      case 'pas':
        break
      case 'clr':
        this.state.d4
          ? this.pointer = this.d4NextPlayerPtr
          : this.pointer = this.movePointer()

        // FIXME: must clear d4 state after pointer moved
        this.setState(card.color, null, null, false)
        break
      case 'clg':
        this.pointer = this.movePointer(-1)
        break
      case 'C':
        break
      default:
        this.pointer = this.movePointer()
    }
  }

  toss (cards) {
    if (cards[0].isEntityCard()) this.deck.toss(cards)
  }
}

module.exports = Uno
