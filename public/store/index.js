import Vue from 'vue'
import Vuex from 'vuex'
import main from './main'
import chat from './modules/chat.js'
import room from './modules/room.js'
import player from './modules/player.js'
import popups from './modules/popups.js'

Vue.use(Vuex)

export default new Vuex.Store({
  ...main,
  modules: {
    chat,
    room,
    player,
    popups
  },
  strict: true
})
