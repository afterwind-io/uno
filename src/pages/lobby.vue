<template lang="html">
  <div class="mainFrame">
    <h1>lobby</h1>
    <input type="button" @click="logout" value="Logout">
  </div>
</template>

<script>
import api from '../services/api.js'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'

export default {
  data() {
    return {
    };
  },
  computed: {},
  ready() {},
  attached() {},
  methods: {
    logout () {
      api.logout(
        {},
        (res) => nav.go('home')
      )
    }
  },
  components: {}
};
</script>

<style lang="less">
</style>
