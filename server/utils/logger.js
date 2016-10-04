function pad (num) {
  return '' + (num < 10 ? '0' + num : num)
}

module.exports = (msg) => {
  let time = new Date()
  let year = time.getFullYear()
  let month = pad(time.getMonth() + 1)
  let date = pad(time.getDate())
  let hour = pad(time.getHours())
  let minute = pad(time.getMinutes())
  let second = pad(time.getSeconds())

  console.log(
    `[${year}-${month}-${date} ${hour}:${minute}:${second}]${msg}`
  )
}
