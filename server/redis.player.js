let flow = require('./utils/async.js').flow

let Redis = require('ioredis')
let redis = new Redis({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  db: 0
})

const playerStatus = {
  idle: 0,
  ready: 1,
  busy: 2
}

class Player {
  constructor (pid, info) {
    this._uid = info._uid
    this._pid = pid
    this._gid = `${this._pid}:${this._uid}`
    this.name = info.name
    this.status = info.status || playerStatus.idle
    this.roomId = 0
  }

  toString () {
    return JSON.stringify(this)
  }

  static parse (str) {
    let o = JSON.parse(str)
    return new Player(o._pid, o)
  }
}

// 产生id计数器
redis.set('idGen', 0)

module.exports = {
  create (playerInfo) {
    return flow(function* () {
      let id = yield redis.incr('idGen')
      let player = new Player(id, playerInfo)
      yield redis.set(player._gid, player.toString())
      return player
    })
  },
  clear (playerUid) {
    return flow(function* () {
      let keys = yield redis.keys(`*${playerUid}`)
      let key = keys[0]
      let info = yield redis.get(key)
      yield redis.del(key)
      return Player.parse(info)
    })
  },
  getPlayers (playerGids) {
    return flow(function* () {
      let s = yield redis.mget(playerGids)
      return s.map(p => {
        let player = Player.parse(p)
        return player
      })
    })
  },
  changeRoom (playerGid, roomId) {
    return flow(function* () {
      let s = yield redis.get(playerGid)
      let player = Player.parse(s)

      if (player.status !== playerStatus.idle) {
        throw new Error('该玩家正在游戏中，无法切换房间')
      }

      let oldId = player.roomId
      player.roomId = roomId
      yield redis.set(player._gid, player.toString())
      return oldId
    })
  }
}
