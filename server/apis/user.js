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
      yield redisRoom.addPlayer(0, player._gid)

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
      yield redisRoom.addPlayer(0, player._gid)

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
      let player = yield redisPlayer.clear(playerUid)
      yield redisRoom.removePlayer(player.roomId, player._gid)

      let roomRds = yield redisRoom.getRoom(player.roomId)
      if (roomRds.id !== 0 && roomRds.currentPlayersNum === 0) {
        redisRoom.clear(player.roomId)
      }

      response.reply(0, {}, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/getOnlinePlayers', function (req, res) {
  flow(function* () {
    try {
      let players = yield redisPlayer.getAllPlayers(req.body.rangeMin, req.body.rangeMax)
      response.reply(0, { players }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
