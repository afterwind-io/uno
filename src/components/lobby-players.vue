<template>
  <div class="Component">
    <h2>Players</h2>
    <div class="playersContainer">
      <div class="playerBox" v-for="player in players">
        <p>{{player.username}}</p>
        <p>{{player.status}}</p>
      </div>
      <input type="button" value="Refresh" @click="refresh">
    </div>
  </div>
</template>

<script>
import api from '../services/api.js'
import ws from '../services/websocket.js'

let _players = []

let _socket = ws.register ('main', (res) => {
  switch (res.title) {
    case 'online status':
      break
    default:
      break
  }
})

let _refresh = function(){
  api.getOnlinePlayers(
    {},
    res => { _players = res }
  )
}

export default {
  data() {
    return {
      players: _players
    }
  },
  methods: {
    refresh: _refresh
  }
};
</script>

<style lang="css">
</style>
