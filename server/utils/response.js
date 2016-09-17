module.exports = {
  reply: function (code, content, res) {
    if (code === -1) {
      console.log(content)
      res.status(500).json(`${content.name}: ${content.message} ${content.stack}`)
    } else {
      res.json(content)
    }
  }
}
