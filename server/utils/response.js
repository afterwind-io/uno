module.exports = source => {
  return (code, content, res) => {
    let time = new Date()
    let timestamp =
      `[${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ` +
      `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`

    if (code === -1) {
      console.log(timestamp + `[${source}] => [err] ${JSON.stringify(content)}`)
      res.status(500).json({
        code,
        content: `${content.name}: ${content.message} ${content.stack}`
      })
    } else {
      console.log(timestamp + `[${source}] => [ok ] ${JSON.stringify(content)}`)
      res.json(content)
    }
  }
}
