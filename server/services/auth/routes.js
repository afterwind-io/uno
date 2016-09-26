const flow = require('../../utils/async.js').flow
const response = require('../../utils/response.js')
const express = require('express')
const router = express.Router()
const redisAuth = require('./redis.auth.js')

router.post('add', (req, res) => {
  flow(function* () {
    try {
      let result = yield redisAuth.add(req.body.info)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('remove', (res, req) => {
  flow(function* () {
    try {
      let result = yield redisAuth.remove(req.body.info)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('check', (res, req) => {
  flow(function* () {
    try {
      let result = yield redisAuth.check(req.body.info)
      response.reply(0, { result }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
