let flow = require('../../utils/async.js').flow

let Redis = require('ioredis')
let redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  db: 1
})

const LOBBY_ID = 0
const roomStatus = {
  private: -1,
  idle: 0,
  busy: 1
}

class Room {
  constructor (info) {
    info.id === 0 ? this.createLobby(info)
                  : this.createRoom(info)
  }

  createLobby (info) {
    this.PLAYERS_MIN = 0
    this.PLAYERS_MAX = 1000
    this.id = LOBBY_ID
    this.name = 'Lobby'
    this.players = info.players || []
    this.limit = this.PLAYERS_MAX
    this.isPublic = true
    this.password = ''
    this.status = roomStatus.idle
  }

  createRoom (info) {
    this.PLAYERS_MIN = 2
    this.PLAYERS_MAX = 10
    this.id = info.id
    this.name = info.name || `Room ${this.id}`
    this.players = info.players || []
    this.limit = info.limit || this.PLAYERS_MAX
    this.isPublic = info.isPublic || true
    this.password = info.password || ''
    this.status = info.status || roomStatus.idle
  }

  get currentPlayers () {
    return this.players
  }

  get currentPlayersNum () {
    return this.players.length
  }

  addPlayer (id) {
    console.log(`[room]Entering Player:${id} to Room:${this.id}`)

    if (this.players.length + 1 <= this.limit) this.players.push(id)
  }

  removePlayer (id) {
    console.log(`[room]Removing Player:${id} from Room:${this.id}`)

    let i = this.players.indexOf(id)
    if (i !== -1) this.players.splice(i, 1)
  }

  setLimit (num) {
    if (num < this.PLAYERS_MIN || num > this.PLAYERS_MAX) return

    this.limit = num
  }

  toPackage () {
    return ['id', 'name', 'players', 'limit', 'status']
      .reduce((o, prop) => Object.assign(o, { [prop]: this[prop] }), {})
  }

  toString () {
    return JSON.stringify(this)
  }

  static parse (str) {
    return new Room(JSON.parse(str))
  }
}

// 产生id计数器
redis.set('idGen', 0)
// 新建大厅
redis.set(LOBBY_ID, (new Room({id: LOBBY_ID, name: 'Lobby'})).toString())

module.exports.create = (
  info
) => flow(function* () {
  let id = yield redis.incr('idGen')
  let room = new Room({
    id,
    name: info.name,
    limit: info.limit,
    isPublic: info.isPublic,
    password: info.password
  })
  yield redis.set(id, room.toString())
  yield redis.lpush('rooms', id)
  return room.toPackage()
})

module.exports.remove = (
  { roomId }
) => flow(function* () {
  yield redis.del(roomId)
  return redis.lrem('rooms', 0, roomId)
})

module.exports.get = (
  { roomId }
) => flow(function* () {
  let s = yield redis.get(roomId)
  return s == null ? {} : Room.parse(s).toPackage()
})

/**
 * 根据索引范围返回房间信息，去除了不必要的信息
 * @param   {number}  start  开始索引
 * @param   {number}  end    结束索引
 * @return  {array}          查找到的房间组
 */
module.exports.getMany = (
  { start, end }
) => flow(function* () {
  if (start < 0 || end < 0) {
    throw new Error(`取值范围无效。start:${start}, end:${end}`)
  }

  // 始终优先获取最新创建的房间
  let keys = yield redis.lrange('rooms', -end - 1, -start - 1)

  if (keys.length === 0) {
    return []
  } else {
    let rooms = yield redis.mget(keys)
    return rooms.map(r => Room.parse(r).toPackage())
  }
})

module.exports.addPlayer = (
  { roomId, uid }
) => flow(function* () {
  let s = yield redis.get(roomId)
  let room = Room.parse(s)
  room.addPlayer(uid)
  return redis.set(roomId, room.toString())
})

module.exports.remPlayer = (
  { roomId, uid }
) => flow(function* () {
  let s = yield redis.get(roomId)
  let room = Room.parse(s)
  room.removePlayer(uid)
  return redis.set(roomId, room.toString())
})
