<template>
  <div class="mainFrame">
    <header>

    </header>

    <section>
      <div class="mainBox">
        <div class="logoBox">
          <h1>UNO</h1>
          <h3>alpha 0.0.1</h3>
        </div>
        <div class="infoBox">
          <div class="contentBox">
            <transition name="page-flip">
              <div class="content" v-show="page === 'login'">
                <p>Player Name:</p>
                <input type="text" v-model="user.name">
                <input type="button" @click="_register" value="注册">
                <input type="button" @click="_login" value="登录">
              </div>
            </transition>
            <transition name="page-flip">
              <div class="content" v-show="page === 'news'">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </transition>
            <transition name="page-flip">
              <div class="content" v-show="page === 'about'">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi, eius, quae. Aspernatur dicta reprehenderit eligendi velit sunt neque iste excepturi laboriosam obcaecati quo expedita nihil perspiciatis labore soluta quod, at.
              </div>
            </transition>
          </div>
          <div class="menu">
            <ul>
              <li :class="{'page-focus': page === 'login' }" @click="switchPage('login')">Login</li>
              <li :class="{'page-focus': page === 'news' }" @click="switchPage('news')">News</li>
              <li :class="{'page-focus': page === 'about' }" @click="switchPage('about')">About</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer>
      A personal project by Afterwind.
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'

ws.init()

export default {
  data () {
    return {
      page: 'login',
      user: {
        name: 'Doge',
        password: ''
      }
    };
  },
  methods: {
    ...mapActions(['register', 'login']),
    _register () {
      this.register(this.user)
        .then(res => {
          ws.login({uid: res.uid})
          nav.go('lobby')
        })
    },
    _login () {
      this.login(this.user)
        .then(res => {
          ws.login({uid: res.uid})
          nav.go('lobby')
        })
    },
    switchPage (page) {
      this.page = page
    }
  }
}
</script>

<style lang="less" scoped>
.page-flip-enter-active, .page-flip-leave-active {

}
.page-flip-enter {
  transform: translateX(-20%) scale(0.8);
  opacity: 0;
}
.page-flip-leave-active {
  transform: translateX(20%) scale(0.8);
  opacity: 0;
}

.mainFrame {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
header {
  flex-grow: 1;
}
section {
  height: 80vh;
  display: flex;
  align-items: center;
  // background-color: rgba(255, 0, 0, 0.5);
}
section:before {
  content: '';
  float: left;
  flex-grow: 1;
}
section:after {
  content: '';
  float: right;
  flex-grow: 1;
}
.mainBox {
  height: 80%;
  width: 800px;
  max-height: 500px;
  display: flex;
}
.logoBox {
  width: 40%;
  // background-color: rgba(255, 0, 0, 0.5);
  text-align: right;
  padding: 0 20px;
  border-right: 1px solid rgba(54, 61, 66, 0.2);
}
h1 {
  font-size: 108px;
  line-height: 120px;
}
h3 {
  font-size: 24px;
  line-height: 30px;
}
.infoBox {
  width: 60%;
  display: flex;
  flex-direction: column;
  // background-color: rgba(255, 0, 0, 0.5);
}
.contentBox {
  position: relative;
  // min-height: 80%;
  // max-height: 80%;
  flex-grow: 1;
  overflow: hidden;
}
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  transform-style: preserve-3d;
  transition: 300ms;
}
ul {
  width: 100%;
  height: 100%;
  text-align: center;
  // padding: 0 20px;
  display: flex;
}
li {
  flex-grow: 1;
  list-style: none;
  font-size: 36px;
  height: 60px;
  transition: 200ms;
  transform-style: preserve-3d;
}
.page-focus{
  transform: scale(1.3, 1.3);
  text-shadow: 2px 2px 2px rgba(50, 50, 50, 0.2);
}
li:hover {
  transform: scale(1.3, 1.3);
  text-shadow: 2px 2px 2px rgba(50, 50, 50, 0.2);
}
footer {
  flex-grow: 1;
  text-align: center;
}
</style>
