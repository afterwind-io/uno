<template>
  <div class="mainFrame">
    <h1>UNO Online</h1>
    <h3>Mini Version</h3>
    <p>Player Name:</p>
    <input type="text" v-model="user.name">
    <input type="button" @click="_register" value="注册">
    <input type="button" @click="_login" value="登录">
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'

ws.init()

export default {
  data () {
    return {
      user: {
        name: 'Doge',
        password: ''
      }
    };
  },
  methods: {
    ...mapActions(['register', 'login']),
    _register () {
      this.register(this.user)
        .then(res => {
          ws.login({uid: res.uid})
          nav.go('lobby')
        })
    },
    _login () {
      this.login(this.user)
        .then(res => {
          ws.login({uid: res.uid})
          nav.go('lobby')
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
