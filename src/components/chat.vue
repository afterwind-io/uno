<template>
    <div class="Component">
        <h2>Chat</h2>
        <div class="chatsContainer">
          <p v-for="chat in chats">{{chat.content}}</p>
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
  switch (res.title) {
    case 'chat':
      _chats.push(res)
      break
    default:
      break
  }
})

export default {
  ready(){
    _socket.send({
      title: 'login',
      content: ''
    })
  },
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
        title: 'chat',
        content: `[${shared.player.name}] ${this.msg}`
      })
      this.msg = ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
