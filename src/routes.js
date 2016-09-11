import { find } from './util.js'

import home from './pages/home.vue'
import about from './pages/about.vue'
import lobby from './pages/lobby.vue'
import p404 from './pages/404.vue'

const _pages = [
  { name: 'home', uri: '#/', page: home },
  { name: 'lobby', uri: '#/lobby', page: lobby },
  { name: 'about', uri: '#/about', page: about },
  { name: '404', uri: '#/404', page: p404 }
]

export default {
  GetUriByName (name) {
    return find(_pages, p => p.name === name).uri || '#/404'
  },
  GetPageByName (name) {
    return find(_pages, p => p.name === name).page || p404
  },
  GetPageByRoute (route) {
    return find(_pages, p => p.uri === route).page || p404
  }
}
