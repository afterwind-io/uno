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

class Dice {
  static roll (rate) {
    return 1 / rate - Math.random() > 0
  }
}

class Card {
  constructor (color, symbol) {
    this.color = color
    this.symbol = symbol
    this.legal = false
    this.ACTION_TYPE = ['R', 'S', 'C', 'D2', 'D4']
    this.VIRTUAL_TYPE = ['pnb', 'pno', 'pas', 'skp', 'clr', 'clg']
  }

  // 用于标识返回罚牌（被罚牌后立即出罚牌）
  static penaltyBack () {
    return new Card('', 'pnb')
  }

  // 用于标识罚牌阶段结束（被罚牌后返回）
  static penaltyOver () {
    return new Card('', 'pno')
  }

  // 用于标识弃权（无牌可出/故意放弃 => 罚摸）
  static pass () {
    return new Card('', 'pas')
  }

  // 用于标识被跳过（上家出禁牌）
  static skip () {
    return new Card('', 'skp')
  }

  // 用于标志换色（响应换色牌）
  static color (color) {
    return new Card(color, 'clr')
  }

  static challenge () {
    return new Card('', 'clg', '')
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

    if (this.symbol === 'D4') {
      return true
    }

    if (this.symbol === 'C') {
      // return ['R', 'S', 'D2'].indexOf(currentState.symbol) === -1
      return true
    }

    return this.color === currentState.color ||
           this.symbol === currentState.symbol
  }

  isActionCard () {
    return this.ACTION_TYPE.indexOf(this.symbol) !== -1
  }

  isEntityCard () {
    return this.VIRTUAL_TYPE.indexOf(this.symbol) === -1
  }

  isSameCard (card) {
    return this.symbol === card.symbol && this.color === card.color
  }

  getScore () {
    if (this.symbol === 'D4') return 50
    if (this.symbol === '0') return 10
    if (this.ACTION_TYPE.indexOf(this.symbol) !== -1) return 20
    return parseInt(this.symbol)
  }

  toString () {
    let color = padRight(this.color, 6)
    let symbol = padRight(this.symbol, 3)
    return `Card=[Color: ${color} , Symbol: ${symbol}]`
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

  static findDuplicates (deck, card) {
    return deck.filter(c => c.isSameCard(card))
  }

  gen () {
    this.deck.length = 0
    this.discards.length = 0
    this.penalties.length = 0

    let symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'S', 'D2']
    let wilds = ['C', 'D4']
    let colors = ['red', 'yellow', 'green', 'blue']

    symbols.forEach(s => {
      colors.forEach(c => {
        if (s !== '0') this.deck.push(new Card(c, s))
        this.deck.push(new Card(c, s))
      })
    })
    wilds.forEach(w => {
      colors.forEach(c => {
        this.deck.push(new Card('', w))
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
    return this.deck.splice(0, 1)[0]
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
      case 'penaltyBack':
        let penalty = this.cards.filter(c => c.legal)
        this.toss(penalty)
        return penalty
      case 'penalty':
        return this.strategyReturnPenalty(state, penalties)
      case 'skip':
        let skips = this.cards.filter(c => c.symbol === 'S')
        let skip
        if (skips.length > 0) {
          skip = this.applyStrategy(skips, state)
          this.toss(skip)
        } else {
          skip = [Card.skip()]
        }
        return skip
      case 'callColor':
        return [Card.color(this.callColor())]
      case 'challenge':
        if (this.checkD4Legal(state.color)) {
          return [Card.skip()]
        } else {
          return [Card.pass()]
        }
      default:
        if (this.cards.length === 1 && this.cards[0].isActionCard()) {
          return [Card.pass()]
        }

        this.cards.forEach(c => { c.legal = c.isLegal(state) })
        let legalCards = this.cards.filter(c => c.legal)

        let cards
        if (legalCards.length > 0) {
          cards = this.applyStrategy(legalCards, state)
          this.toss(cards)
        } else {
          cards = [Card.pass()]
        }

        return cards
    }
  }

  applyStrategy (legalCards, state) {
    let d4 = legalCards.filter(c => c.symbol === 'D4')[0]

    if (state.d4) {
      // TODO
      // 挑战率过低
      let r = Dice.roll(2)
      let result = d4 ? r ? [d4] : [Card.challenge()]
                      : r ? [Card.pass()] : [Card.challenge()]
      return result
    } else {
      if (d4) legalCards.splice(legalCards.indexOf(d4), 1)
      if (legalCards.length === 0) return [d4]

      let r = Dice.roll(2)

      let normal
      let card = legalCards.splice(0, 1)
      let card2 = legalCards.length > 1
        ? Deck.findDuplicates(legalCards, card[0])
        : []

      if (card2.length !== 0) {
        normal = card.concat(card2)
      } else {
        normal = card
      }

      let result = d4 ? r ? [d4] : normal
                      : normal
      return result
    }
  }

  strategyReturnPenalty (state, penalties) {
    if (!state.d4 && !state.d2) {
      let penalty = penalties[0]

      if (!penalty.isActionCard() && penalty.isLegal(state)) {
        this.cards.push(penalty)

        if (Dice.roll(2)) {
          this.cards.forEach(c => { c.legal = false })
          penalty.legal = true
          return [Card.penaltyBack()]
        } else {
          return [Card.penaltyOver()]
        }
      }
    }

    this.cards.push(...penalties)
    return [Card.penaltyOver()]
  }

  toss (cards) {
    cards.forEach(c => {
      let i = this.cards.indexOf(c)
      if (i !== -1) this.cards.splice(i, 1)
    })
  }

  callColor () {
    // TODO:

    // Strategy 1
    let max = {name: '', value: 0}
    let colors = {'red': 0, 'green': 0, 'blue': 0, 'yellow': 0}
    this.cards.forEach(c => {
      colors[c.color] += c.getScore()
    })
    Object.keys(colors).forEach(c => {
      if (colors[c] > max.value) max.name = c
    })
    return max.name

    // Strategy 2
    // let colors = ['red', 'green', 'blue', 'yellow']
    // return colors[Math.floor(Math.random() * 4)]
  }

  getCardsNum () {
    return this.cards.length
  }

  checkD4Legal (color) {
    return this.cards.map(c => c.color).indexOf(color) === -1
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
    this.d4ColorCallerPtr = -1
    this.d4NextPlayerPtr = -1
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
    this.pushState(this.currentCard)
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

  loop () {
    while (this.state.action !== 'end' && this.turns < 1000) {
      this.printServerState()

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
        this.currentCard = playerDeals[0]
        this.pushState(this.currentCard)
        this.pushPointer(this.currentCard)
        this.toss(playerDeals)
        this.turns++
      }
    }
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

export {Player, Uno}
