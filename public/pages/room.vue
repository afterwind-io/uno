<template>
  <div class="mainFrame">
    <h1>Room: {{roomName}}</h1>
    <h2>Players</h2>
    <div class="playersContainer">
      <div class="playerBox" v-for="player in players">
        <p>{{player.name}}</p>
        <p>{{player.status}}</p>
      </div>
    </div>
    <input type="button" value="准备" @click="ready">
    <input type="button" value="返回大厅" @click="leave">
  </div>
</template>

<script>
import api from '../services/api.js'
import nav from '../services/navigation.js'
import shared from '../services/shared.js'

let _data = shared.room

export default {
  data() {
    return _data
  },
  computed: {
    roomName () {
      return shared.room.name
    },
    players () {
      return shared.room.players
    }
  },
  methods: {
    ready () {

    },
    leave () {
      api.leaveRoom({
        gid: shared.player._gid,
        roomId: shared.room.id
      }, res => {
        shared.room = {}
        nav.go('lobby')
      })
    }
  },
  components: {}
};
</script>

<style lang="css">
</style>
