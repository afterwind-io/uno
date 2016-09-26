import { wsServerUrl } from '../config.js'
import ws from 'socket.io-client'
import debug from './debug.js'

const _TUNNEL = 'main'
let _socket
let _debugger = debug.getDebugger('ws')

function _emit (msg) {
  _debugger.done('[msg] =>', JSON.stringify(msg))
  _socket.emit(_TUNNEL, msg)
}

export default {
  init () {
    if (typeof _socket === 'undefined') {
      _socket = ws(wsServerUrl)
    }
  },
  login (params) {
    if (typeof _socket === 'undefined') return

    _emit({ title: 'login', content: params})
  },
  logout () {
    if (typeof _socket === 'undefined') return

    _emit({ title: 'logout', content: '' })
  },
  register (callback) {
    if (typeof _socket === 'undefined') return

    _socket.on(_TUNNEL, msg => {
      _debugger.done('[msg] <=', JSON.stringify(msg))
      callback(msg)
    })

    return {
      send: _emit
    }
  },
  getSocket () {
    return _socket
  }
}
