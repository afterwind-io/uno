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
    <input type="button" value="开始" @click="start()">
    <input type="button" value="返回大厅" @click="leave()">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import nav from '../services/navigation.js'
import ws from '../services/websocket.js'

export default {
  computed: {
    ...mapGetters(['currentGameRoom', 'user']),
    roomId () {
      return this.currentGameRoom.id
    },
    roomName () {
      return this.currentGameRoom.name
    },
    players () {
      return this.currentGameRoom.players
    }
  },
  methods: {
    ...mapActions([
      'switchUserState',
      'leaveGameRoom',
      'refreshGameRoomStatus',
      'leaveChat'
    ]),
    ready () {
      this.switchUserState()
    },
    leave () {
      this.leaveGameRoom()
        .then(res => {
          this.leaveChat(this.roomId)
          nav.go('lobby')
        })
    },
    start () {
      // TODO
      ws.getSocket().emit('game', {
        head: 'start',
        body: {
          gameName: 'uno',
          roomId: this.roomId,
        }
      })

    }
  },
  created () {
    let _this = this

    ws.register ({
      module: 'room',
      handler (res) {
        switch (res.head) {
          case 'updateRoomStatus':
            _this.refreshGameRoomStatus({
              players: res.body
            })
            break
          case 'gameStart':
            nav.go(res.body.gameName)
            break;
          default:
            break
        }
      }
    })
  }
};
</script>

<style lang="css">
</style>
