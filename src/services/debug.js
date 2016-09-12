import { debugMode } from '../config.js'

const _debuggerSchema = {
  log: {
    output: '%c[Log ]%c %s: %s %o',
    style: 'padding: 2px 5px;',
    trace: false
  },
  done: {
    output: '%c[Done]%c %s: %s %o',
    style: 'padding: 3px 5px; color: rgb(12, 87, 33); background-color: rgb(190, 245, 216);',
    trace: false
  },
  warn: {
    output: '%c[Warn]%c %s: %s %o',
    style: 'padding: 3px 5px; color: rgb(87, 86, 12); background-color: rgb(245, 239, 190);',
    trace: true
  },
  error: {
    output: '%c[Err ]%c %s: %s %o',
    style: 'padding: 3px 5px; color: rgb(87, 12, 12); background-color: rgb(245, 190, 190);',
    trace: true
  }
}

function _fnGen (name, source) {
  return function (source, msg, obj) {
    if (debugMode) {
      console.log(
                this.output,
                this.style,
                '',
                source, msg, obj
            )
      if (this.trace) console.trace()
    }
  }.bind(_debuggerSchema[name], source)
}

function _serviceGen () {
  return Object.defineProperty({}, 'getDebugger', {
    value: function (source) {
      return Object.keys(_debuggerSchema).reduce(
        (o, k) => Object.defineProperty(o, k, {
          value: _fnGen(k, source)
        })
      , {})
    }
  })
}

export default _serviceGen()
