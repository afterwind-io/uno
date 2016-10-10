class Dice {
  static roll (rate) {
    return 1 / rate - Math.random() > 0
  }
}

module.exports = Dice
