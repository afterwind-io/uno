<template lang="html">
  <div class="mainFrame">
    <h1>Lobby</h1>
    <input type="button" @click="ready" value="Ready">
    <input type="button" @click="logout" value="Logout">
    <players></players>
    <chat></chat>
  </div>
</template>

<script>
import ws from '../services/websocket.js'
import api from '../services/api.js'
import nav from '../services/navigation.js'
import shared from '../services/shared.js'
import ui_chat from '../components/chat.vue'
import ui_players from '../components/lobby-players.vue'

export default {
  data() {
    return {
    };
  },
  computed: {},
  methods: {
    logout () {
      api.logout({},
        (res) => {
          ws.logout()
          nav.go('home')
        }
      )
    },
    ready () {

    }
  },
  components: {
    chat: ui_chat,
    players: ui_players
  }
};
</script>

<style lang="less">
</style>
