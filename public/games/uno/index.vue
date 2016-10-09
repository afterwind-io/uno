<template>
  <div class="game">
    <div class="table">
      <card :card="card"></card>
    </div>
    <div class="players">

    </div>
    <div class="mycards">
      <card v-for="card in cards" :card="card"></card>
    </div>

    <input type="button" value="放弃" @click="gg()">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ws from '../../services/websocket.js'
import nav from '../../services/navigation.js'
import card from './components/card.vue'

const socket = ws.getSocket()

export default {
  data() {
    return {
    };
  },
  computed: {},
  methods: {
    ...mapActions([
      'leaveGameRoom',
      'leaveChat'
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
    ws.register ({
      module: 'uno',
      handler (res) {
        switch (res.head) {
          case 'update':
            // TODO: 
            break
          default:
            break
        }
      }
    })

    socket.emit('game', {
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
};
</script>

<style lang="css">
</style>
