module.exports = {
  reply: function (info, res) {
    if (info.code === -1) {
      res.status(500).json(info.msg)
    } else {
      res.json(info.msg)
    }
  }
}
