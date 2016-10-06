<template>
  <div class="mainFrame">
    <h1>Home</h1>
    <input type="button" @click="_logout" value="退出">
    <router-view></router-view>
    <chat></chat>
    <popups></popups>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'
import chat from '../components/chat.vue'
import popups from '../components/popups.vue'


export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['currentGameRoom'])
  },
  methods: {
    ...mapActions([
      'logout',
    ]),
    _logout () {
      // TODO
      if(this.currentGameRoom.id){
        alert('请在退出登录前离开当前房间')
        return
      }

      this.logout().then(res => {
        ws.logout()
        nav.go('landing')
      })
    }
  },
  components: {
    chat,
    popups
  }
};
</script>

<style lang="css">
</style>
