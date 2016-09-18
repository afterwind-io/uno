<template>
  <div class="Component">
    <h2>Online Players: {{players.length}}</h2>
    <div class="playersContainer">
      <input type="text" placeholder="搜索玩家" v-model="search">
      <input type="button" value="刷新列表" @click="refresh">
      <div class="playerBox" v-for="player in players">
        <p>{{player.name}} Room:{{player.roomId}} Status:{{player.status}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '../services/api.js'
import ws from '../services/websocket.js'

let _data = {
  players: [],
  search: ''
}
let _setValue = Vue.set.bind(null, _data)

let _refresh = function(){
  api.getOnlinePlayers(
    {},
    res => {
      _setValue('players', res.players)
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
