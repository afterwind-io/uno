let flow = require('../utils/async.js').flow
let redisPlayer = require('../redis.player.js')
let redisRoom = require('../redis.room.js')

let express = require('express')
let router = express.Router()
let playerSchema = require('../schemas/player.js')
let response = require('../utils/response.js')

router.post('/register', function (req, res) {
  flow(function* () {
    try {
      let playerInfo = yield playerSchema.register({
        username: req.body.username,
        password: req.body.password,
        session: req.session
      })

      let player = yield redisPlayer.create(playerInfo)
      yield redisRoom.welcome(player)

      response.reply(0, { player }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/login', function (req, res) {
  flow(function* () {
    try {
      let playerInfo = yield playerSchema.login({
        username: req.body.username,
        password: req.body.password,
        session: req.session
      })

      let player = yield redisPlayer.create(playerInfo)
      yield redisRoom.welcome(player)

      response.reply(0, { player }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/logout', function (req, res) {
  flow(function* () {
    try {
      let playerUid = yield playerSchema.logout({ session: req.session })
      let info = yield redisPlayer.clear(playerUid)
      redisRoom.removePlayer(info)
      response.reply(0, {}, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/getOnlinePlayers', function (req, res) {
  flow(function* () {
    try {
      let players = yield playerSchema.getOnlinePlayers()
      response.reply(0, { players }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
