var express = require('express')
var router = express.Router()
var player = require('../schemas/player.js')
var response = require('../utils/response.js')

router.post('/register', function (req, res) {
  player.register({
    username: req.body.username,
    password: req.body.password
  }, function (result) {
    response.reply(result, res)
  })
})

router.post('/login', function (req, res) {
  console.log(req.session)
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
