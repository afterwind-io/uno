const flow = require('../../utils/async.js').flow

const Redis = require('ioredis')
const redis = new Redis({
  port: 6379,
  host: '127.0.0.1',
  db: 0
})

module.exports = {
  add ({ uid }) {
    return flow(function* () {
      let _uid = uid.toString()
      yield redis.sadd('onlines', _uid)
      return _uid
    })
  },
  remove ({ uid }) {
    return flow(function* () {
      let _uid = uid.toString()
      yield redis.srem('onlines', _uid)
      return _uid
    })
  },
  check ({ uid }) {
    return flow(function* () {
      let _uid = uid.toString()
      return yield redis.sismember('onlines', _uid) === 1
    })
  }
}
