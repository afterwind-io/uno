let flow = require('../utils/async.js').flow
let redisPlayer = require('../redis.player.js')
let redisRoom = require('../redis.room.js')

let express = require('express')
let router = express.Router()
let response = require('../utils/response.js')

router.post('/getAll', (req, res) => {
  flow(function* () {
    try {
      let rooms = yield redisRoom.getRooms()
      response.reply(0, { rooms }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/create', (req, res) => {
  flow(function* () {
    try {
      let room = yield redisRoom.create(req.body)
      response.reply(0, { room }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/join', (req, res) => {
  flow(function* () {
    try {
      let oldRoomId = yield redisPlayer.changeRoom(req.body.gid, req.body.roomId)
      yield redisRoom.removePlayer(oldRoomId, req.body.gid)
      yield redisRoom.addPlayer(req.body.roomId, req.body.gid)

      let room = yield redisRoom.getRoom(req.body.roomId)
      let players = yield redisPlayer.getPlayers(room.players)
      room.players = room.players.map(gid => {
        return players.find(p => p.gid === gid)
      })

      response.reply(0, { room }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/leave', (req, res) => {
  flow(function* () {
    try {
      let oldRoomId = yield redisPlayer.changeRoom(req.body.gid, 0)
      yield redisRoom.removePlayer(oldRoomId, req.body.gid)
      yield redisRoom.addPlayer(0, req.body.gid)

      // let room = yield redisRoom.getRoom(0)
      response.reply(0, {}, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
