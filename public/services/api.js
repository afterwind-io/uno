import { apiServerUrl, apis } from '../config.js'
import debug from './debug.js'
import rest from './restful.js'

let _debug = debug.getDebugger('api')

let _locks = new Set()

function _requireLock (req) {
  let flag = !_locks.has(req)

  flag
    ? _locks.add(req)
    : _debug.warn(`[req]api/${req} may duplicate, abort.`)

  return flag
}
function _releaseLock (req) {
  _locks.delete(req)
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
