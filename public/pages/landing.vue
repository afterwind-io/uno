<template>
  <div class="mainFrame">
    <header>

    </header>

    <section>
      <div class="logoBox">
        <h1>UNO</h1>
        <h3>alpha 0.0.1</h3>
      </div>
      <div class="infoBox">
        <div class="contentBox">
          <transition name="page-flip">
            <div class="content" v-show="page === 'login'">
              <div class="loginBox">
                <div class="entryBox avatarBox">
                  <div class="avatar"></div>
                </div>
                <div class="entryBox entry">
                  <input type="text" v-model="user.name">
                  <i class="flaticon-avatar"></i>

                </div>
                <div class="entryBox entry">
                  <input type="text" v-model="user.password">
                  <i class="flaticon-padlock"></i>

                </div>
                <div class="entryBox funcBox">
                  <p type="button" @click="_register">注册</p>
                  <p type="button" @click="_login">登录</p>
                  <!-- <i-arrow :state="arrowState" :whenClick="wow"></i-arrow> -->
                </div>
              </div>
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
            <li :class="{'page-focus': page === 'news' }" @click="switchPage('news')">News</li>
            <li :class="{'page-focus': page === 'login' }" @click="switchPage('login')">Login</li>
            <li :class="{'page-focus': page === 'about' }" @click="switchPage('about')">About</li>
          </ul>
        </div>
      </div>
    </section>

    <footer>
      <p>A personal project by Afterwind. Made by <i class="flaticon-heart"></i></p>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ws from '../services/websocket.js'
import nav from '../services/navigation.js'
import iconArrow from '../components/icon-hori-arrow.vue'

ws.init()

export default {
  data () {
    return {
      page: 'login',
      arrowState: 'right',
      user: {
        name: 'Doge',
        password: 'Doge'
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
    },
    wow () {
      this.arrowState = this.arrowState === 'middle' ? 'right' : 'middle'
    }
  },
  components: {
    'i-arrow': iconArrow
  }
}
</script>

<style lang="less" scoped>
.page-flip-enter-active, .page-flip-leave-active {
  transform-style: preserve-3d;
  transition: 300ms;
}
.page-flip-enter {
  transform: scale(0.8);
  opacity: 0;
}
.page-flip-leave-active {
  transform: scale(1.2);
  opacity: 0;
}

.mainFrame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
header {
  height: 10%;
}
section {
  height: 80%;
  display: flex;
  // align-items: flex-start;
}
// section:before {
//   content: '';
//   float: left;
//   flex-grow: 1;
// }
// section:after {
//   content: '';
//   float: right;
//   flex-grow: 1;
// }
footer {
  height: 10%;
}
.logoBox {
  // background-color: rgba(255, 0, 0, 0.5);
  width: 40%;
  height: 100%;
  text-align: right;
  padding: 0 20px;
  // border-right: 1px solid rgba(54, 61, 66, 0.2);
}
.infoBox {
  width: 40%;
  height: 100%;
  // background-color: rgba(0, 255, 0, 0.5);
}
h1 {
  font-size: 108px;
  line-height: 120px;
}
h3 {
  font-size: 24px;
  line-height: 50px;
  padding: 0 5px;
}
.infoBox {
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 2px 2px 2px rgba(54, 61, 66, 0.2);
  display: flex;
  flex-direction: column;
}
.contentBox {
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.loginBox {
  flex-grow: 1;
  // background-color: rgba(255, 0, 0, 0.5);
}
.entryBox {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row-reverse;


  i {
    display: inline-block;
    margin-right: 20px;
    text-align: left;
    line-height: 50px;
    font-size: 30px;
    color: rgba(54, 61, 66, 0.8);
    transition: 300ms;
  }
  input {
    width: 60%;
    height: 50px;
    font-size: 20px;
    padding: 0 10px;
    transition: 300ms;
    color: rgba(54, 61, 66, 0.8);
    border-bottom: 2px solid rgba(54, 61, 66, 0.8);
  }
  input:focus {
    border-bottom: 2px solid orange;
  }
  input:focus+i{
    color: orange;
  }
}

.avatarBox {
  height: 150px;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid rgba(54, 61, 66, 0.8);
  overflow: hidden;
}

.i-h-arrow {
  transform: scale(.8, .8);
}

.menu{
  height: 100px;
  border-top: 1px solid rgba(54, 61, 66, 0.2);
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
  font-size: 30px;
  line-height: 100px;
  transition: 200ms;
}
.page-focus{
  transform: scale(1.3, 1.3);
  text-shadow: 0px 2px 2px rgba(54, 61, 66, 0.5);
}
li:hover {
  // transform: scale(1.3, 1.3);
  text-shadow: 0px 2px 2px fade(orange, 30%);
  color: orange;
}
footer p{
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 12px;
}
footer i{
  font-size: 18px;
}
</style>
