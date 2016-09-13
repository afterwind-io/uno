<template>
  <div class="Component">
    <h2>Online Players: {{players.length}}</h2>
    <div class="playersContainer">
      <div class="playerBox" v-for="player in players">
        <p>{{player.name}}</p>
        <p>{{player.status}}</p>
      </div>
      <input type="button" value="Refresh" @click="refresh">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '../services/api.js'
import ws from '../services/websocket.js'

let _data = {
  players: []
}
let _setValue = Vue.set.bind(null, _data)

let _refresh = function(){
  api.getOnlinePlayers(
    {},
    res => {
      _setValue('players', res)
    }
  )
}

let _socket = ws.register (res => {
  switch (res.title) {
    case 'online status':
      _refresh()
      break
    default:
      break
  }
})

export default {
  data () {
    return _data
  },
  methods: {
    refresh: _refresh
  }
}
</script>

<style lang="css">
</style>
