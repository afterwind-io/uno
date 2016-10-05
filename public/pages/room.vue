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
    <input type="button" value="准备" @click="ready()">
    <input type="button" value="返回大厅" @click="leave()">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import nav from '../services/navigation.js'

export default {
  computed: {
    ...mapGetters(['currentGameRoom', 'player']),
    roomName () {
      return this.currentGameRoom.name
    },
    players () {
      return this.currentGameRoom.players
    }
  },
  methods: {
    ...mapActions([
      'leaveGameRoom',
      'leaveChat'
    ]),
    ready () {

    },
    leave () {
      this.leaveGameRoom()
        .then(res => {
          this.leaveChat(this.currentGameRoom.id)
          nav.go('lobby')
        })
    }
  },
  components: {}
};
</script>

<style lang="css">
</style>
