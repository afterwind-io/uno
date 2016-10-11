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
    cards.forEach(c => { c.isSelected = false })
    state.myCards = cards
  },
  UNO_STATE_SET (state, info) {
    state.game = info.game
    state.players = info.players
  },
  UNO_SWITCH_CARD (state, card) {
    card.isSelected = !card.isSelected
  },
  UNO_TOSS_CARD (state, cards) {
    let remains = state.myCards.filter(c => !c.isSelected)
    state.myCards.splice(0)
    state.myCards.push(...remains)
  },
  UNO_PENALTY (state) {
    state.myCards.push(...state.game.penalties)
  }
}

const actions = {
  unoSetCards ({ state, rootState, commit }, { player, cards }) {
    if (player === rootState.user.uid) {
      commit('UNO_INIT', cards)
    }
  },
  unoSwitchCard ({ state, commit }, card) {
    // if(card.isLegal){
    commit('UNO_SWITCH_CARD', card)
    // }
  },
  unoTossCards ({ state, commit }) {
    commit('UNO_TOSS_CARD')
  },
  unoTakePenalties ({ state, commit }) {
    commit('UNO_PENALTY')
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
