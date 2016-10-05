import api from '../../services/api.js'

const state = {
  players: []
}

const getters = {
  players (state) {
    return state.players
  }
}

const mutations = {
  PLAYERS_SET (state, players) {
    state.players.splice(0)
    state.players.push(...players)
  }
}

const actions = {
  refreshPlayers ({ state, commit }) {
    return api.getOnlinePlayers({
      start: 0,
      end: 50
    })
    .then(res => {
      commit('PLAYERS_SET', res)
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
