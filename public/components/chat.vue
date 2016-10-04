<template>
    <div class="Component">
        <h2>Chat</h2>
        <div class="chatsContainer">
          <p v-for="chat in chats">{{chat}}</p>
        </div>
        <input type="text" v-model="msg">
        <input type="button" value="Send" @click="send()">
    </div>
</template>

<script>
import ws from '../services/websocket.js'
import shared from '../services/shared.js'

let _chats = []
let _msg = ''

let _socket = ws.register (res => {
  switch (res.head) {
    case 'chat':
      _chats.push(res.body)
      break
    default:
      break
  }
})

export default {
  props: [],
  data () {
    return {
      chats: _chats,
      msg: _msg
    }
  },
  methods: {
    send (event) {
      _socket.send({
        head: 'chat',
        body: {id: 0, msg: `[${shared.player.name}] ${this.msg}`}
      })
      this.msg = ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
