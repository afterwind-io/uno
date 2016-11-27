<template>
  <div class="mainFrame">
    <header>
      <div></div>
      <h1>大厅</h1>
      <p>快速匹配</p>
      <input type="button" @click="_logout" value="退出">

    </header>

    <section>
      <router-view></router-view>

    </section>

    <aside class="chat">
      <chat></chat>

    </aside>

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

<style lang="less" scoped>
@import "../app.less";

header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 10%;
  display: flex;
}

section {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  // background-color: rgba(255, 0, 0, 0.5);
}

aside {
  position: absolute;
  top: 10%;
  right: 0;
  width: 20%;
  height: 90%;
  background-color: white;
  box-shadow: @global-shadow-2dp;
  // background-color: rgba(255, 0, 0, 0.3);
}
</style>
