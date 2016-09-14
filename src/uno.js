// currentState.action = ['onturn', 'pass', 'color', 'challenge', 'penalty']

function padRight (string, num) {
  if (string.constructor !== String) string = string.toString()
  if (string.length >= num) return string

  return string.concat(' '.repeat(num - string.length))
}

function padLeft (string, num) {
  if (string.constructor !== String) string = string.toString()
  if (string.length >= num) return string

  return ' '.repeat(num - string.length).concat(string)
}

class Card {
  constructor (color, symbol, wild) {
    this.color = color
    this.symbol = symbol
    this.wild = wild
    this.legal = false
  }

  // 用于标识罚牌阶段结束（被罚牌后返回）
  static penalty () {
    return new Card('', 'pnt', '')
  }

  // 用于标识弃权（无牌可出/故意放弃 => 罚摸）
  static pass () {
    return new Card('', 'pas', '')
  }

  // 用于标识被跳过（上家出禁牌）
  static skip () {
    return new Card('', 'skp', '')
  }

  // 用于标志换色（响应换色牌）
  static color (color) {
    return new Card(color, 'clr', '')
  }

  isLegal (currentState) {
    if (currentState.d4) {
      return this.symbol === 'D4'
    }

    if (currentState.d2) {
      if (['R', 'S', 'D2'].indexOf(this.symbol) !== -1) {
        return this.color === currentState.color
      } else {
        return this.symbol === 'D4'
      }
    }

    if (this.symbol === 'C') {
      // return ['R', 'S', 'D2'].indexOf(currentState.symbol) === -1
      return true
    }

    return this.color === currentState.color ||
           this.symbol === currentState.symbol
  }

  getScore () {
    if (this.symbol === 'D4') return 50
    if (this.symbol === '0') return 10
    if (['R', 'S', 'C', 'D2'].indexOf(this.symbol) !== -1) return 20
    return parseInt(this.symbol)
  }

  toString () {
    let color = padRight(this.color, 6)
    let symbol = padRight(this.symbol, 3)
    let wild = this.wild ? 'true ' : 'false'
    return `Card=[Color: ${color} , Symbol: ${symbol} , Wild: ${wild}]`
  }

  toShortenString () {
    return `${this.color} ${this.symbol}`
  }
}

class Deck {
  constructor () {
    this.deck = []
    this.discards = []
    this.penalties = []
    this.NUM_HAND = 7
  }

  static shuffle (deck) {
    var cache = deck.map(c => c)
    deck.length = 0

    let l = cache.length
    let c
    while (l-- > 0) {
      let m = Math.round(Math.random() * (cache.length - 1), 0)
      let n = Math.round(Math.random() * (cache.length - 1), 0)

      c = cache[m]
      cache[m] = cache[n]
      cache[n] = c
    }

    cache.forEach(c => { deck.push(c) })
  }

  gen () {
    this.deck.length = 0
    this.discards.length = 0
    this.penalties.length = 0

    let symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'S', 'D2']
    let wilds = ['C']//, 'D4']
    let colors = ['red', 'yellow', 'green', 'blue']

    symbols.forEach(s => {
      colors.forEach(c => {
        if (s !== '0') this.deck.push(new Card(c, s, false))
        this.deck.push(new Card(c, s, false))
      })
    })
    wilds.forEach(w => {
      colors.forEach(c => {
        this.deck.push(new Card('', w, true))
      })
    })

    Deck.shuffle(this.deck)

    // TEST
    // this.deck.forEach(c => console.log(c.toString()))
  }

  init () {
    this.gen()
    this.pickFirst()
  }

  pickFirst () {
    while (this.discards.length === 0) {
      let first = this.deck.splice(0, 1)[0]

      if (first.wild) {
        this.deck.push(first)
      } else {
        this.discards.push(first)
        return first
      }
    }
  }

  pickPenalty (num) {
    if (num > this.deck.length) {
      Deck.shuffle(this.discards)
      this.deck.push(...this.discards)
      this.discards.length = 0
    }

    this.penalties.push(...this.deck.splice(0, num))
  }

  clearPenalty (num = 0) {
    this.penalties.length = 0
    if (num !== 0) {
      this.pickPenalty(num)
    }
  }

  deal (playerNumber) {
    return Array(playerNumber).fill(0).map(
      p => this.deck.splice(0, this.NUM_HAND)
    )
  }

  toss (cards) {
    this.discards.push(...cards)
  }

}

class Player {
  constructor () {
    this.cards = []
    this.lastCard = {}
  }

  init (cards) {
    this.cards = cards
  }

  move (state, penalties) {
    switch (state.action) {
      case 'penalty':
        this.cards.push(...penalties)
        return [Card.penalty()]
      case 'skip':
        let skips = this.cards.filter(c => c.symbol === 'S')
        let skip
        if (skips.length > 0) {
          skip = this.applyStrategy(skips)
          this.toss(skips)
        } else {
          skip = [Card.skip()]
        }
        return skip
      case 'callColor':
        return [Card.color(this.callColor())]
      default:
        this.cards.forEach(c => { c.legal = c.isLegal(state) })
        let legalCards = this.cards.filter(c => c.legal)

        let cards
        if (legalCards.length > 0) {
          cards = this.applyStrategy(legalCards)
          this.toss(cards)
        } else {
          cards = [Card.pass()]
        }

        return cards
    }
  }

