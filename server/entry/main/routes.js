const express = require('express')
const router = express.Router()
const api_user = require('./routes/user.js')
// const api_room = require('./routes/room.js')

router.use('/api/user', api_user)
// app.use('/api/room', api_room)
module.exports = router
