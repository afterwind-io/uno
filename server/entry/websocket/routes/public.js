const express = require('express')
const router = express.Router()
const reply = (require('../../../utils/response.js'))('ws')

let _io

router.post('/updateOnlineStatus', (req, res) => {
  _io.emit('main', {
    head: 'updateOnlineStatus',
    body: ''
  })
  reply(0, {}, res)
})

module.exports = io => {
  _io = io
  return router
}
