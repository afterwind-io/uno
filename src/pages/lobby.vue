<template lang="html">
  <div class="mainFrame">
    <h1>lobby</h1>
    <input type="button" @click="logout" value="Logout">
    <players></players>
    <chat></chat>
  </div>
</template>

<script>
import api from '../services/api.js'
import nav from '../services/navigation.js'
import chat from '../components/chat.vue'
import players from '../components/lobby-players.vue'

export default {
  data() {
    return {
    };
  },
  computed: {},
  methods: {
    logout () {
      api.logout(
        {},
        (res) => nav.go('home')
      )
    }
  },
  components: {
    chat,
    players
  }
};
</script>

<style lang="less">
</style>
