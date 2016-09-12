<template>
    <div class="Component">
        <h2>chat</h2>
        <div class="chatsContainer">
          <p v-for="chat in chats">{{chat.content}}</p>
        </div>
        <input type="text" v-model="msg">
        <input type="button" value="Send" @click="send()">
    </div>
</template>

<script>
import ws from '../services/websocket.js'

let _chats = []
let _msg = ''

ws.init()
let _socket = ws.register ('main', (res) => {
  switch (res.title) {
    case 'login':
      if(res === 'fail') _chats.push('聊天室登录失败。')
      else _chats.push('聊天室登陆成功。')
      break
    case 'chat':
      _chats.push(res)
      break
    default:
      break
  }
})

_socket.send({
  title: 'login',
  content: ''
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
        title: 'chat',
        content: this.msg
      })
      this.msg = ''
    }
  }
}
</script>

<style scoped>

</style>
