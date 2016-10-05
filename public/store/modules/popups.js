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
  SWITCH_POP_CREATEGAMEROOM (state) {
    state.popSwitches.createGameRoom =
     !state.popSwitches.createGameRoom
  }
}

const actions = {
  switchPopCreateGameRoom ({ state, commit }) {
    commit('SWITCH_POP_CREATEGAMEROOM')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
