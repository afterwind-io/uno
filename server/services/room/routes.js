const flow = require('../../utils/async.js').flow
const response = require('../../utils/response.js')
const express = require('express')
const router = express.Router()
const redisRoom = require('./redis.room.js')

router.post('/create', (req, res) => {
  flow(function* () {
    try {
      let result = redisRoom.create(req.body)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/remove', (req, res) => {
  flow(function* () {
    try {
      let result = redisRoom.remove(req.body)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/addPlayer', (req, res) => {
  flow(function* () {
    try {
      let result = redisRoom.addPlayer(req.body)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/removePlayer', (req, res) => {
  flow(function* () {
    try {
      let result = redisRoom.removePlayer(req.body)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/getRooms', (req, res) => {
  flow(function* () {
    try {
      let result = redisRoom.getRooms(req.body)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/getRoom', (req, res) => {
  flow(function* () {
    try {
      let result = redisRoom.getRoom(req.body)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
