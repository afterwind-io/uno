<template>
  <div class="popup" v-show="on">
    <h3>创建房间</h3>
    <label>名称<input type="text" placeholder="" v-model="name"></label><br>
    <label>人数<input type="number" v-model="limit"></label><br>
    <label>是否公开<input type="checkbox" v-model="isPublic"></label><br>
    <label>房间密码<input type="text" v-model="password"></label><br>
    <input type="button" value="取消" @click="cancel">
    <input type="button" value="创建" @click="create">
  </div>
</template>

<script>
import api from '../services/api.js'
import nav from '../services/navigation.js'
import shared from '../services/shared.js'

export default {
  props: ['on'],
  data () {
    return {
      name: '',
      limit: 10,
      isPublic: true,
      password: ''
    };
  },
  methods: {
    create () {
      let postData = {
        name: this.name,
        limit: this.limit,
        isPublic: this.isPublic,
        password: this.password
      }
      api.createRoom(postData, res => {
        shared.room = res

        api.joinRoom({
          uid: shared.player._uid,
          roomId: shared.room.id
        }, res => {
          shared.room = res
          this.$emit('close-pop-crt-room')
          nav.go('room')
        })
      })
    },
    cancel () {
      this.$emit('close-pop-crt-room')
    }
  },
};
</script>

<style lang="css">
</style>
