const flow = require('../../utils/async.js').flow
const reply = (require('../../utils/response.js'))('AUTH')
const express = require('express')
const router = express.Router()
const redisAuth = require('./redis.auth.js')

for (let method in redisAuth) {
  router.post(`/${method}`, ({ body }, res) => {
    flow(function* () {
      try {
        let result = yield redisAuth[method](body)
        reply(0, result, res)
      } catch (e) {
        reply(-1, e, res)
      }
    })
  })
}

module.exports = router
