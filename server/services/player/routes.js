const flow = require('../../utils/async.js').flow
const response = require('../../utils/response.js')
const express = require('express')
const router = express.Router()
const redisPlayer = require('./redis.player.js')

router.post('/create', (req, res) => {
  flow(function* () {
    try {
      let result = yield redisPlayer.create(req.body.info)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/clear', (req, res) => {
  flow(function* () {
    try {
      let result = yield redisPlayer.clear(req.body.info.uids)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/getPlayers', (req, res) => {
  flow(function* () {
    try {
      let result = yield redisPlayer.getPlayers(req.body.info.gids)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/getAllPlayers', (req, res) => {
  flow(function* () {
    try {
      let result = yield redisPlayer.getAllPlayers(
        req.body.info.min, req.body.info.max
      )
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/changeRoom', (req, res) => {
  flow(function* () {
    try {
      let result = yield redisPlayer.changeRoom(
        req.body.info.gid, req.body.info.roomId
      )
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
