<template lang="html">
  <div class="mainFrame">
    <h1>Lobby</h1>
    <rooms @show-pop-crt-room="showPopCrtroom"></rooms>
    <players></players>
    <crtRoom :on="isShowPopCrtroom" @close-pop-crt-room="closePopCrtroom"></crtRoom>
  </div>
</template>

<script>
import ws from '../services/websocket.js'
import api from '../services/api.js'
// import nav from '../services/navigation.js'
import shared from '../services/shared.js'
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
    showPopCrtroom () {
      this.isShowPopCrtroom = true
    },
    closePopCrtroom () {
      this.isShowPopCrtroom = false
    }
  },
  components: {
    players: ui_players,
    rooms: ui_rooms,
    crtRoom: pop_crtRoom
  }
};
</script>

<style lang="less">
</style>