  applyStrategy (legalCards) {
    // TODO:
    let card = legalCards.splice(0, 1)
    let card2 = this.hasDuplicates(legalCards, card[0])

    if (card2.length !== 0) {
      return card.concat(card2)
    } else {
      return card
    }
  }

  hasDuplicates (deck, card) {
    return deck.filter(c => c.symbol === card.symbol && c.color === card.color)
  }

  toss (cards) {
    cards.forEach(c => {
      let i = this.cards.indexOf(c)
      this.cards.splice(i, 1)
    })
  }

  callColor () {
    // TODO:
    let colors = ['red', 'green', 'blue', 'yellow']
    return colors[Math.floor(Math.random() * 4)]
  }

  getCardsNum () {
    return this.cards.length
  }
}

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
    this.direction = 1
    this.turns = 1
  }

  start () {
    this.initDeck()
    this.initState()
    this.deal()

    this.loop()
  }

  initDeck () {
    this.deck = new Deck()
    this.deck.gen()
  }

  initState () {
    this.currentCard = this.deck.pickFirst()
    this.state.color = this.currentCard.color
    this.state.symbol = this.currentCard.symbol
  }

  deal () {
    this.deck.deal(this.players.length)
             .forEach((p, i) => { this.players[i].init(p) })
  }

  printServerState () {
    let handNum = padLeft(this.players.reduce((s, p) => s + p.cards.length, 0), 3)
    let deckNum = padLeft(this.deck.deck.length, 3)
    let discardsNum = padLeft(this.deck.discards.length, 3)
    let penaltyNum = padLeft(this.deck.penalties.length, 3)
    let sum = padLeft(parseInt(handNum) + parseInt(deckNum) + parseInt(discardsNum) + parseInt(penaltyNum), 3)

    let d4 = this.state.d4 ? 'true ' : 'false'
    let d2 = this.state.d2 ? 'true ' : 'false'
    let color = padRight(this.state.color, 7)
    let symbol = padRight(this.state.symbol, 3)
    let action = this.state.action

    console.log(`Server[${handNum}][${deckNum}][${discardsNum}][${penaltyNum}][${sum}]: State[Color: ${color}, Symbol: ${symbol}, +4: ${d4}, +2: ${d2} ] Action[${action}]`)
  }

  printPlayerDeal (cards) {
    let card = cards[0]
    let turn = padLeft(this.turns, 3)
    let player = this.players[this.pointer]
    let handNum = padLeft(player.cards.length, 3)
    let head = padLeft(`[${turn}]Player(${this.pointer})  [${handNum}]`, 31)
    let handCards = player.cards.reduce((s, c) => `${s + c.toShortenString()}, `, '')
    console.log(`${head}: ${card.toString()} * ${cards.length} [${handCards}]`)
  }

  printResult () {
    console.log('--------RESULT--------')

    this.players.forEach((p, i) => {
      if (p.cards.length === 0) {
        console.log(`Player(${i}): Winner`)
      } else {
        let score = padRight(p.cards.reduce((s, c) => s + c.getScore(), 0), 3)
        let cards = p.cards.reduce((s, c) => `${s + c.toShortenString()}, `, '')
        console.log(`Player(${i}): ${score} ${cards}`)
      }
    })
  }

  movePointer () {
    this.direction === 1
      ? this.pointer++
      : this.pointer--

    if (this.pointer === this.players.length) this.pointer = 0
    if (this.pointer === -1) this.pointer = this.players.length - 1
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

  loop () {
    while (this.state.action !== 'end' && this.turns < 1000) {
      // this.printServerState()

      let currentPlayer = this.players[this.pointer]
      let playerDeals = currentPlayer.move(
        this.state,
        this.deck.penalties
      )

      this.printPlayerDeal(playerDeals)

      if (currentPlayer.cards.length === 0) {
        this.state.action = 'end'
        this.printResult()
      } else {
        this.pushState(playerDeals)
        this.currentCard = playerDeals[0]
        this.turns++
      }
    }
  }

  pushState (cards) {
    let card = cards[0]

    switch (card.symbol) {
      case 'pnt':
        this.deck.clearPenalty()
        this.clearPenalty()
        this.state.action = 'onturn'
        this.state.d4 = false
        this.state.d2 = false
        this.movePointer()
        break
      case 'pas':
        this.deck.pickPenalty(this.penalty)
        this.state.action = 'penalty'
        break
      case 'skp':
        this.state.action = 'onturn'
        this.movePointer()
        break
      case 'clr':
        this.state.action = 'onturn'
        this.state.color = card.color
        this.state.symbol = card.symbol
        this.movePointer()
        break
      case 'C':
        this.state.action = 'callColor'
        this.deck.toss(cards)
        break
      case 'R':
        this.reversePointer()
        this.state.color = card.color
        this.state.symbol = card.symbol
        this.deck.toss(cards)
        this.movePointer()
        break
      case 'S':
        this.state.action = 'skip'
        this.state.color = card.color
        this.state.symbol = card.symbol
        this.deck.toss(cards)
        this.movePointer()
        break
      case 'D2':
        this.state.action = 'onturn'
        this.state.d4 = false
        this.state.d2 = true
        this.state.color = card.color
        this.state.symbol = card.symbol
        this.addPenalty(2)
        this.deck.toss(cards)
        this.movePointer()
        break
      default:
        this.state.action = 'onturn'
        this.state.d4 = false
        this.state.d2 = false
        this.state.color = card.color
        this.state.symbol = card.symbol
        this.deck.toss(cards)
        this.movePointer()
        break
    }
  }
}

export {Player, Uno}
