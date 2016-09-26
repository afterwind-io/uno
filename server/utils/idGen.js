exports.idGen = function (length = 8) {
  return Array(length).fill(0).reduce((s, c) => {
    let r = Math.floor(Math.random() * 36)
    r += r < 10 ? 48 : 87
    return s + String.fromCharCode(r)
  }, '')
}
