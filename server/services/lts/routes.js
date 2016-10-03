const flow = require('../../utils/async.js').flow
const reply = (require('../../utils/response.js'))('LTS ')
const express = require('express')
const router = express.Router()
const playerSchema = require('./schema.player.js')

for (let method in playerSchema) {
  router.post(`/${method}`, ({ body }, res) => {
    flow(function* () {
      try {
        let result = yield playerSchema[method](body)
        reply(0, result, res)
      } catch (e) {
        reply(-1, e, res)
      }
    })
  })
}

module.exports = router
