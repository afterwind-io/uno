const text = require('../utils.js')
const ACTION_TYPE = ['R', 'S', 'C', 'D2', 'D4']
const VIRTUAL_TYPE = ['pnb', 'pno', 'pas', 'skp', 'clr', 'clg']

class Card {
  constructor (color, symbol) {
    this.color = color || ''
    this.symbol = symbol
    this.legal = false
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

  // 用于标识换色（响应换色牌）
  static color (color) {
    return new Card(color, 'clr')
  }

  // 用于标识挑战d4
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
    return ACTION_TYPE.indexOf(this.symbol) !== -1
  }

  isEntityCard () {
    return VIRTUAL_TYPE.indexOf(this.symbol) === -1
  }

  isSameCard (card) {
    return this.symbol === card.symbol && this.color === card.color
  }

  getScore () {
    if (this.symbol === 'D4') return 50
    if (this.symbol === '0') return 10
    if (ACTION_TYPE.indexOf(this.symbol) !== -1) return 20
    return parseInt(this.symbol)
  }

  toString () {
    let color = text.padRight(this.color, 6)
    let symbol = text.padRight(this.symbol, 3)
    return `Card=[Color: ${color} , Symbol: ${symbol}]`
  }

  toShortenString () {
    return `${this.color} ${this.symbol}`
  }
}

module.exports = Card
