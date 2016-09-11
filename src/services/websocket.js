import { wsServer } from '../config.js'
import ws from 'socket.io-client'

let _socket

function init () {
  if (typeof _socket === 'undefined') {
    _socket = ws(wsServer)
  }
}

function register (eventName, callBack) {
  if (typeof _socket === 'undefined') return

  _socket.on(eventName, callBack)

  function send (name) {
    return msg => _socket.emit(name, msg)
  }

  return {
    send: send(eventName)
  }
}

export default {
  init,
  register
}
