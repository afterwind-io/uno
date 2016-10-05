<template>
  <div class="popup" v-show="isShowCreateGameRoom">
    <h3>创建房间</h3>
    <label>名称<input type="text" placeholder="" v-model="room.name"></label><br>
    <label>人数<input type="number" v-model="room.limit"></label><br>
    <label>是否公开<input type="checkbox" v-model="room.isPublic"></label><br>
    <label>房间密码<input type="text" v-model="room.password"></label><br>
    <input type="button" value="取消" @click="cancel()">
    <input type="button" value="创建" @click="create()">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import nav from '../services/navigation.js'

export default {
  data () {
    return {
      room: {
        name: '',
        limit: 10,
        isPublic: true,
        password: ''
      }
    };
  },
  computed: {
    ...mapGetters(['isShowCreateGameRoom'])
  },
  methods: {
    ...mapActions([
      'switchPopCreateGameRoom',
      'createGameRoom',
      'joinGameRoom',
      'joinChat'
    ]),
    create () {
      this.createGameRoom(this.room)
        .then(res => {
          return this.joinGameRoom(res.id)
        })
        .then(res => {
          this.switchPopCreateGameRoom()
          this.joinChat({ id: res.id, name: `房间#${res.id}` })
          nav.go('room')
        })
    },
    cancel () {
      this.switchPopCreateGameRoom()
    }
  }
};
</script>

<style lang="css">
</style>
