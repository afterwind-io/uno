<template>
  <div class="Component">
    <h2>Rooms: {{rooms.length}}</h2>
    <div class="roomContainer">
      <input type="text" placeholder="搜索房间" v-model="search">
      <input type="button" value="创建..." @click="create">
      <input type="button" value="刷新列表" @click="refresh">
      <div class="roomBox" v-for="room in rooms" @click="enter(room)">
        <p>{{room.id}}: {{room.name}} {{room.players.length}}/{{room.limit}} {{room.status}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '../services/api.js'
import ws from '../services/websocket.js'

let _data = {
  rooms: [],
  search: ''
}
let _setValue = Vue.set.bind(null, _data)

let _refresh = function(){
  api.getRooms(
    {},
    res => {
      _setValue('rooms', res.rooms)
    }
  )
}

let _socket = ws.register (res => {
  switch (res.title) {
    case 'online status':
      _refresh()
      break
    default:
      break
  }
})


export default {
  data() {
    return _data
  },
  computed: {},
  methods: {
    enter (room) {},
    create () {
      this.$emit('show-pop-crt-room')
    },
    refresh: _refresh
  },
};
</script>

<style lang="css">
</style>
