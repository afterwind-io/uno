const flow = require('../../../utils/async.js').flow

const express = require('express')
const router = express.Router()
const response = require('../../../utils/response.js')

const proxyLTS = (require('../proxy.js'))('lts')
const proxyPlayer = (require('../proxy.js'))('player')
const proxyRoom = (require('../proxy.js'))('room')

// router.post('/register', function (req, res) {
//   flow(function* () {
//     try {
//       let playerInfo = yield playerSchema.register({
//         username: req.body.username,
//         password: req.body.password,
//         session: req.session
//       })
//
//       let player = yield redisPlayer.create(playerInfo)
//       yield redisRoom.addPlayer(0, player._gid)
//
//       response.reply(0, { player }, res)
//     } catch (e) {
//       response.reply(-1, e, res)
//     }
//   })
// })

router.post('/login', function (req, res) {
  flow(function* () {
    try {
      let playerInfo = yield proxyLTS('get', {
        name: req.body.username
      })

      // if(playerInfo.password !== req.body.password){
      //   throw new Error('用户名或密码不正确')
      // }

      let player = yield proxyPlayer('create', playerInfo)

      yield proxyRoom('addPlayer', {
        roomId: 0,
        gid: player._gid
      })

      response.reply(0, { player }, res)
    } catch (e) {
      response.reply(-1, e, res)
    }
  })
})

module.exports = router
