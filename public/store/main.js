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
  USER_SET (state, info) {
    state.user = info
  },
  USER_SET_STATE (state, status) {
    state.user.status = status
  }
}

const actions = {
  register ({ state, commit }, info) {
    return api.register(info).then(res => {
      commit('USER_SET', res)
      return res
    })
  },
  login ({ state, commit }, info) {
    return api.login(info).then(res => {
      commit('USER_SET', res)
      return res
    })
  },
  logout ({ state, commit }) {
    return api.logout({}).then(res => {
      commit('USER_SET', {})
    })
  },
  switchUserState ({ state, commit }) {
    // TODO: 房间内players中自己的状态没有改变
    let fn = state.user.status === 0
      ? api.iamReady
      : api.iamIdle
    let nextStatus = state.user.status === 0 ? 1 : 0

    return fn({ uid: state.user.uid }).then(res => {
      commit('USER_SET_STATE', nextStatus)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
