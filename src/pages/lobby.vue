<template lang="html">
  <div class="mainFrame">
    <h1>Lobby</h1>
    <input type="button" @click="logout" value="退出">
    <rooms @show-pop-crt-room="showPopCrtroom"></rooms>
    <players></players>
    <chat></chat>
    <crtRoom :on="isShowPopCrtroom" @close-pop-crt-room="closePopCrtroom"></crtRoom>
  </div>
</template>

<script>
import ws from '../services/websocket.js'
import api from '../services/api.js'
import nav from '../services/navigation.js'
import shared from '../services/shared.js'
import ui_chat from '../components/chat.vue'
import ui_players from '../components/lobby-players.vue'
import ui_rooms from '../components/lobby-rooms.vue'
import pop_crtRoom from '../components/lobby-pop-crtRoom.vue'

export default {
  data() {
    return {
      isShowPopCrtroom: false
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
    showPopCrtroom () {
      this.isShowPopCrtroom = true
    },
    closePopCrtroom () {
      this.isShowPopCrtroom = false
    }
  },
  components: {
    chat: ui_chat,
    players: ui_players,
    rooms: ui_rooms,
    crtRoom: pop_crtRoom
  }
};
</script>

<style lang="less">
</style>
