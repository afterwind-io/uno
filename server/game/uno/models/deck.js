const Card = require('./card.js')

class Deck {
  constructor () {
    this.deck = []
    this.discards = []
    this.penalties = []
    this.NUM_HAND = 7

    this.gen()
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

  pickFirst () {
    let first = this.deck.splice(0, 1)
    this.toss(first)
    return first[0]
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

module.exports = Deck
