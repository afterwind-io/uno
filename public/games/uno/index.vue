<template>
  <div class="game">
    <div class="table">
      <card :card="currentCard"></card>
    </div>
    <div class="players">
      <div class="playerBox" v-for="player in players">
        <p>
          <span v-show="player.uid === currentCard.uid">→</span>
          玩家：{{player.name}}</p>
        <p>剩余手牌：{{player.remains}}张</p>
      </div>
    </div>
    <div class="myTable">
      <input type="button" value="出牌">
      <input type="button" value="放弃">
      <div class="mycards">
        <card v-for="card in myCards" :card="card"></card>
      </div>
    </div>

    <input type="button" value="离开房间" @click="gg()">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ws from '../../services/websocket.js'
import nav from '../../services/navigation.js'
import card from './components/card.vue'

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      gameStates: 'unoGameStates',
      myCards: 'unoMyCards',
      players: 'unoPlayers',
      histories: 'unoHistories'
    }),
    currentPlayer () {
      return this.gameStates.currentPlayer
    },
    currentCard () {
      return this.gameStates.currentCard
    }
  },
  methods: {
    ...mapActions([
      'leaveGameRoom',
      'leaveChat',
      'unoSetCards',
      'unoUpdateGameState'
    ]),
    gg () {
      this.leaveGameRoom()
        .then(res => {
          this.leaveChat(this.roomId)
          nav.go('lobby')
        })
    }
  },
  components: {
    card
  },
  created () {
    let _this = this

    ws.register ({
      module: 'uno',
      uno (res) {
        switch (res.head) {
          case 'deal':
            _this.unoSetCards(res.body)
            break
          case 'update':
            _this.unoUpdateGameState(res.body)
            break
          default:
            break
        }
      }
    })
  }
}
</script>

<style lang="css">
</style>
