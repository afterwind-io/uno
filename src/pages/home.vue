<template>
  <div class="mainFrame">
    <h1>UNO Online</h1>
    <h3>Mini Version</h3>
    <p>Player Name:</p>
    <input type="text" v-model="user.name">
    <input type="button" @click="register" value="Register">
    <input type="button" @click="login" value="Login">
    <a :href="page.about">About!</a>
  </div>
</template>

<script>
import api from '../services/api.js'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'
import shared from '../services/shared.js'

ws.init()

export default {
  data () {
    return {
      user: {
        name: 'Doge'
      },
      page: {
        main: '#/main',
        lobby: '#/lobby',
        about: '#/about'
      }
    };
  },
  methods: {
    register () {
      api.register(
        {username: this.user.name, password: ''},
        (res) => {
          ws.login()
          shared.player.name = this.user.name
          shared.player.status = 0
          nav.go('lobby')
        }
      )
    },
    login () {
      api.login(
        {username: this.user.name, password: ''},
        (res) => {
          ws.login()
          shared.player.name = this.user.name
          shared.player.status = 0
          nav.go('lobby')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
</style>
