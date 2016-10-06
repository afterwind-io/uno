const socketMap = new Map()
const uidMap = new Map()

module.exports.cache = (socket, uid) => {
  socketMap.set(socket.id, uid)
  uidMap.set(uid, socket)
}

module.exports.remove = (socketId) => {
  let uid = socketMap.get(socketId)
  socketMap.delete(socketId)
  uidMap.delete(uid)
}

module.exports.get = (name) =>
  name.includes('/#') ? socketMap.get(name) : uidMap.get(name)
