const state = {
  game: {
    state: {},
    currentCard: {},
    currentPlayer: {},
    penalties: []
  },
  players: [],
  histories: []
}

const getters = {
  unoGameStates (state) {
    return state.game
  },
  unoPlayers (state) {
    return state.players
  },
  unoHistories (state) {
    return state.histories
  }
}

const mutations = {
  UNO_STATE_SET (state, info) {
    state.game = info.game
    state.players = info.players
  }
}

const actions = {
  updateGameState ({ state, commit }, info) {
    commit('UNO_STATE_SET', info)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
