<template>
  <div class="mainFrame">
    <h1>UNO Online</h1>
    <h3>Mini Version</h3>
    <p>Player Name:</p>
    <input type="text" v-model="user.name">
    <input type="button" @click="start" value="Login">
    <a :href="page.about">About!</a>
  </div>
</template>

<script>
import api from '../services/api.js'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'

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
    start () {
      // ws.init()
      //
      // let io = ws.register('main', ({ title, content }) => {
      //   switch (title) {
      //     case 'login':
      //       if(content === 'ok') return 
      //     default:
      //       break;
      //   }
      // })

      api.login(
        {username: this.user.name, password: ''},
        (res) => nav.go('lobby')
      )
    }
  }
}
</script>

<style lang="less" scoped>
</style>
