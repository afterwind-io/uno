<template>
  <div class="Component">
    <h2>Chat</h2>
    <div class="room" v-for="room in chatRooms">
      <div class="chatsContainer">
        <h3 @click="focus(room.id)">{{room.name}}</h3>
        <p v-for="chat in room.chats">{{chat}}</p>
        <input type="text" v-model="msg">

        <input type="button" value="清屏" @click="clearChat()">
        <input type="button" value="发送" @click="send()">
        <input type="button" value="离开" v-show="room.canLeave" @click="leaveChat()">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ws from '../services/websocket.js'

export default {
  data () {
    return { msg: '' }
  },
  computed: mapGetters([
    'chatRooms',
    'currentRoom'
  ]),
  methods: {
    ...mapActions([
      'focus',
      'addChat',
      'clearChat',
      'sendChat',
      'joinChat',
      'leaveChat'
    ]),
    send () {
      this.sendChat(this.msg)
      this.msg = ''
    }
  },
  created () {
    let _this = this

    ws.register ({
      module: 'chat',
      handler (res) {
        switch (res.head) {
          case 'chat':
            _this.addChat(res.body)
            break
          default:
            break
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>
