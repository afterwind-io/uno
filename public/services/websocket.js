import { wsServerUrl } from '../config.js'
import ws from 'socket.io-client'
import debug from './debug.js'

let _socket
let _modules = new Set()
let _debugger = debug.getDebugger('ws')

export default {
  init () {
    if (typeof _socket === 'undefined') {
      _socket = ws(wsServerUrl)
    }
  },
  login (params) {
    return typeof _socket !== 'undefined'
      ? this.emit('main', { head: 'login', body: params }) : undefined
  },
  logout () {
    return typeof _socket !== 'undefined'
      ? this.emit('main', { head: 'logout', body: '' }) : undefined
  },
  register ({module, ...handlers}) {
    if (typeof _socket === 'undefined') return
    if (_modules.has(module)) return

    _modules.add(module)

    for (var channel in handlers) {
      _socket.on(channel, msg => {
        _debugger.done(`[msg] ${channel} <=`, JSON.stringify(msg))
        handlers[channel](msg)
      })
    }
  },
  emit (channel, msg) {
    _debugger.done(`[msg] ${channel} =>`, JSON.stringify(msg))
    _socket.emit(channel, msg)
  }
}
