import Vue from 'vue'
import router from './routes.js'
import './app.less'
import main from './app.vue'

new Vue({
  router,
  template: main.template,
  render: main.render
}).$mount('#app')

// import {Player, Uno} from './uno.js'
//
// let players = Array(6).fill(0).map(p => new Player())
// let uno = new Uno(players)
// uno.start()
