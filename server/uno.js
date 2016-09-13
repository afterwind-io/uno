// currentState.action = ['onturn', 'pass', 'color', 'challenge', 'penalty']

class Card {
  constructor (color, symbol, wild) {
    this.color = color
    this.symbol = symbol
    this.wild = wild
  }

  // 用于标识弃权（无牌可出/故意放弃 => 罚摸）
  static pass () {
    return new Card('X', 'X', 'X')
  }

  // 用于标识被跳过（上家出禁牌）
  static skip () {
    return new Card()
  }
}

class Deck {
  constructor () {
    this.deck = []
    this.discards = []
  }

  gen () {
    this.deck.length = 0
    this.discards.length = 0

    let symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'R', 'P', 'DT']
    let wilds = ['C', 'DF']
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
  }

  pickFirst () {
    while (this.discards.length === 0) {
      let first = this.deck.splice(0, 1)

      if (first.wild) {
        this.deck.push(first)
      } else {
        this.discards.push(first)
        return first
      }
    }
  }

  init () {
    this.gen()
    this.pickFirst()
  }

  pushState (card) {
    this.currentCard = card

    if (card.wild) {
      this.currentState.color = '?'
      this.currentState.symbol = card.symbol
      return false
    } else {
      this.currentState.color = card.color
      this.currentState.symbol = card.symbol
      return true
    }
  }
  callColor (color) {
    this.currentState.color = color
  }

  static shuffle (deck) {
    var cache = deck.map(c => c)
    deck.length = 0

    let m = cache.length
    while (m-- > 0) {
      let n = Math.round(Math.random * (cache.length - 1))
      cache = cache.slice(n, cache.length).concat(cache.slice(0, n))
    }
  }

  static isLegal (card, lastCard) {
    if (lastCard.wild) {}
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

  move (action, state, penalties) {
    return Promise.resolve()
  }
}

class Uno {
  constructor (deck, players) {
    this.deck = deck
    this.players = players
    this.currentState = {
      color: '',
      symbol: ''
    }
    this.currentCard = {}
    this.currentAction = ''
    this.pointer = 0
    this.direction = 1
    this.penalty = 1
  }

  init () {
    this.deck.gen()
    this.currentCard = this.deck.pickFirst()
    this.currentState.color = this.currentCard.color
    this.currentState.symbol = this.currentCard.symbol

    this.currentAction = 'onturn'
    this.next()
  }

  loop () {
    while (true) {

    }
  }

  next () {
    this.players[this.pointer].move(
      this.currentAction,
      this.currentState
    )
  }
}

/**
 * 推演
 *
 * 主机  牌（红，5，否） 状（红，5） => 'onturn', pointer+1
 * 玩家1 牌（红，4，否）
 * 主机  牌（红，4，否） 状（红，4） => 'onturn', pointer+1
 * 玩家2 牌（pass）
 * 主机  牌（pass） 状（红，4） => 'penalty', penalty => 1, pointer
 * 玩家2 罚牌, cards + 1
 * 主机  牌（pass） 状（红，4） => 'onturn', pointer+1
 * 玩家3 牌（绿，4，否）
 * 主机  牌（绿，4，否） 状（绿，4） => 'onturn', pointer+1
 * 玩家4 牌（绿，禁，否）
 * 主机  牌（绿，禁，否） 状（绿，禁） => 'pass', pointer+1
 * 玩家5 牌（skip）
 * 主机  牌（skip） 状（绿，禁） => 'onturn', pointer+1
 * 玩家6 牌（绿，转，否）
 * 主机  牌（绿，转，否） 状（绿，禁） => 'onturn', pointer-1
 * 玩家5
 */
