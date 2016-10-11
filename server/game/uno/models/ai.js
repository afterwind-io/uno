const Dice = require('./dice.js')
const Card = require('./card.js')
const Deck = require('./deck.js')

function move (state, cards, penalties) {
  switch (state.action) {
    case 'penaltyBack':
      let penalty = cards.filter(c => c.legal)
      return penalty
    case 'penalty':
      return strategyReturnPenalty(state, cards, penalties)
    case 'skip':
      let skips = cards.filter(c => c.symbol === 'S')
      let skip
      if (skips.length > 0) {
        skip = applyStrategy(skips, state)
      } else {
        skip = [Card.skip()]
      }
      return skip
    case 'callColor':
      return [Card.color(callColor(cards))]
    case 'challenge':
      if (checkD4Legal(cards, state.color)) {
        return [Card.skip()]
      } else {
        return [Card.pass()]
      }
    default:
      if (cards.length === 1 && cards[0].isActionCard()) {
        return [Card.pass()]
      }

      cards.forEach(c => { c.legal = c.isLegal(state) })
      let legalCards = cards.filter(c => c.legal)

      let deals
      if (legalCards.length > 0) {
        deals = applyStrategy(legalCards, state)
      } else {
        deals = [Card.pass()]
      }

      return deals
  }
}

function applyStrategy (legalCards, state) {
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

function strategyReturnPenalty (state, cards, penalties) {
  if (!state.d4 && !state.d2) {
    let penalty = penalties[0]

    if (!penalty.isActionCard() && penalty.isLegal(state)) {
      cards.push(penalty)

      if (Dice.roll(2)) {
        cards.forEach(c => { c.legal = false })
        penalty.legal = true
        return [Card.penaltyBack()]
      } else {
        return [Card.penaltyOver()]
      }
    }
  }

  cards.push(...penalties)
  return [Card.penaltyOver()]
}

function callColor (cards) {
  // TODO:

  // Strategy 1
  let max = {name: '', value: 0}
  let colors = {'red': 0, 'green': 0, 'blue': 0, 'yellow': 0}
  cards.forEach(c => {
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

function checkD4Legal (cards, color) {
  return cards.map(c => c.color).indexOf(color) === -1
}

module.exports = { move }
