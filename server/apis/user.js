let express = require('express')
let router = express.Router()
let player = require('../schemas/player.js')
let response = require('../utils/response.js')

router.post('/register', function (req, res) {
  player.register({
    username: req.body.username,
    password: req.body.password
  }, function (result) {
    response.reply(result, res)
  })
})

router.post('/login', function (req, res) {
  player.login({
    username: req.body.username,
    password: req.body.password,
    session: req.session
  }, function (result) {
    response.reply(result, res)
  })
})

router.post('/logout', function (req, res) {
  player.logout({
    session: req.session
  }, function (result) {
    response.reply(result, res)
  })
})

module.exports = router
