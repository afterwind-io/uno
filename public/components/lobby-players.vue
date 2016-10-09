<template>
  <div class="Component">
    <h2>Online Players: {{players.length}}</h2>
    <div class="playersContainer">
      <input type="text" placeholder="搜索玩家" v-model="search">
      <input type="button" value="刷新列表" @click="refresh()">
      <div class="playerBox" v-for="player in filteredPlayers">
        <p>{{player.name}} Room:{{player.roomId}} Status:{{player.status}}</p>
        <input type="button" value="私聊" @click="pm(player)">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ws from '../services/websocket.js'

export default {
  data () {
    return { search: '' }
  },
  computed: {
    ...mapGetters(['players']),
    filteredPlayers () {
      return this.search === ''
        ? this.players
        : this.players.filter(p => p.name.includes(this.search))
    }
  },
  methods: {
    ...mapActions({
      refresh: 'refreshPlayers'
    }),
    ...mapActions(['joinChat']),
    pm (player) {
      this.joinChat({ id: player.uid, name: `@${player.name}` })
    }
  },
  created () {
    let _this = this

    ws.register ({
      module: 'lobby-player',
      main (res) {
        if(res.head === 'updateOnlineStatus') _this.refresh()
      }
    })
  }
}
</script>

<style lang="css">
</style>
