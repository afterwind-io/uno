const state = {
  popSwitches: {
    createGameRoom: false
  }
}

const getters = {
  isShowCreateGameRoom (state) {
    return state.popSwitches.createGameRoom
  }
}

const mutations = {
  POP_SWITCH_CREATEGAMEROOM (state) {
    state.popSwitches.createGameRoom =
     !state.popSwitches.createGameRoom
  }
}

const actions = {
  switchPopCreateGameRoom ({ state, commit }) {
    commit('POP_SWITCH_CREATEGAMEROOM')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
