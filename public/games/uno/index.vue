<template>
  <div class="game">
    <div class="table">
      <card :card="currentCard"></card>
      <h4>{{JSON.stringify(gameStates.state)}}</h4>
    </div>
    <div class="players">
      <div class="playerBox" v-for="player in players">
        <p>
          <span v-show="player.uid === currentPlayer.uid">→</span>
          玩家：{{player.name}}</p>
        <card :card="player.lastCard"></card>
        <p>剩余手牌：{{player.remains}}张</p>
      </div>
    </div>
    <div class="myTable">
      <div class="mycards">
        <div class="cardBox" :class="{'card-selected': card.isSelected}"
          v-for="card in myCards" @click="switchCard(card)">
          <card :card="card"></card>
        </div>
      </div>
      <input type="button" value="出牌" @click="deal()">
      <input type="button" value="放弃" @click="giveup()">
      <input type="button" value="认罚" @click="penaltyOver()">
      <input type="button" value="返罚" @click="penaltyBack()">
      <input type="button" value="红" @click="chooseColor('red')">
      <input type="button" value="蓝" @click="chooseColor('blue')">
      <input type="button" value="绿" @click="chooseColor('green')">
      <input type="button" value="黄" @click="chooseColor('yellow')">
      <input type="button" value="跳过" @click="skipme()">
      <input type="button" value="挑战" @click="challenge()">
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
    ...mapGetters(['currentGameRoom']),
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
      'unoUpdateGameState',
      'unoTossCards'
    ]),
    ...mapActions({
      switchCard: 'unoSwitchCard',
      takePenalties: 'unoTakePenalties'
    }),
    call (deals) {
      ws.emit('game', {
        head: 'forward',
        body: {
          gameName: 'uno',
          action: 'call',
          payload: {
            roomId: this.currentGameRoom.id,
            deals
          }
        }
      })
    },
    deal () {
      this.call(this.myCards.filter(c => c.isSelected))
    },
    giveup () {
      this.call([{ color: '',  symbol: 'pas' }])
    },
    penaltyBack () {
      this.call([{ color: '',  symbol: 'pnb' }])
    },
    penaltyOver () {
      this.takePenalties()
      this.call([{ color: '',  symbol: 'pno' }])
    },
    chooseColor (color) {
      this.call([{ color, symbol: 'clr' }])
    },
    skipme () {
      this.call([{ color: '', symbol: 'skp' }])
    },
    challenge () {
      this.call([{ color: '', symbol: 'clg' }])
    },
    gg () {
      this.leaveGameRoom()
        .then(res => {
          this.leaveChat(this.roomId)
          this.call([{ color: '', symbol: 'ggg' }])
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
            _this.unoTossCards()
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

<style lang="css" scoped>
.cardBox{
  display: inline-block;
  width: 100px;
  height: 160px;
  margin: 10px;
  transition: 200ms;
  cursor: pointer;
}

.card-selected {
  transform: scale(1.1, 1.1);
}

.playerBox {
  display: inline-block;
  width: 200px;
}
</style>
