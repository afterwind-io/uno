import ws from '../../services/websocket.js'

const socket = ws.getSocket()

class ChatRoom {
  constructor (id, name) {
    this.id = id
    this.name = name
    this.chats = []
    this.msg = ''
    this.canLeave = isNaN(parseInt(id))
  }
}

const defaultRoom = new ChatRoom(0, 'lobby')

const state = {
  rooms: [defaultRoom],
  currentRoom: defaultRoom
}

const getters = {
  chatRooms (state) {
    return state.rooms
  },
  currentChatRoom (state) {
    return state.currentRoom
  }
}

const mutations = {
  CHATROOM_FOCUS (state, { id }) {
    let room
    for (room of state.rooms) {
      if (room.id === id) return room
    }
    state.currentRoom = room
  },
  CHATROOM_JOIN (state, { id, name }) {
    let room = new ChatRoom(id, name)
    state.rooms.push(room)
    state.currentRoom = room
  },
  CHATROOM_LEAVE (state) {
    let i = state.rooms.indexOf(state.currentRoom)
    state.rooms.splice(i, 1)
    state.currentRoom = state.rooms[state.rooms.length - 1]
  },
  CHATROOM_MSG_CLR (state) {
    state.currentRoom.msg = ''
  },
  CHATROOM_CHAT_ADD (state, msg) {
    state.currentRoom.chats.push(msg)
  },
  CHATROOM_CHAT_CLR (state) {
    state.currentRoom.chats.splice(0)
  }
}

const actions = {
  focus ({ state, commit }, id) {
    commit('CHATROOM_FOCUS', id)
  },
  addChat ({ state, commit }, msg) {
    commit('CHATROOM_CHAT_ADD', msg)
  },
  clearChat ({ state, commit }) {
    commit('CHATROOM_CHAT_CLR')
  },
  sendChat ({ state, commit }, msg) {
    let id = state.currentRoom.id

    socket.emit('main', {
      head: 'chat',
      body: { id, msg }
    })
    commit('CHATROOM_CHAT_ADD', msg)
    commit('CHATROOM_MSG_CLR')
  },
  joinChat ({ state, commit }, info) {
    socket.emit('main', {
      head: 'join',
      body: { id: info.id }
    })
    commit('CHATROOM_JOIN', info)
  },
  leaveChat ({ state, commit }, id) {
    socket.emit('main', {
      head: 'leave',
      body: { id: id || state.currentRoom.id }
    })
    commit('CHATROOM_LEAVE')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
