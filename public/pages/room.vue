<template>
  <div class="mainFrame">
    <h1>Room: {{roomName}} ({{playerNum}}/{{limit}})</h1>
    <h2>Players</h2>
    <div class="playersContainer">
      <div class="playerBox" v-for="player in players">
        <p>{{player.name}}</p>
        <p>{{player.status}}</p>
      </div>
    </div>
    <input type="button" value="添加电脑玩家" @click="_addBot()">
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
    },
    playerNum () {
      return this.currentGameRoom.players.length
    },
    limit () {
      return this.currentGameRoom.limit
    }
  },
  methods: {
    ...mapActions([
      'switchUserState',
      'leaveGameRoom',
      'refreshGameRoomStatus',
      'leaveChat',
      'addBot',
      'unoUpdateGameState'
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
    _addBot () {
      this.addBot()
        .catch(() => {
          // TODO: notify room full
        })
    },
    start () {
      // TODO
      ws.emit('game', {
        head: 'forward',
        body: {
          gameName: 'uno',
          action: 'start',
          payload: {
            roomId: this.roomId,
            players: this.players
          }
        }
      })

    }
  },
  created () {
    let _this = this

    ws.register ({
      module: 'room',
      main (res) {
        if (res.head === 'updateRoomStatus') {
          _this.refreshGameRoomStatus({ players: res.body })
        }
      },
      uno (res) {
        if (res.head === 'gameStart') {
          _this.unoUpdateGameState(res.body)
          nav.go('uno')
        }
      }
    })
  }
}
</script>

<style lang="css">
</style>
