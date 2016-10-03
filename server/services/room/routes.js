const flow = require('../../utils/async.js').flow
const reply = (require('../../utils/response.js'))('ROOM')
const express = require('express')
const router = express.Router()
const redisRoom = require('./redis.room.js')

for (let method in redisRoom) {
  router.post(`/${method}`, ({ body }, res) => {
    flow(function* () {
      try {
        let result = yield redisRoom[method](body)
        reply(0, result, res)
      } catch (e) {
        reply(-1, e, res)
      }
    })
  })
}

module.exports = router
