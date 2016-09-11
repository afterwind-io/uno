import Vue from 'vue'
import routes from './routes.js'

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
  console.log('www')
  app.currentRoute = window.location.hash
})
