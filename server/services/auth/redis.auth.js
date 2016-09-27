const flow = require('../../utils/async.js').flow

const Redis = require('ioredis')
const redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  db: 0
})

module.exports = {
  add ({ gid }) {
    return flow(function* () {
      let _gid = gid.toString()
      yield redis.sadd('onlines', _gid)
      return _gid
    })
  },
  remove ({ gid }) {
    return flow(function* () {
      let _gid = gid.toString()
      yield redis.srem('onlines', _gid)
      return _gid
    })
  },
  check ({ gid }) {
    console.log('auth check ', gid)
    return flow(function* () {
      let _gid = gid.toString()
      let result = yield redis.sismember('onlines', _gid)
      return result === 1
    })
  }
}
