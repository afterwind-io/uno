<template>
  <div class="Component">
    <h2>Rooms: {{gameRooms.length}}</h2>
    <input type="text" placeholder="搜索房间" v-model="search">
    <input type="button" value="创建..." @click="create()">
    <input type="button" value="刷新列表" @click="refresh()">

    <div class="roomContainer" v-for="room in filteredRooms">
      <p>{{room.id}}: {{room.name}} {{room.players.length}}/{{room.limit}} {{room.status}}</p>
      <input type="button" value="加入" @click="_join(room)">
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'

export default {
  data() {
    return { search: '' }
  },
  computed: {
    ...mapGetters(['gameRooms']),
    filteredRooms () {
      return this.search === ''
        ? this.gameRooms
        : this.gameRooms.filter(r => r.name.includes(this.search))
    }
  },
  methods: {
    ...mapActions({
      refresh: 'refreshGameRooms',
      create: 'switchPopCreateGameRoom'
    }),
    ...mapActions([
      'joinGameRoom',
      'joinChat',
    ]),
    _join ({ id }) {
      this.joinGameRoom(id)
        .then(res => {
          this.joinChat({ id: res.id, name: `房间#${res.id}` })
          nav.go('room')
        })
    }
  },
  created () {
    let _this = this

    ws.register ({
      module: 'lobby-rooms',
      main (res) {
        if(res.head === 'updateOnlineStatus') _this.refresh()
      }
    })
  }
};
</script>

<style lang="css">
</style>
