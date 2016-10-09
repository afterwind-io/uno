import ws from '../../services/websocket.js'

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
  CHATROOM_FOCUS (state, id) {
    let room
    for (room of state.rooms) {
      if (room.id === id) break
    }
    state.currentRoom = room || state.rooms[0]
  },
  CHATROOM_CREATE (state, { id, name }) {
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
  CHATROOM_CHAT_ADD (state, info) {
    let room
    for (room of state.rooms) {
      if (room.id === info.id) break
    }
    if (room) room.chats.push(info.msg)
  },
  CHATROOM_CHAT_CLR (state) {
    state.currentRoom.chats.splice(0)
  }
}

const actions = {
  createChatRoom ({ state, commit }, info) {
    commit('CHATROOM_CREATE', info)
  },
  focus ({ state, commit }, id) {
    commit('CHATROOM_FOCUS', id)
  },
  addChat ({ state, commit }, info) {
    commit('CHATROOM_CHAT_ADD', info)
  },
  clearChat ({ state, commit }) {
    commit('CHATROOM_CHAT_CLR')
  },
  sendChat ({ state, commit }, msg) {
    let id = state.currentRoom.id

    ws.emit('main', {
      head: 'chat',
      body: { id, msg }
    })
    commit('CHATROOM_MSG_CLR')
  },
  joinChat ({ state, commit }, info) {
    ws.emit('main', {
      head: 'join',
      body: info
    })
  },
  leaveChat ({ state, commit }, id) {
    ws.emit('main', {
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
