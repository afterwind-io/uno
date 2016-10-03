/**
 *  DataBase No: 0
 *  For: Players Data
 *
 *  Data Structure:
 *    "players": ["", "", ...]     uid List        List
 *    "1a2b3c4d": "{...}",         Player Data     String
 *    "5a6b7c8d": "{...}",
 *    ...
 */

let flow = require('../../utils/async.js').flow

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
  constructor (info) {
    this.uid = info.uid
    this.name = info.name
    this.status = info.status || playerStatus.idle
    this.roomId = info.roomId || 0
  }

  toString () {
    return JSON.stringify(this)
  }

  static parse (str) {
    return new Player(JSON.parse(str))
  }
}

module.exports.create = (
  playerInfo
) => flow(function* () {
  let player = new Player(playerInfo)
  yield redis.set(player.uid, player.toString())
  yield redis.lpush('players', player.uid)
  return player
})

module.exports.remove = (
  { uid }
) => flow(function* () {
  let info = yield redis.get(uid)
  yield redis.del(uid)
  yield redis.lrem('players', 0, uid)
  return Player.parse(info)
})

module.exports.get = (
  { uid }
) => flow(function* () {
  let s = yield redis.get(uid)
  return s == null ? {} : Player.parse(s)
})

module.exports.getMany = (
  { uids }
) => flow(function* () {
  let s = yield redis.mget(uids)
  return s.map(p => Player.parse(p))
})

module.exports.getAll = (
  { start, end }
) => flow(function* () {
  if (start < 0 || end < 0) {
    throw new Error(`取值范围无效。end:${end}, start:${start}`)
  }

  // 始终优先获取最新加入的玩家
  let keys = yield redis.lrange('players', -end - 1, -start - 1)
  let players = yield redis.mget(keys)
  return players.map(p => Player.parse(p))
})

module.exports.changeRoom = (
  { uid, roomId }
) => flow(function* () {
  let s = yield redis.get(uid)
  let player = Player.parse(s)

  if (player.status !== playerStatus.idle) {
    throw new Error('该玩家正在游戏中，无法切换房间')
  }

  let oldId = player.roomId
  player.roomId = roomId
  yield redis.set(player.uid, player.toString())
  return oldId
})
