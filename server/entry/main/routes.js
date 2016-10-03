const express = require('express')
const router = express.Router()
const apiUser = require('./routes/user.js')
const apiRoom = require('./routes/room.js')

router.use('/api/user', apiUser)
router.use('/api/room', apiRoom)
module.exports = router
