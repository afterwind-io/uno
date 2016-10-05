import api from '../services/api.js'

const state = {
  user: {}
}

const getters = {
  user (state) {
    return state.user
  }
}

const mutations = {
  SET_USER (state, info) {
    state.user = info
  }
}

const actions = {
  register ({ state, commit }, info) {
    return api.login(info).then(res => {
      commit('SET_USER', res)
      return res
    })
  },
  login ({ state, commit }, info) {
    return api.login(info).then(res => {
      commit('SET_USER', res)
      return res
    })
  },
  logout ({ state, commit }) {
    return api.logout({}).then(res => {
      commit('SET_USER', {})
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
