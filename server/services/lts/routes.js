const flow = require('../../utils/async.js').flow
const response = require('../../utils/response.js')
const express = require('express')
const router = express.Router()
const playerSchema = require('./schema.player.js')

router.post('/create', (req, res) => {
  flow(function* () {
    try {
      let player = yield playerSchema.create(req.body.info)
      response.reply(0, { player }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/get', (req, res) => {
  flow(function* () {
    try {
      let player = yield playerSchema.get(req.body.info)
      response.reply(0, { player }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

router.post('/update', (req, res) => {
  flow(function* () {
    try {
      let player = yield playerSchema.update(req.body.info)
      response.reply(0, { player }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
