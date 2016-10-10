const state = {
  game: {
    state: {},
    currentCard: {},
    currentPlayer: {},
    penalties: []
  },
  myCards: [],
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
  unoMyCards (state) {
    return state.myCards
  },
  unoHistories (state) {
    return state.histories
  }
}

const mutations = {
  UNO_INIT (state, cards) {
    state.myCards = cards
  },
  UNO_STATE_SET (state, info) {
    state.game = info.game
    state.players = info.players
  }
}

const actions = {
  unoSetCards ({ state, commit }, cards) {
    commit('UNO_INIT', cards)
  },
  unoUpdateGameState ({ state, commit }, info) {
    commit('UNO_STATE_SET', info)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
