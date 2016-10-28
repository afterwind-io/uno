const flow = require('../../../utils/async.js').flow

const express = require('express')
const router = express.Router()
const reply = (require('../../../utils/response.js'))('room')

const proxyPlayer = (require('../proxy.js'))('player')
const proxyRoom = (require('../proxy.js'))('room')
const proxyWS = (require('../proxy.js'))('ws')

router.post('/create', (
  { body }, res
) => {
  flow(function* () {
    try {
      let room = yield proxyRoom('create', body)
      reply(0, room, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/join', (
  { body, session }, res
) => {
  flow(function* () {
    try {
      let oldRoomId = yield proxyPlayer('changeRoom', {
        uid: session.uid,
        roomId: body.roomId
      })
      yield proxyRoom('addPlayer', {
        roomId: body.roomId,
        uid: session.uid
      })
      yield proxyRoom('remPlayer', {
        roomId: oldRoomId,
        uid: session.uid
      })

      let room = yield proxyRoom('get', {
        roomId: body.roomId
      })
      let players = yield proxyPlayer('getMany', {
        uids: room.players
      })
      room.players = players

      yield proxyWS('updateOnlineStatus')
      yield proxyWS('updateRoomStatus', players)

      reply(0, room, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/leave', (
  { body, session }, res
) => {
  flow(function* () {
    try {
      let oldRoomId = yield proxyPlayer('changeRoom', {
        uid: session.uid,
        roomId: 0
      })
      yield proxyRoom('addPlayer', {
        roomId: 0,
        uid: session.uid
      })
      yield proxyRoom('remPlayer', {
        roomId: oldRoomId,
        uid: session.uid
      })

      if (oldRoomId !== 0) {
        let room = yield proxyRoom('get', {
          roomId: oldRoomId
        })
        if (room.players.length === 0) {
          yield proxyRoom('remove', {
            roomId: oldRoomId
          })
        } else {
          let players = yield proxyPlayer('getMany', {
            uids: room.players
          })
          yield proxyWS('updateRoomStatus', players)
        }
      }

      yield proxyWS('updateOnlineStatus')

      reply(0, {}, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

router.post('/getRooms', (
  { body }, res
) => {
  flow(function* () {
    try {
      let rooms = yield proxyRoom('getMany', body)
      reply(0, rooms, res)
    } catch (e) {
      reply(-1, e, res)
    }
  })
})

module.exports = router
