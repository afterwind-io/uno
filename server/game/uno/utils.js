module.exports.padRight = (string, num) => {
  if (string.constructor !== String) string = string.toString()
  if (string.length >= num) return string

  return string.concat(' '.repeat(num - string.length))
}

module.exports.padLeft = (string, num) => {
  if (string.constructor !== String) string = string.toString()
  if (string.length >= num) return string

  return ' '.repeat(num - string.length).concat(string)
}
