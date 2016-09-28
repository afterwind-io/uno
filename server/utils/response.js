module.exports = {
  reply: function (code, content, res) {
    if (code === -1) {
      console.log(`[response][err]${JSON.stringify(content)}`)
      res.status(500).json({
        code,
        content: `${content.name}: ${content.message} ${content.stack}`
      })
    } else {
      console.log(`[response][ok]${JSON.stringify(content)}`)
      res.json(content)
    }
  }
}
