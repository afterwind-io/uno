import api from '../../services/api.js'

const state = {
  rooms: [],
  currentRoom: ''
}

const getters = {
  gameRooms (state) {
    return state.rooms
  },
  currentGameRoom (state) {
    return state.currentRoom
  }
}

const mutations = {
  GAMEROOM_SET_LIST (state, rooms) {
    state.rooms.splice(0)
    state.rooms.push(...rooms)
  },
  GAMEROOM_SET_CURRENT (state, room) {
    state.currentRoom = room
  }
}

const actions = {
  refreshGameRooms ({ state, commit }) {
    return api.getRooms({ start: 0, end: 50 })
      .then(res => {
        commit('GAMEROOM_SET_LIST', res)
      })
  },
  createGameRoom ({ state, commit }, roomInfo) {
    return api.createRoom(roomInfo).then(res => {
      commit('GAMEROOM_SET_CURRENT', res)
      return res
    })
  },
  joinGameRoom ({ state, commit }, roomId) {
    return api.joinRoom({
      roomId: roomId
    })
    .then(res => {
      commit('GAMEROOM_SET_CURRENT', res)
      return res
    })
  },
  leaveGameRoom ({ state, commit }) {
    return api.leaveRoom({
      roomId: state.currentRoom.id
    })
    .then(res => {
      commit('GAMEROOM_SET_CURRENT', {})
      return res
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
