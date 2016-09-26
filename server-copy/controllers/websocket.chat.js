let io
const debug = console.log.bind(null, '[WebSocket](chat)')

function getChannel (type, gid) {
  return `${type}:${gid}`
}

function emitRoomMessage (id, msg) {
  let channel = getChannel('room', id)
  io.to(channel).emit({
    title: 'broadcast',
    content: msg
  })
}

function emitPrivateMessage (gid, msg) {
  let channel = getChannel('player', gid)
  io.to(channel).emit({
    title: 'pm',
    content: msg
  })
}

const eventHandler = {
  login (socket, { gid }) {
    // 默认加入属于自己的私聊频道
    let privateChannel = getChannel('player', gid)
    socket.join(privateChannel)

    // 默认加入大厅频道
    let lobbyChannel = getChannel('room', 0)
    socket.join(lobbyChannel)

    let msg = `Player:${gid} entered Lobby`
    debug(msg)
    emitRoomMessage(0, msg)
  },
  logout (socket, { gid }) {
    let msg = `Player:${gid} leaved Lobby`
    debug(msg)
    emitRoomMessage(0, msg)
  },
  join (socket, { type, id }) {
    let channel = getChannel(type, id)
    socket.join(channel)
  },
  leave (socket, { type, id }) {
    let channel = getChannel(type, id)
    socket.leave(channel)
  },
  pm (socket, { gid, msg }) {
    emitPrivateMessage(gid, msg)
  }
}
