<template>
  <div class="mainFrame">
    <h1>Home</h1>
    <input type="button" @click="logout" value="退出">
    <router-view></router-view>
    <chat></chat>
  </div>
</template>

<script>
import api from '../services/api.js'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'
import ui_chat from '../components/chat.vue'


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
          nav.go('landing')
        }
      )
    },
  },
  components: {
    chat: ui_chat
  }
};
</script>

<style lang="css">
</style>
