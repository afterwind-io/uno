<template lang="html">
  <div class="mainFrame">
    <h1>lobby</h1>
    <input type="button" @click="logout" value="Logout">
    <chat></chat>
  </div>
</template>

<script>
import chat from '../components/chat.vue'
import api from '../services/api.js'
import nav from '../services/navigation.js'

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
    chat
  }
};
</script>

<style lang="less">
</style>
