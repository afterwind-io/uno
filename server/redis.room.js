let flow = require('./utils/async.js').flow

let Redis = require('ioredis')
let redis = new Redis({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
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

  get CurrentPlayersNum () {
    return this.players.length
  }

  addPlayer (id) {
    if (this.players.length + 1 <= this.limit) this.players.push(id)
  }

  removePlayer (id) {
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
  welcome (player) {
    return flow(function* () {
      let s = yield redis.get(LOBBY_ID)
      let lobby = Room.parse(s)
      lobby.addPlayer(player.gameId)
      yield redis.set(LOBBY_ID, lobby.toString())
      return LOBBY_ID
    })
  },
  create (info) {
    return flow(function* () {
      let id = yield redis.incr('idGen')
      let room = new Room({
        id,
        name: info.name,
        isPublic: info.isPublic,
        password: info.password
      })
      yield redis.set(id.toString(), room.toString())
      return room
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
  getRooms () {
    return flow(function* () {
      // FIXME:
      let keys = yield redis.keys('[0-9]*')
      let rooms = yield redis.mget(keys)
      return rooms.map(r => {
        let room = Room.parse(r)
        return room.toPackage()
      })
    })
  },
  getRoom (key) {
    return flow(function* () {
      let s = yield redis.get(key)
      if (s === 'nil') {
        throw new Error('指定的房间不存在')
      }
      let room = Room.parse(s)
      return room.toPackage()
    })
  }
}
