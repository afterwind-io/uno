const flow = require('../../../utils/async.js').flow

const express = require('express')
const router = express.Router()
const reply = (require('../../../utils/response.js'))('user')

const proxyAuth = (require('../proxy.js'))('auth')
const proxyLTS = (require('../proxy.js'))('lts')
const proxyPlayer = (require('../proxy.js'))('player')
const proxyRoom = (require('../proxy.js'))('room')
const proxyWS = (require('../proxy.js'))('ws')

router.post('/register', (
  { body, session }, res
) => {
  flow(function* () {
    try {
      let playerInfo = yield proxyLTS('create', {
        name: body.name,
        password: body.password
      })

      let player = yield proxyPlayer('create', playerInfo)
      yield proxyRoom('addPlayer', {
        roomId: 0,
        uid: player.uid
      })

      yield proxyAuth('add', {
        uid: player.uid
      })
      session.uid = player.uid

      yield proxyWS('updateOnlineStatus')

      reply(0, player, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/login', (
  { body, session }, res
) => {
  flow(function* () {
    try {
      let playerInfo = yield proxyLTS('get', {
        name: body.name
      })

      if (playerInfo.password !== body.password) {
        throw new Error('用户名或密码不正确')
      }

      let player = yield proxyPlayer('get', playerInfo)
      if (!player.uid) player = yield proxyPlayer('create', playerInfo)

      yield proxyRoom('addPlayer', {
        roomId: 0,
        uid: player.uid
      })

      yield proxyAuth('add', {
        uid: player.uid
      })
      session.uid = player.uid

      yield proxyWS('updateOnlineStatus')

      reply(0, player, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/logout', (
  { session }, res
) => {
  flow(function* () {
    try {
      let uid = session.uid

      let player = yield proxyPlayer('remove', { uid })
      yield proxyRoom('remPlayer', {
        roomId: player.roomId,
        uid
      })

      if (player.roomId !== 0) {
        let room = yield proxyRoom('get', {
          roomId: player.roomId
        })
        if (room.players.length === 0) {
          yield proxyRoom('remove', {
            roomId: player.roomId
          })
        }
      }

      yield proxyAuth('remove', {
        uid: player.uid
      })
      session.uid = ''

      yield proxyWS('updateOnlineStatus')

      reply(0, {}, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/getOnlinePlayers', (
  { body }, res
) => {
  flow(function* () {
    try {
      let players = yield proxyPlayer('getAll', body)
      reply(0, players, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/switchStateIdle', (
  { body }, res
) => {
  flow(function* () {
    try {
      let player = yield proxyPlayer('changeStatus', {
        uid: body.uid,
        status: 0
      })

      if (player.roomId !== 0) {
        let room = yield proxyRoom('get', {
          roomId: player.roomId
        })
        let players = yield proxyPlayer('getMany', {
          uids: room.players
        })

        yield proxyWS('updateRoomStatus', players)
      }

      reply(0, {}, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/switchStateReady', (
  { body }, res
) => {
  flow(function* functionName () {
    try {
      let player = yield proxyPlayer('changeStatus', {
        uid: body.uid,
        status: 1
      })

      let room = yield proxyRoom('get', {
        roomId: player.roomId
      })
      let players = yield proxyPlayer('getMany', {
        uids: room.players
      })

      yield proxyWS('updateRoomStatus', players)

      reply(0, {}, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/switchStateBusy', (
  { body }, res
) => {
  flow(function* functionName () {
    try {
      yield proxyPlayer('changeStatus', {
        uid: body.uid,
        status: 2
      })

      reply(0, {}, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

module.exports = router
