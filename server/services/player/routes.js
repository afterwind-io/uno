const flow = require('../../utils/async.js').flow
const reply = (require('../../utils/response.js'))('PLYR')
const express = require('express')
const router = express.Router()
const redisPlayer = require('./redis.player.js')

for (let method in redisPlayer) {
  router.post(`/${method}`, ({ body }, res) => {
    flow(function* () {
      try {
        let result = yield redisPlayer[method](body)
        reply(0, result, res)
      } catch (e) {
        reply(-1, e, res)
      }
    })
  })
}

module.exports = router
