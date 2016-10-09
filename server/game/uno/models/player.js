const Dice = require('./dice.js')
const Card = require('./card.js')
const Deck = require('./deck.js')

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

export { Player }
