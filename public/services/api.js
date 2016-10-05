import { apiServerUrl, apis } from '../config.js'
import { findIndex } from './util.js'
import debug from './debug.js'
import rest from './restful.js'

let _debug = debug.getDebugger('api')

let _locks = []
let _findLock = req => findIndex.bind(null, _locks, r => r === req)

function _requireLock (req) {
  let flag = _findLock(req)() === -1

  flag
    ? _locks.push(req)
    : _debug.warn(`[req]api/${req} may duplicate, abort.`)

  return flag
}
function _releaseLock (req) {
  let index = _findLock(req)()

  index !== -1 ? _locks.splice(index, 1) : ''
}

const apiGen = apis => apis.reduce(
  (o, api) => {
    if (o.hasOwnProperty(api.name)) {
      _debug.warn(`[api]Duplicate api definition! Api: ${api.name}`)

      return o
    } else {
      return Object.defineProperty(o, api.name, {
        value: function (data) {
          _debug.done(`[req]<${api.name}> is pending...`, JSON.stringify(data))

          if (!_requireLock(api.name)) return

          return new Promise((resolve, reject) => {
            rest[api.method](apiServerUrl + api.uri, data,
              res => {
                _releaseLock(api.name)
                _debug.done(`[req]<${api.name}> fetched.`, res)
                resolve(res)
              },
              err => {
                _releaseLock(api.name)
                reject(err)
              })
          })
        }
      })
    }
  }, {})

export default apiGen(apis)
