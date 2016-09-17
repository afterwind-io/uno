import Vue from 'vue'
import routes from './services/routes.js'
import './app.less'

const app = new Vue({
  el: '#app',
  data () {
    return {
      currentRoute: window.location.hash
    }
  },
  computed: {
    CurrentPage () {
      return routes.GetPageByRoute(this.currentRoute)
    }
  },
  render (h) { return h(this.CurrentPage) }
})

window.addEventListener('hashchange', () => {
  app.currentRoute = window.location.hash
})

// import {Player, Uno} from './uno.js'
//
// let players = Array(6).fill(0).map(p => new Player())
// let uno = new Uno(players)
// uno.start()
