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
    return {
      id: this.id,
      name: this.name,
      players: this.players,
      limit: this.limit,
      status: this.status
    }
  }

  toString () {
    return JSON.stringify(this)
  }

  static parse (str) {
    let o = JSON.parse(str)

    let room = new Room(o)

    return room
  }
}

// 产生id计数器
redis.set('idGen', 0)
// 新建大厅
redis.set(LOBBY_ID, (new Room({id: LOBBY_ID, name: 'Lobby'})).toString())

module.exports = {
  create (info) {
    return flow(function* () {
      let id = yield redis.incr('idGen')
      let room = new Room({
        id,
        name: info.name,
        isPublic: info.isPublic,
        password: info.password
      })
      yield redis.set(id, room.toString())
      yield redis.lpush('rooms', id)
      return room
    })
  },
  remove (id) {
    return flow(function* () {
      yield redis.del(id)
      return redis.lrem('rooms', 0, id)
    })
  },
  addPlayer (roomId, gameId) {
    return flow(function* () {
      let s = yield redis.get(roomId)
      let room = Room.parse(s)
      room.addPlayer(gameId)
      return redis.set(roomId, room.toString())
    })
  },
  removePlayer (roomId, gameId) {
    return flow(function* () {
      let s = yield redis.get(roomId)
      let room = Room.parse(s)
      room.removePlayer(gameId)
      return redis.set(roomId, room.toString())
    })
  },
  getRooms (rangeMin, rangeMax) {
    return flow(function* () {
      if (rangeMin < 0 || rangeMax < 0) {
        throw new Error(`取值范围无效。rangeMax:${rangeMax}, rangeMin:${rangeMin}`)
      }

      // 始终优先获取最新创建的房间
      let keys = yield redis.lrange('rooms', -rangeMax - 1, -rangeMin - 1)

      if (keys.length === 0) {
        return []
      } else {
        let rooms = yield redis.mget(keys)
        return rooms.map(r => {
          return Room.parse(r)
        })
      }
    })
  },
  getRoom (key) {
    return flow(function* () {
      let s = yield redis.get(key)
      if (s === 'nil') {
        throw new Error('指定的房间不存在')
      }
      return Room.parse(s)
    })
  }
}
